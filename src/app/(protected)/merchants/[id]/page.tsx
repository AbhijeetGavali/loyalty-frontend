"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Store, Users, Ticket, CreditCard, Loader2, MessageSquare, CheckCircle2, X, Eye, EyeOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/toast";
import { useState } from "react";

function WaConfigPanel({ merchantId }: { merchantId: string }) {
  const toast = useToast();
  interface WaConfig {
    hasSecret: boolean;
    updatedAt: string;
  }

  const queryClient = useQueryClient();
  const [form, setForm] = useState({ waPhoneNumberId: "", waToken: "", waSecret: "" });
  const [showToken, setShowToken] = useState(false);

  const { data: waConfig } = useQuery<WaConfig | null>({
    queryKey: ["admin-wa-config", merchantId],
    queryFn: () => api.get<WaConfig | null>(`/admin/merchants/${merchantId}/wa-config`),
  });

  const saveMutation = useMutation({
    mutationFn: (data: object) => api.put(`/admin/merchants/${merchantId}/wa-config`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-wa-config", merchantId] }); toast.success("WA config saved."); setForm({ waPhoneNumberId: "", waToken: "", waSecret: "" }); },
    onError: (err: Error) => toast.error(err.message || "Failed to save."),
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/admin/merchants/${merchantId}/wa-config`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-wa-config", merchantId] }); toast.success("WA config removed."); },
    onError: (err: Error) => toast.error(err.message || "Failed to remove."),
  });

  const hasConfig = !!waConfig;

  return (
    <Card className="border-stone-800 bg-[#14100E] rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
          <MessageSquare className="size-3.5 text-green-400" /> WhatsApp API Config
        </p>
        {hasConfig && (
          <span className="text-[9px] px-1.5 py-0.5 rounded border font-bold text-emerald-400 bg-emerald-500/10 border-emerald-500/20 flex items-center gap-1">
            <CheckCircle2 className="size-2.5" /> Configured
          </span>
        )}
      </div>

      {hasConfig && (
        <div className="p-3 bg-stone-900/50 rounded-xl border border-stone-900 text-[11px] space-y-1 text-stone-400">
          <p>Phone Number ID: <span className="text-stone-200 font-bold">••••••• (set)</span></p>
          <p>Token: <span className="text-stone-200 font-bold">••••••• (set)</span></p>
          <p>Secret: <span className="text-stone-200 font-bold">{waConfig.hasSecret ? "set" : "not set"}</span></p>
          <p className="text-[9px] text-stone-600">Updated {new Date(waConfig.updatedAt).toLocaleString()}</p>
        </div>
      )}

      <div className="space-y-3">
        <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">{hasConfig ? "Update credentials" : "Set credentials"}</p>
        {[
          { key: "waPhoneNumberId", label: "Phone Number ID", type: "text" },
          { key: "waToken", label: "Access Token", type: showToken ? "text" : "password" },
          { key: "waSecret", label: "Webhook Verify Secret (optional)", type: "text" },
        ].map(({ key, label, type }) => (
          <div key={key} className="space-y-1 relative">
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">{label}</label>
            <div className="relative">
              <input type={type} value={form[key as keyof typeof form]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                className="w-full h-9 px-3 bg-[#0C0A09] border border-stone-800 rounded-xl text-stone-100 text-xs focus:outline-none focus:border-amber-500/50"
                placeholder={hasConfig ? "Leave blank to keep existing" : ""}
              />
              {key === "waToken" && (
                <button type="button" onClick={() => setShowToken(v => !v)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-600 hover:text-stone-400">
                  {showToken ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                </button>
              )}
            </div>
          </div>
        ))}
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => saveMutation.mutate(form)}
            disabled={saveMutation.isPending || (!form.waPhoneNumberId && !hasConfig) || (!form.waToken && !hasConfig)}
            className="flex-1 h-8 bg-green-600 hover:bg-green-500 disabled:bg-stone-800 disabled:text-stone-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
          >
            {saveMutation.isPending ? <Loader2 className="size-3 animate-spin" /> : <CheckCircle2 className="size-3" />}
            {hasConfig ? "Update" : "Activate"}
          </button>
          {hasConfig && (
            <button onClick={() => deleteMutation.mutate()} disabled={deleteMutation.isPending}
              className="h-8 px-3 border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 text-xs font-bold rounded-xl flex items-center gap-1">
              <X className="size-3" /> Remove
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}

interface Payment {
  id: string;
  createdAt: string;
  status: string;
  amount: number;
}

interface MerchantDetail {
  name: string;
  type?: string;
  location?: string;
  owner?: { email?: string; createdAt?: string; isActive?: boolean };
  _count?: { cards?: number; stampRequests?: number };
  subscription?: {
    status: string;
    subscriptionStartAt?: string;
    plan?: { name?: string; monthlyPrice?: number };
    payments?: Payment[];
  };
  loyaltyProgram?: Array<{ title: string; stampsRequired: number; rewardTitle?: string; isActive?: boolean }>;
}

export default function MerchantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: merchant, isLoading, isError } = useQuery<MerchantDetail>({
    queryKey: ["admin-merchant", id],
    queryFn: () => api.get<MerchantDetail>(`/admin/merchants/${id}`),
  });

  if (isLoading) return (
    <div className="py-32 flex items-center justify-center">
      <Loader2 className="size-6 animate-spin text-amber-500" />
    </div>
  );

  if (isError || !merchant) return (
    <div className="py-32 text-center text-rose-400 text-sm">Failed to load merchant details.</div>
  );

  const sub = merchant.subscription;
  const program = merchant.loyaltyProgram?.[0];

  return (
    <div className="space-y-8 animate-fade-in max-w-3xl">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="size-9 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center hover:border-stone-700 transition-colors">
          <ArrowLeft className="size-4 text-stone-400" />
        </button>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-stone-50">{merchant.name}</h1>
          <p className="text-xs text-stone-500">{merchant.type} · {merchant.location}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { icon: Users, label: "Loyalty Cards", value: merchant._count?.cards ?? 0, color: "text-amber-400" },
          { icon: Ticket, label: "Stamp Requests", value: merchant._count?.stampRequests ?? 0, color: "text-blue-400" },
          { icon: CreditCard, label: "Plan", value: sub?.plan?.name ?? "None", color: "text-emerald-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="p-4 bg-[#14100E] border border-stone-800 rounded-2xl">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">{label}</span>
            <span className={`text-lg font-black block mt-1 ${color}`}>{value}</span>
          </div>
        ))}
      </div>

      {/* Owner */}
      <Card className="border-stone-800 bg-[#14100E] rounded-2xl p-5 space-y-3">
        <p className="text-xs font-black text-stone-400 uppercase tracking-widest">Owner</p>
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center">
            <Store className="size-5 text-amber-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-stone-100">{merchant.owner?.email}</p>
            <p className="text-[10px] text-stone-500">Joined {merchant.owner?.createdAt ? new Date(merchant.owner.createdAt).toLocaleDateString() : "—"}</p>
          </div>
          <span className={`ml-auto text-[9px] px-1.5 py-0.5 rounded border font-bold uppercase ${merchant.owner?.isActive ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-rose-400 bg-rose-500/10 border-rose-500/20"}`}>
            {merchant.owner?.isActive ? "Active" : "Suspended"}
          </span>
        </div>
      </Card>

      {/* Subscription */}
      {sub && (
        <Card className="border-stone-800 bg-[#14100E] rounded-2xl p-5 space-y-3">
          <p className="text-xs font-black text-stone-400 uppercase tracking-widest">Subscription</p>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div><span className="text-stone-500">Status</span><p className="font-bold text-stone-100 mt-0.5">{sub.status}</p></div>
            <div><span className="text-stone-500">Plan</span><p className="font-bold text-amber-400 mt-0.5">{sub.plan?.name ?? "—"}</p></div>
            <div><span className="text-stone-500">Monthly Price</span><p className="font-bold text-stone-100 mt-0.5">₹{sub.plan?.monthlyPrice ?? "—"}</p></div>
            <div><span className="text-stone-500">Started</span><p className="font-bold text-stone-100 mt-0.5">{sub.subscriptionStartAt ? new Date(sub.subscriptionStartAt).toLocaleDateString() : "—"}</p></div>
          </div>
          {(sub.payments?.length ?? 0) > 0 && (
            <div className="mt-2 pt-3 border-t border-stone-900">
              <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-2">Recent Payments</p>
              <div className="space-y-1.5">
                {sub.payments!.slice(0, 5).map((p) => (
                  <div key={p.id} className="flex justify-between text-xs">
                    <span className="text-stone-400">{new Date(p.createdAt).toLocaleDateString()}</span>
                    <span className={`font-bold ${p.status === "SUCCESS" ? "text-emerald-400" : "text-rose-400"}`}>₹{p.amount} · {p.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Loyalty Program */}
      {program && (
        <Card className="border-stone-800 bg-[#14100E] rounded-2xl p-5 space-y-3">
          <p className="text-xs font-black text-stone-400 uppercase tracking-widest">Loyalty Program</p>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div><span className="text-stone-500">Title</span><p className="font-bold text-stone-100 mt-0.5">{program.title}</p></div>
            <div><span className="text-stone-500">Stamps Required</span><p className="font-bold text-amber-400 mt-0.5">{program.stampsRequired}</p></div>
            <div><span className="text-stone-500">Reward</span><p className="font-bold text-stone-100 mt-0.5">{program.rewardTitle}</p></div>
            <div><span className="text-stone-500">Active</span><p className={`font-bold mt-0.5 ${program.isActive ? "text-emerald-400" : "text-rose-400"}`}>{program.isActive ? "Yes" : "No"}</p></div>
          </div>
        </Card>
      )}

      {/* WA Config */}
      <WaConfigPanel merchantId={id} />
    </div>
  );
}
