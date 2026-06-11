"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreditCard, CheckCircle2, Loader2, Zap, Check, MapPin, Users, Star, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/toast";

const PLAN_FEATURES: Record<string, string[]> = {
  BASIC: [
    "1 store location",
    "Digital stamp cards via QR code",
    "Invoice-verified stamp approval",
    "Customer loyalty dashboard",
    "Counter display for in-store use",
    "Email support",
  ],
  GROWTH: [
    "Up to 3 store locations",
    "GPS-based branch auto-detection",
    "Staff accounts & role access",
    "Customer analytics & visit trends",
    "SMS marketing campaigns",
    "Priority support via WhatsApp",
  ],
  PRO: [
    "Up to 6 store locations",
    "Multi-manager team access",
    "ROI analytics & revenue insights",
    "Anti-fraud stamp protection",
    "Custom reward milestones",
    "Dedicated account manager",
  ],
};

interface Plan {
  id: string;
  name: string;
  code: string;
  monthlyPrice: number;
  maxCustomers: number;
  maxStaff: number;
  maxLocations: number;
}

interface Subscription {
  id: string;
  status: string;
  trialEndAt: string | null;
  subscriptionEndAt: string | null;
  plan: Plan;
}

declare global {
  interface Window {
    Razorpay: new (options: object) => { open: () => void };
  }
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function SubscriptionPage() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [paying, setPaying] = useState<string | null>(null);

  const { data: current, isLoading: loadingCurrent } = useQuery<Subscription | null>({
    queryKey: ["billing-current"],
    queryFn: () => api.get<Subscription>("/billing/current").catch(() => null),
  });

  const { data: expiryStatus } = useQuery<{ status: string; daysLeft: number } | null>({
    queryKey: ["billing-expiry-status"],
    queryFn: () => api.get<{ status: string; daysLeft: number }>("/billing/expiry-status").catch(() => null),
  });

  const { data: plans = [], isLoading: loadingPlans } = useQuery<Plan[]>({
    queryKey: ["billing-plans"],
    queryFn: () => api.get<Plan[]>("/billing/plans"),
  });

  const verifyMutation = useMutation({
    mutationFn: (body: object) => api.post("/billing/verify-payment", body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing-current"] });
      toast.success("Subscription activated!");
    },
    onError: (err: Error) => toast.error(err.message || "Payment verification failed."),
  });

  async function handleSubscribe(plan: Plan) {
    setPaying(plan.id);
    try {
      const loaded = await loadRazorpay();
      if (!loaded) { toast.error("Failed to load payment gateway."); return; }

      const order = await api.post<{ orderId: string; amount: number; currency: string; keyId: string }>(
        "/billing/create-order", { planId: plan.id }
      );

      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "RegularsClub",
        description: `${plan.name} – Monthly`,
        order_id: order.orderId,
        handler: (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          verifyMutation.mutate({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            planId: plan.id,
          });
        },
        theme: { color: "#F59E0B" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error((err as Error).message || "Failed to initiate payment.");
    } finally {
      setPaying(null);
    }
  }

  const isCurrentPlan = (planId: string) => current?.plan?.id === planId;
  const isActive = current?.status === "ACTIVE";
  const isTrial = current?.status === "TRIAL";
  const expiry = current?.subscriptionEndAt ?? current?.trialEndAt;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-50">Subscription</h1>
        <p className="text-xs text-stone-500 font-medium mt-0.5">Manage your plan and billing.</p>
      </div>

      {/* Expiry warning banner */}
      {expiryStatus && expiryStatus.status !== "ok" && (
        <div className="flex items-center gap-3 p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5">
          <AlertTriangle className="size-4 text-amber-400 shrink-0" />
          <div>
            <p className="text-xs font-bold text-amber-300">
              {expiryStatus.status === "grace"
                ? `Subscription expired — ${7 + expiryStatus.daysLeft} day${7 + expiryStatus.daysLeft !== 1 ? "s" : ""} of grace period remaining`
                : `Subscription expires in ${expiryStatus.daysLeft} day${expiryStatus.daysLeft !== 1 ? "s" : ""}`}
            </p>
            <p className="text-[10px] text-stone-500 mt-0.5">Renew now to avoid service interruption.</p>
          </div>
        </div>
      )}

      {/* Current plan status */}
      {!loadingCurrent && current && (
        <Card className="border-stone-800/80 bg-[#14100E] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <CreditCard className="size-5 text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-black text-stone-100">{current.plan.name}</p>
                <p className="text-[10px] font-mono text-stone-500 uppercase tracking-widest">{current.plan.code}</p>
              </div>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded border font-black uppercase tracking-wider ${
              isActive ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
              isTrial ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
              "bg-rose-500/10 text-rose-400 border-rose-500/20"
            }`}>
              {current.status}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { icon: Users, label: "Staff", val: current.plan.maxStaff },
              { icon: MapPin, label: "Locations", val: current.plan.maxLocations },
              { icon: Star, label: "Customers", val: current.plan.maxCustomers },
            ].map(({ icon: Icon, label, val }) => (
              <div key={label} className="bg-stone-900/40 rounded-xl p-3 border border-stone-900">
                <Icon className="size-3.5 text-stone-500 mx-auto mb-1" />
                <p className="text-sm font-black text-stone-100">{val}</p>
                <p className="text-[10px] text-stone-500">{label}</p>
              </div>
            ))}
          </div>

          {expiry && (
            <p className="text-[11px] text-stone-500 text-center">
              {isTrial ? "Trial ends" : "Renews"} on{" "}
              <span className="font-bold text-stone-300">
                {new Date(expiry).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </p>
          )}
        </Card>
      )}

      {/* Plans */}
      <div>
        <h2 className="text-xs font-black text-stone-500 uppercase tracking-widest mb-4">Available Plans</h2>
        {loadingPlans ? (
          <div className="py-10 flex items-center justify-center"><Loader2 className="size-5 animate-spin text-amber-500" /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans.map((plan) => {
              const isCurrent = isCurrentPlan(plan.id);
              return (
                <Card key={plan.id} className={`border rounded-2xl p-5 space-y-4 flex flex-col ${isCurrent ? "border-amber-500/40 bg-amber-500/5" : "border-stone-800/80 bg-[#14100E]"}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-black text-stone-100">{plan.name}</p>
                      <p className="text-[10px] font-mono text-stone-500 uppercase">{plan.code}</p>
                    </div>
                    {isCurrent && <CheckCircle2 className="size-4 text-amber-400 shrink-0 mt-0.5" />}
                  </div>

                  <div className="text-center py-2 border-y border-stone-900">
                    <span className="text-2xl font-black text-amber-400">₹{plan.monthlyPrice}</span>
                    <span className="text-xs text-stone-500 ml-1">/ mo</span>
                  </div>

                  <ul className="space-y-2 flex-1">
                    {(PLAN_FEATURES[plan.code] ?? []).map((f) => (
                      <li key={f} className="flex items-start gap-2 text-[11px] text-stone-400">
                        <Check className="size-3 text-stone-600 shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSubscribe(plan)}
                    disabled={isCurrent && isActive || paying === plan.id || verifyMutation.isPending}
                    className={`w-full h-9 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all ${
                      isCurrent && isActive
                        ? "bg-stone-800 text-stone-500 cursor-default"
                        : "bg-amber-500 hover:bg-amber-400 text-stone-950"
                    }`}
                  >
                    {paying === plan.id || verifyMutation.isPending
                      ? <Loader2 className="size-3.5 animate-spin" />
                      : <Zap className="size-3.5" />}
                    {isCurrent && isActive ? "Current Plan" : isCurrent && isTrial ? "Activate Now" : "Subscribe"}
                  </button>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
