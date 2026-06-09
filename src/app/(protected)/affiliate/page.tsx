"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Users, Copy, CheckCircle2, Loader2, DollarSign, Clock, Check, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/toast";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://loyalty.ideasprout.in";

interface Affiliate {
  id: string;
  referralCode: string;
  commissionRate: number;
  totalEarned: number;
  totalPaid: number;
  pendingBalance: number;
  isActive: boolean;
  referrals: {
    id: string;
    status: "PENDING" | "CONVERTED" | "EXPIRED";
    commission: number | null;
    convertedAt: string | null;
    createdAt: string;
    referredBusiness: { id: string; name: string; createdAt: string };
  }[];
  payouts: {
    id: string;
    amount: number;
    status: "PENDING" | "PROCESSING" | "PAID" | "FAILED";
    paymentMethod: string;
    createdAt: string;
    processedAt: string | null;
  }[];
}

const statusColor = {
  PENDING: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  CONVERTED: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  EXPIRED: "text-stone-400 bg-stone-800 border-stone-700",
  PROCESSING: "text-sky-400 bg-sky-500/10 border-sky-500/20",
  PAID: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  FAILED: "text-rose-400 bg-rose-500/10 border-rose-500/20",
};

export default function AffiliatePage() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);
  const [showPayoutForm, setShowPayoutForm] = useState(false);
  const [payoutForm, setPayoutForm] = useState({ amount: "", paymentMethod: "UPI" as "UPI" | "BANK_TRANSFER", upiId: "" });

  const { data: affiliate, isLoading, isError } = useQuery<Affiliate>({
    queryKey: ["affiliate-me"],
    queryFn: () => api.get<Affiliate>("/affiliate/me"),
    retry: false,
  });

  const registerMutation = useMutation({
    mutationFn: () => api.post("/affiliate/register", {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["affiliate-me"] }),
    onError: (err: Error) => toast.error(err.message),
  });

  const payoutMutation = useMutation({
    mutationFn: (body: object) => api.post("/affiliate/payout/request", body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["affiliate-me"] });
      setShowPayoutForm(false);
      toast.success("Payout request submitted!");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  function copyLink() {
    if (!affiliate) return;
    const link = `${BASE_URL}/register-business?ref=${affiliate.referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function submitPayout(e: React.FormEvent) {
    e.preventDefault();
    payoutMutation.mutate({
      amount: parseFloat(payoutForm.amount),
      paymentMethod: payoutForm.paymentMethod,
      paymentDetails: payoutForm.paymentMethod === "UPI" ? { upiId: payoutForm.upiId } : {},
    });
  }

  if (isLoading) return <div className="py-20 flex items-center justify-center"><Loader2 className="size-6 animate-spin text-amber-500" /></div>;

  // Not yet an affiliate
  if (isError || !affiliate) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-50">Affiliate Program</h1>
          <p className="text-xs text-stone-500 mt-0.5">Earn 20% commission for every business you refer.</p>
        </div>
        <Card className="border-stone-800/80 bg-[#14100E] rounded-2xl p-8 text-center space-y-5">
          <div className="size-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Users className="size-7 text-amber-400" />
          </div>
          <div>
            <p className="text-lg font-black text-stone-100">Join the Affiliate Program</p>
            <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
              Refer other cafe owners to RegularsClub and earn <span className="text-amber-400 font-bold">20% commission</span> on their first payment.
            </p>
          </div>
          <ul className="text-[11px] text-stone-500 space-y-1.5 max-w-xs mx-auto text-left">
            {["Get a unique referral link", "Share with other business owners", "Earn ₹99–₹399 per signup", "Minimum payout: ₹500 via UPI"].map(f => (
              <li key={f} className="flex items-center gap-2"><Check className="size-3 text-amber-500" />{f}</li>
            ))}
          </ul>
          <Button
            onClick={() => registerMutation.mutate()}
            disabled={registerMutation.isPending}
            className="h-10 px-6 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm rounded-xl"
          >
            {registerMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : "Activate My Affiliate Account"}
          </Button>
        </Card>
      </div>
    );
  }

  const referralLink = `${BASE_URL}/register-business?ref=${affiliate.referralCode}`;
  const converted = affiliate.referrals.filter(r => r.status === "CONVERTED").length;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-50">Affiliate Program</h1>
          <p className="text-xs text-stone-500 mt-0.5">Your referral code: <span className="font-mono text-amber-400">{affiliate.referralCode}</span></p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Referrals", value: affiliate.referrals.length, icon: Users, color: "text-sky-400" },
          { label: "Converted", value: converted, icon: CheckCircle2, color: "text-emerald-400" },
          { label: "Total Earned", value: `₹${affiliate.totalEarned.toFixed(0)}`, icon: DollarSign, color: "text-amber-400" },
          { label: "Pending Balance", value: `₹${affiliate.pendingBalance.toFixed(0)}`, icon: Clock, color: "text-violet-400" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="border-stone-800/80 bg-[#14100E] rounded-2xl p-4 space-y-2">
            <Icon className={`size-4 ${color}`} />
            <p className="text-xl font-black text-stone-100">{value}</p>
            <p className="text-[10px] text-stone-500 uppercase tracking-wider">{label}</p>
          </Card>
        ))}
      </div>

      {/* Referral Link */}
      <Card className="border-stone-800/80 bg-[#14100E] rounded-2xl p-5 space-y-3">
        <p className="text-xs font-black text-stone-400 uppercase tracking-wider">Your Referral Link</p>
        <div className="flex gap-2">
          <Input
            readOnly
            value={referralLink}
            className="bg-stone-900 border-stone-800 text-stone-300 text-xs rounded-xl h-9 font-mono"
          />
          <Button onClick={copyLink} className="h-9 px-4 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs rounded-xl flex items-center gap-1.5 shrink-0">
            {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </Card>

      {/* Payout */}
      <Card className="border-stone-800/80 bg-[#14100E] rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-black text-stone-400 uppercase tracking-wider">Payout</p>
            <p className="text-xs text-stone-500 mt-0.5">Available: <span className="text-amber-400 font-bold">₹{affiliate.pendingBalance.toFixed(0)}</span></p>
          </div>
          {!showPayoutForm && affiliate.pendingBalance >= 500 && (
            <Button onClick={() => setShowPayoutForm(true)} className="h-8 px-4 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl">
              Request Payout
            </Button>
          )}
          {!showPayoutForm && affiliate.pendingBalance < 500 && (
            <p className="text-[10px] text-stone-500">Min ₹500 to withdraw</p>
          )}
        </div>

        {showPayoutForm && (
          <form onSubmit={submitPayout} className="space-y-3 border-t border-stone-900 pt-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Amount (₹)</label>
                <Input
                  type="number"
                  min="500"
                  max={affiliate.pendingBalance}
                  value={payoutForm.amount}
                  onChange={e => setPayoutForm(f => ({ ...f, amount: e.target.value }))}
                  className="bg-stone-900 border-stone-800 text-stone-100 text-xs rounded-xl h-9"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Method</label>
                <select
                  value={payoutForm.paymentMethod}
                  onChange={e => setPayoutForm(f => ({ ...f, paymentMethod: e.target.value as "UPI" | "BANK_TRANSFER" }))}
                  className="w-full h-9 bg-stone-900 border border-stone-800 text-stone-100 text-xs rounded-xl px-3"
                >
                  <option value="UPI">UPI</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                </select>
              </div>
            </div>
            {payoutForm.paymentMethod === "UPI" && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">UPI ID</label>
                <Input
                  value={payoutForm.upiId}
                  onChange={e => setPayoutForm(f => ({ ...f, upiId: e.target.value }))}
                  placeholder="name@upi"
                  className="bg-stone-900 border-stone-800 text-stone-100 text-xs rounded-xl h-9"
                  required
                />
              </div>
            )}
            <div className="flex gap-2 justify-end">
              <Button type="button" onClick={() => setShowPayoutForm(false)} className="h-8 px-4 bg-stone-800 text-stone-300 hover:bg-stone-700 text-xs rounded-xl flex items-center gap-1"><X className="size-3" />Cancel</Button>
              <Button type="submit" disabled={payoutMutation.isPending} className="h-8 px-4 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl flex items-center gap-1.5">
                {payoutMutation.isPending ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3" />} Submit
              </Button>
            </div>
          </form>
        )}

        {/* Payout history */}
        {affiliate.payouts.length > 0 && (
          <div className="border-t border-stone-900 pt-4 space-y-2">
            <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Payout History</p>
            {affiliate.payouts.map(p => (
              <div key={p.id} className="flex items-center justify-between text-xs">
                <span className="text-stone-400">₹{p.amount} · {p.paymentMethod}</span>
                <div className="flex items-center gap-2">
                  <span className="text-stone-500 text-[10px]">{new Date(p.createdAt).toLocaleDateString("en-IN")}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded border font-bold uppercase tracking-wide ${statusColor[p.status]}`}>{p.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Referrals table */}
      <Card className="border-stone-800/80 bg-[#14100E] rounded-2xl p-5 space-y-4">
        <p className="text-xs font-black text-stone-400 uppercase tracking-wider">Referrals ({affiliate.referrals.length})</p>
        {affiliate.referrals.length === 0 ? (
          <p className="text-xs text-stone-500 py-4 text-center">No referrals yet. Share your link to start earning!</p>
        ) : (
          <div className="space-y-2">
            {affiliate.referrals.map(r => (
              <div key={r.id} className="flex items-center justify-between gap-3 py-2 border-b border-stone-900 last:border-0">
                <div>
                  <p className="text-xs font-bold text-stone-200">{r.referredBusiness.name}</p>
                  <p className="text-[10px] text-stone-500">{new Date(r.createdAt).toLocaleDateString("en-IN")}</p>
                </div>
                <div className="flex items-center gap-3">
                  {r.commission && <span className="text-xs font-bold text-amber-400">+₹{r.commission}</span>}
                  <span className={`text-[9px] px-1.5 py-0.5 rounded border font-bold uppercase tracking-wide ${statusColor[r.status]}`}>{r.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
