"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, X, Loader2, Users, CreditCard } from "lucide-react";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/toast";

interface Application {
  id: string;
  name: string;
  email: string;
  website: string | null;
  notes: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

interface Affiliate {
  id: string;
  referralCode: string;
  totalEarned: number;
  pendingBalance: number;
  isActive: boolean;
  user: { email: string };
  referrals: { id: string }[];
}

interface Payout {
  id: string;
  amount: number;
  status: "PENDING" | "PROCESSING" | "PAID" | "FAILED";
  paymentMethod: string;
  paymentDetails: Record<string, string> | null;
  createdAt: string;
  affiliate: { user: { email: string } };
}

const statusBadge = (s: string) => {
  const map: Record<string, string> = {
    PENDING: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    APPROVED: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    REJECTED: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    PAID: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    FAILED: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    PROCESSING: "text-sky-400 bg-sky-500/10 border-sky-500/20",
  };
  return `text-[9px] px-1.5 py-0.5 rounded border font-bold uppercase tracking-wide ${map[s] ?? "text-stone-400 bg-stone-800 border-stone-700"}`;
};

export default function AdminAffiliatesPage() {
  const toast = useToast();
  const qc = useQueryClient();
  const [tab, setTab] = useState<"applications" | "affiliates" | "payouts">("applications");

  const { data: applications = [], isLoading: loadingApps } = useQuery<Application[]>({
    queryKey: ["admin-affiliate-applications"],
    queryFn: () => api.get("/admin/affiliates/applications"),
    enabled: tab === "applications",
  });

  const { data: affiliates = [], isLoading: loadingAff } = useQuery<Affiliate[]>({
    queryKey: ["admin-affiliates"],
    queryFn: () => api.get("/admin/affiliates"),
    enabled: tab === "affiliates",
  });

  const { data: payouts = [], isLoading: loadingPayouts } = useQuery<Payout[]>({
    queryKey: ["admin-affiliate-payouts"],
    queryFn: () => api.get("/admin/affiliates/payouts"),
    enabled: tab === "payouts",
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => api.post(`/admin/affiliates/applications/${id}/approve`, {}),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-affiliate-applications"] }); toast.success("Application approved. Affiliate account created."); },
    onError: (e: Error) => toast.error(e.message),
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => api.post(`/admin/affiliates/applications/${id}/reject`, {}),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-affiliate-applications"] }); toast.success("Application rejected."); },
    onError: (e: Error) => toast.error(e.message),
  });

  const payoutMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "PAID" | "FAILED" }) =>
      api.post(`/admin/affiliates/payouts/${id}/process`, { status }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-affiliate-payouts"] }); toast.success("Payout updated."); },
    onError: (e: Error) => toast.error(e.message),
  });

  const tabs = [
    { key: "applications", label: "Applications", count: applications.filter(a => a.status === "PENDING").length },
    { key: "affiliates", label: "Active Affiliates", count: affiliates.length },
    { key: "payouts", label: "Payouts", count: payouts.filter(p => p.status === "PENDING").length },
  ] as const;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-50">Affiliate Program</h1>
        <p className="text-xs text-stone-500 mt-0.5">Manage applications, affiliates, and payouts.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-stone-900/60 rounded-xl p-1 w-fit">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${tab === t.key ? "bg-stone-800 text-stone-100" : "text-stone-500 hover:text-stone-300"}`}
          >
            {t.label}
            {t.count > 0 && <span className="size-4 rounded-full bg-amber-500 text-stone-950 text-[9px] font-black flex items-center justify-center">{t.count}</span>}
          </button>
        ))}
      </div>

      {/* Applications tab */}
      {tab === "applications" && (
        <div className="space-y-3">
          {loadingApps && <div className="py-10 flex justify-center"><Loader2 className="size-5 animate-spin text-amber-500" /></div>}
          {!loadingApps && applications.length === 0 && <p className="text-xs text-stone-500 py-8 text-center">No applications yet.</p>}
          {applications.map(app => (
            <Card key={app.id} className="border-stone-800/80 bg-[#14100E] rounded-2xl p-4 flex items-start justify-between gap-4 flex-wrap">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-black text-stone-100">{app.name}</p>
                  <span className={statusBadge(app.status)}>{app.status}</span>
                </div>
                <p className="text-xs text-stone-400">{app.email}</p>
                {app.website && <p className="text-xs text-stone-500">{app.website}</p>}
                {app.notes && <p className="text-xs text-stone-600 max-w-sm">{app.notes}</p>}
                <p className="text-[10px] text-stone-700">{new Date(app.createdAt).toLocaleDateString("en-IN")}</p>
              </div>
              {app.status === "PENDING" && (
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => approveMutation.mutate(app.id)}
                    disabled={approveMutation.isPending}
                    className="h-8 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold flex items-center gap-1"
                  >
                    <Check className="size-3" /> Approve
                  </button>
                  <button
                    onClick={() => rejectMutation.mutate(app.id)}
                    disabled={rejectMutation.isPending}
                    className="h-8 px-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 text-xs font-bold flex items-center gap-1"
                  >
                    <X className="size-3" /> Reject
                  </button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Affiliates tab */}
      {tab === "affiliates" && (
        <div className="space-y-3">
          {loadingAff && <div className="py-10 flex justify-center"><Loader2 className="size-5 animate-spin text-amber-500" /></div>}
          {!loadingAff && affiliates.length === 0 && <p className="text-xs text-stone-500 py-8 text-center">No active affiliates.</p>}
          {affiliates.map(a => (
            <Card key={a.id} className="border-stone-800/80 bg-[#14100E] rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center">
                  <Users className="size-4 text-amber-500" />
                </div>
                <div>
                  <p className="text-xs font-black text-stone-100">{a.user.email}</p>
                  <p className="text-[10px] font-mono text-amber-400">{a.referralCode}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-xs">
                <div className="text-center">
                  <p className="font-black text-stone-100">{a.referrals.length}</p>
                  <p className="text-[10px] text-stone-500">Referrals</p>
                </div>
                <div className="text-center">
                  <p className="font-black text-amber-400">₹{a.totalEarned.toFixed(0)}</p>
                  <p className="text-[10px] text-stone-500">Earned</p>
                </div>
                <div className="text-center">
                  <p className="font-black text-violet-400">₹{a.pendingBalance.toFixed(0)}</p>
                  <p className="text-[10px] text-stone-500">Pending</p>
                </div>
                <span className={statusBadge(a.isActive ? "APPROVED" : "REJECTED")}>{a.isActive ? "Active" : "Inactive"}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Payouts tab */}
      {tab === "payouts" && (
        <div className="space-y-3">
          {loadingPayouts && <div className="py-10 flex justify-center"><Loader2 className="size-5 animate-spin text-amber-500" /></div>}
          {!loadingPayouts && payouts.length === 0 && <p className="text-xs text-stone-500 py-8 text-center">No payout requests.</p>}
          {payouts.map(p => (
            <Card key={p.id} className="border-stone-800/80 bg-[#14100E] rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center">
                  <CreditCard className="size-4 text-amber-500" />
                </div>
                <div>
                  <p className="text-xs font-black text-stone-100">{p.affiliate.user.email}</p>
                  <p className="text-[10px] text-stone-500">
                    {p.paymentMethod} · {p.paymentDetails?.upiId ?? "Bank Transfer"} · {new Date(p.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-sm font-black text-amber-400">₹{p.amount}</p>
                <span className={statusBadge(p.status)}>{p.status}</span>
                {p.status === "PENDING" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => payoutMutation.mutate({ id: p.id, status: "PAID" })}
                      disabled={payoutMutation.isPending}
                      className="h-7 px-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 text-[10px] font-bold"
                    >
                      Mark Paid
                    </button>
                    <button
                      onClick={() => payoutMutation.mutate({ id: p.id, status: "FAILED" })}
                      disabled={payoutMutation.isPending}
                      className="h-7 px-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 text-[10px] font-bold"
                    >
                      Failed
                    </button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
