"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3, TrendingUp, Users, Coffee,
  Gift, ArrowUpRight, ArrowDownRight, Minus, Repeat2,
  ShieldCheck, UserPlus, Activity, DollarSign, Loader2,
  BarChart2, MapPin,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useApp } from "@/lib/appContext";

// ── Types ──────────────────────────────────────────────────────────────────────
interface RoiData {
  summary: {
    totalCustomers: number;
    stampsAllTime: number;
    stamps30d: number;
    stamps90d: number;
    redemptionsAllTime: number;
    redemptions30d: number;
    revenueAllTime: number;
    revenueLast30: number;
    revenueLast90: number;
    newCustomers30d: number;
    activeCustomers30d: number;
    retentionRate: number;
    repeatRate: number;
    redemptionRate: number;
    avgStamps30d: number;
  };
  deltas: {
    stamps: number | null;
    redemptions: number | null;
    newCustomers: number | null;
    revenue: number | null;
  };
  weeklyTrend: { week: string; stamps: number }[];
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function Delta({ value }: { value: number | null }) {
  if (value === null) return <span className="text-[10px] text-stone-600 font-mono">—</span>;
  if (value === 0) return (
    <span className="flex items-center gap-0.5 text-[10px] text-stone-500 font-bold">
      <Minus className="size-3" />0%
    </span>
  );
  const up = value > 0;
  return (
    <span className={`flex items-center gap-0.5 text-[10px] font-bold ${up ? "text-emerald-400" : "text-red-400"}`}>
      {up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
      {Math.abs(value)}% MoM
    </span>
  );
}

function fmt(n: number) { return n.toLocaleString("en-IN"); }
function fmtRupee(n: number) { return `₹${n.toLocaleString("en-IN")}`; }
function pct(n: number) { return `${n}%`; }

// ── Sparkline (pure SVG, no deps) ──────────────────────────────────────────────
function Sparkline({ data }: { data: { week: string; stamps: number }[] }) {
  const max = Math.max(...data.map(d => d.stamps), 1);
  const W = 320; const H = 64; const pad = 6;
  const pts = data.map((d, i) => {
    const x = pad + (i / (data.length - 1)) * (W - pad * 2);
    const y = H - pad - (d.stamps / max) * (H - pad * 2);
    return `${x},${y}`;
  });
  const area = `M${pts[0]} L${pts.join(" L")} L${pad + (W - pad * 2)},${H} L${pad},${H} Z`;

  return (
    <div className="w-full overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-16" preserveAspectRatio="none">
        <defs>
          <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#sg)" />
        <polyline points={pts.join(" ")} fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      <div className="flex justify-between mt-1 px-1">
        {data.filter((_, i) => i % 3 === 0 || i === data.length - 1).map(d => (
          <span key={d.week} className="text-[8px] text-stone-600 font-mono">{d.week}</span>
        ))}
      </div>
    </div>
  );
}

// ── Rate Ring ──────────────────────────────────────────────────────────────────
function RateRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 22; const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <svg width="60" height="60" viewBox="0 0 60 60">
        <circle cx="30" cy="30" r={r} fill="none" stroke="#1c1917" strokeWidth="6" />
        <circle cx="30" cy="30" r={r} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={`${dash} ${circ}`} strokeDashoffset={circ / 4}
          strokeLinecap="round" style={{ transition: "stroke-dasharray 0.6s ease" }} />
        <text x="30" y="34" textAnchor="middle" fill="white" fontSize="11" fontWeight="900" fontFamily="monospace">{value}%</text>
      </svg>
      <p className="text-[9px] font-bold text-stone-500 uppercase tracking-wider text-center leading-tight max-w-[60px]">{label}</p>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function RoiAnalyticsPage() {
  const { role } = useApp();
  const isOwner = role === "BUSINESS_OWNER";
  const [locationId, setLocationId] = useState<string>("");

  const { data: locations = [] } = useQuery<{ id: string; name: string }[]>({
    queryKey: ["locations"],
    queryFn: () => api.get("/business/locations"),
    enabled: isOwner,
  });

  const { data: roi, isLoading, isError } = useQuery<RoiData>({
    queryKey: ["roi", locationId],
    queryFn: () => api.get<RoiData>(`/business/roi${locationId ? `?locationId=${locationId}` : ""}`),
    refetchInterval: 60000,
  });

  if (isLoading) return (
    <div className="py-24 flex items-center justify-center">
      <Loader2 className="size-6 animate-spin text-amber-500" />
    </div>
  );

  if (isError || !roi) return (
    <div className="py-24 text-center text-rose-400 text-sm">Failed to load ROI data.</div>
  );

  const s = roi.summary;
  const d = roi.deltas;

  // Metric cards — owner sees revenue; staff sees operational metrics only
  const topMetrics = [
    {
      icon: Coffee,
      label: "Stamps (30d)",
      value: fmt(s.stamps30d),
      sub: `${fmt(s.stampsAllTime)} all-time`,
      delta: d.stamps,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
      ownerOnly: false,
    },
    {
      icon: Gift,
      label: "Redemptions (30d)",
      value: fmt(s.redemptions30d),
      sub: `${fmt(s.redemptionsAllTime)} all-time`,
      delta: d.redemptions,
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/20",
      ownerOnly: false,
    },
    {
      icon: UserPlus,
      label: "New Customers (30d)",
      value: fmt(s.newCustomers30d),
      sub: `${fmt(s.totalCustomers)} total`,
      delta: d.newCustomers,
      color: "text-sky-400",
      bg: "bg-sky-500/10 border-sky-500/20",
      ownerOnly: false,
    },
    {
      icon: DollarSign,
      label: "Revenue (30d)",
      value: fmtRupee(s.revenueLast30),
      sub: `${fmtRupee(s.revenueAllTime)} all-time`,
      delta: d.revenue,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
      ownerOnly: true,
    },
  ].filter(m => !m.ownerOnly || isOwner);

  return (
    <div className="space-y-8 animate-fade-in text-stone-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-50 flex items-center gap-3">
            <BarChart3 className="size-7 text-amber-500 shrink-0" />
            ROI Analytics
          </h1>
          <p className="text-xs text-stone-500 font-medium mt-0.5">
            Real loyalty program performance — stamps, retention, redemptions{isOwner ? ", and revenue" : ""}.
          </p>
        </div>
        {!isOwner && (
          <div className="self-start flex items-center gap-1.5 text-[10px] font-bold text-stone-500 bg-stone-900 border border-stone-800 px-3 py-1.5 rounded-xl">
            <Activity className="size-3" /> Operational view · Revenue hidden
          </div>
        )}
        {isOwner && locations.length > 1 && (
          <div className="relative flex items-center self-start">
            <MapPin className="absolute left-2.5 size-3.5 text-stone-600 pointer-events-none" />
            <select
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              className="h-9 pl-8 pr-3 bg-[#14100E] border border-stone-800 text-stone-300 text-xs rounded-xl outline-none focus:border-amber-500/50"
            >
              <option value="">All branches</option>
              {locations.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Top metric cards */}
      <div className={`grid gap-4 ${isOwner ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-3"}`}>
        {topMetrics.map(({ icon: Icon, label, value, sub, delta, color, bg }) => (
          <div key={label} className="p-5 bg-[#14100E] border border-stone-800/80 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold text-stone-500 uppercase tracking-wider">{label}</span>
              <div className={`size-7 rounded-lg border flex items-center justify-center ${bg}`}>
                <Icon className={`size-3.5 ${color}`} />
              </div>
            </div>
            <div>
              <p className={`text-2xl font-black tracking-tight ${color}`}>{value}</p>
              <p className="text-[10px] text-stone-600 mt-0.5">{sub}</p>
            </div>
            <Delta value={delta} />
          </div>
        ))}
      </div>

      {/* Rates + sparkline row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Rate rings */}
        <Card className="lg:col-span-4 border-stone-800/80 bg-[#14100E] rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-900 pb-3">
            <ShieldCheck className="size-4 text-amber-500" />
            <p className="text-xs font-black text-stone-100">Health Rates</p>
          </div>
          <div className="flex items-center justify-around py-2">
            <RateRing value={s.retentionRate}   label="Retention"    color="#34d399" />
            <RateRing value={s.repeatRate}       label="Repeat Visit" color="#f59e0b" />
            <RateRing value={s.redemptionRate}   label="Redemption"  color="#a78bfa" />
          </div>
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-900 text-center">
            {[
              { label: "Active (30d)", value: fmt(s.activeCustomers30d) },
              { label: "Avg stamps", value: String(s.avgStamps30d) },
              { label: "Redemptions", value: fmt(s.redemptionsAllTime) },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-sm font-black text-stone-100">{value}</p>
                <p className="text-[9px] text-stone-600 uppercase tracking-wide">{label}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Weekly trend */}
        <Card className="lg:col-span-8 border-stone-800/80 bg-[#14100E] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-900 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-amber-500" />
              <p className="text-xs font-black text-stone-100">Stamp Activity — Last 12 Weeks</p>
            </div>
            <span className="text-[9px] font-mono text-stone-600 uppercase tracking-wider">Weekly</span>
          </div>
          {roi.weeklyTrend.every(w => w.stamps === 0) ? (
            <div className="h-20 flex items-center justify-center text-xs text-stone-600">No stamp activity in past 12 weeks.</div>
          ) : (
            <Sparkline data={roi.weeklyTrend} />
          )}
          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-stone-900">
            {[
              { label: "Stamps (90d)", value: fmt(s.stamps90d) },
              ...(isOwner ? [{ label: "Revenue (90d)", value: fmtRupee(s.revenueLast90) }] : []),
              { label: "Total customers", value: fmt(s.totalCustomers) },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-sm font-black text-stone-100">{value}</p>
                <p className="text-[9px] text-stone-600 uppercase tracking-wide">{label}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Rates breakdown table */}
      <Card className="border-stone-800/80 bg-[#14100E] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-900 flex items-center gap-2">
          <BarChart2 className="size-4 text-amber-500" />
          <p className="text-xs font-black text-stone-100">Program Metrics Breakdown</p>
        </div>
        <div className="divide-y divide-stone-900/50">
          {[
            { label: "Customer retention rate (30d)",     value: pct(s.retentionRate),      hint: "Customers active this month who also visited last month",            icon: Repeat2,     color: "text-emerald-400" },
            { label: "Repeat customer rate (all-time)",   value: pct(s.repeatRate),         hint: "Customers with more than 1 stamp ever",                             icon: Users,       color: "text-amber-400" },
            { label: "Reward redemption rate",            value: pct(s.redemptionRate),     hint: "Cards with stamps that have redeemed at least one reward",          icon: Gift,        color: "text-purple-400" },
            { label: "Active customers (30d)",            value: fmt(s.activeCustomers30d), hint: "Unique customers who received a stamp in the last 30 days",        icon: Activity,    color: "text-sky-400" },
            { label: "Avg stamps / active customer (30d)",value: String(s.avgStamps30d),   hint: "Average number of stamps per active customer this month",           icon: Coffee,      color: "text-amber-400" },
            ...(isOwner ? [
              { label: "Total revenue tracked (all-time)", value: fmtRupee(s.revenueAllTime), hint: "Sum of invoice purchase amounts linked to stamp requests",        icon: DollarSign,  color: "text-emerald-400" },
            ] : []),
          ].map(({ label, value, hint, icon: Icon, color }) => (
            <div key={label} className="flex items-center justify-between px-5 py-3.5 gap-4">
              <div className="flex items-center gap-3">
                <Icon className={`size-3.5 shrink-0 ${color}`} />
                <div>
                  <p className="text-xs font-bold text-stone-200">{label}</p>
                  <p className="text-[10px] text-stone-600 mt-0.5">{hint}</p>
                </div>
              </div>
              <span className={`text-sm font-black shrink-0 ${color}`}>{value}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Staff notice */}
      {!isOwner && (
        <div className="flex items-start gap-3 p-4 bg-stone-900/40 border border-stone-800 rounded-xl">
          <Activity className="size-4 text-stone-500 shrink-0 mt-0.5" />
          <p className="text-xs text-stone-500">Revenue and financial metrics are visible to the business owner only. You are viewing the operational performance view.</p>
        </div>
      )}
    </div>
  );
}
