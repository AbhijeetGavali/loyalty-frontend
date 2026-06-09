"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Loader2, Store, Users, IndianRupee, Stamp, Gift, TrendingUp, TrendingDown, Link2, Clock, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";

interface AdminKPIs {
  businesses: { total: number; newThisMonth: number };
  subscriptions: { active: number; trial: number; expired: number };
  customers: { total: number };
  stamps: { total: number; pending: number };
  rewards: { redeemed: number };
  revenue: { thisMonth: number; lastMonth: number; growthPct: number | null };
  affiliates: { total: number; pendingApplications: number; pendingPayouts: number };
}

function KpiCard({ icon: Icon, label, value, sub, subColor = "text-stone-500", href, accent = "text-amber-400" }: {
  icon: React.ElementType; label: string; value: string | number;
  sub?: string; subColor?: string; href?: string; accent?: string;
}) {
  const card = (
    <Card className="border-stone-800/80 bg-[#14100E] rounded-2xl p-5 space-y-3 hover:border-stone-700 transition-colors">
      <Icon className={`size-4 ${accent}`} />
      <div>
        <p className="text-2xl font-black text-stone-100">{value}</p>
        <p className="text-[10px] text-stone-500 uppercase tracking-wider mt-0.5">{label}</p>
      </div>
      {sub && <p className={`text-[11px] font-medium ${subColor}`}>{sub}</p>}
    </Card>
  );
  return href ? <Link href={href}>{card}</Link> : card;
}

export default function AdminDashboard() {
  const { data, isLoading, isError } = useQuery<AdminKPIs>({
    queryKey: ["admin-dashboard"],
    queryFn: () => api.get("/admin/dashboard"),
    refetchInterval: 60_000,
  });

  if (isLoading) return <div className="py-20 flex justify-center"><Loader2 className="size-6 animate-spin text-amber-500" /></div>;
  if (isError || !data) return (
    <div className="py-20 flex justify-center gap-2 text-rose-400 text-sm">
      <AlertCircle className="size-4" /> Failed to load KPIs.
    </div>
  );

  const { businesses, subscriptions, customers, stamps, rewards, revenue, affiliates } = data;
  const growthPositive = (revenue.growthPct ?? 0) >= 0;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-50">Platform Overview</h1>
        <p className="text-xs text-stone-500 mt-0.5">Live KPIs across all merchants, customers, and revenue.</p>
      </div>

      {/* Revenue spotlight */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="sm:col-span-2 border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-[#14100E] rounded-2xl p-6 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <IndianRupee className="size-4" /> Revenue This Month
          </div>
          <p className="text-4xl font-black text-stone-50">₹{revenue.thisMonth.toLocaleString("en-IN")}</p>
          <div className="flex items-center gap-2">
            {revenue.growthPct !== null ? (
              <>
                {growthPositive ? <TrendingUp className="size-3.5 text-emerald-400" /> : <TrendingDown className="size-3.5 text-rose-400" />}
                <span className={`text-xs font-bold ${growthPositive ? "text-emerald-400" : "text-rose-400"}`}>
                  {growthPositive ? "+" : ""}{revenue.growthPct?.toFixed(1)}% vs last month
                </span>
                <span className="text-xs text-stone-600">(₹{revenue.lastMonth.toLocaleString("en-IN")})</span>
              </>
            ) : <span className="text-xs text-stone-600">No prior month data</span>}
          </div>
        </Card>

        <Card className="border-stone-800/80 bg-[#14100E] rounded-2xl p-6 space-y-3">
          <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">Subscriptions</p>
          {[
            { label: "Active", val: subscriptions.active, color: "text-emerald-400" },
            { label: "Trial", val: subscriptions.trial, color: "text-amber-400" },
            { label: "Expired", val: subscriptions.expired, color: "text-rose-400" },
          ].map(s => (
            <div key={s.label} className="flex items-center justify-between">
              <span className="text-xs text-stone-500">{s.label}</span>
              <span className={`text-sm font-black ${s.color}`}>{s.val}</span>
            </div>
          ))}
        </Card>
      </div>

      {/* Core KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <KpiCard icon={Store} label="Total Businesses" value={businesses.total}
          sub={`+${businesses.newThisMonth} this month`} subColor="text-emerald-400"
          href="/merchants" accent="text-sky-400" />
        <KpiCard icon={Users} label="Total Customers" value={customers.total.toLocaleString("en-IN")} accent="text-violet-400" />
        <KpiCard icon={Stamp} label="Stamp Requests" value={stamps.total.toLocaleString("en-IN")}
          sub={stamps.pending > 0 ? `${stamps.pending} pending` : "All cleared"}
          subColor={stamps.pending > 0 ? "text-amber-400" : "text-emerald-400"} />
        <KpiCard icon={Gift} label="Rewards Redeemed" value={rewards.redeemed.toLocaleString("en-IN")} accent="text-rose-400" />
      </div>

      {/* Affiliate KPIs */}
      <div>
        <p className="text-xs font-black text-stone-500 uppercase tracking-widest mb-3">Affiliate Program</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <KpiCard icon={Link2} label="Active Affiliates" value={affiliates.total} href="/merchants/affiliates" />
          <KpiCard icon={Clock} label="Pending Applications" value={affiliates.pendingApplications}
            sub={affiliates.pendingApplications > 0 ? "Needs review" : "All reviewed"}
            subColor={affiliates.pendingApplications > 0 ? "text-amber-400" : "text-emerald-400"}
            href="/merchants/affiliates" accent="text-sky-400" />
          <KpiCard icon={IndianRupee} label="Payouts Pending" value={`₹${affiliates.pendingPayouts.toLocaleString("en-IN")}`}
            sub={affiliates.pendingPayouts > 0 ? "Awaiting transfer" : "No pending payouts"}
            subColor={affiliates.pendingPayouts > 0 ? "text-amber-400" : "text-emerald-400"}
            href="/merchants/affiliates" accent="text-violet-400" />
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { href: "/merchants", label: "View Merchants", emoji: "🏪" },
          { href: "/billing-plans", label: "Manage Plans", emoji: "💰" },
          { href: "/merchants/affiliates", label: "Affiliates", emoji: "🤝" },
          { href: "/settings", label: "Settings", emoji: "⚙️" },
        ].map(l => (
          <Link key={l.href} href={l.href}>
            <div className="border border-stone-800 bg-[#14100E] hover:border-stone-700 rounded-xl p-4 flex items-center gap-3 transition-colors">
              <span className="text-lg">{l.emoji}</span>
              <span className="text-xs font-bold text-stone-400">{l.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
