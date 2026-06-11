"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  TrendingUp,
  Star,
  Repeat2,
  Award,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Loader2,
  MapPin,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";

// ── Types ──────────────────────────────────────────────────────────────────────

type Persona = "champion" | "loyal" | "at_risk" | "lost" | "new";

interface CustomerRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  joinDate: string;
  totalStamps: number;
  activeStamps: number;
  rewardAvailable: boolean;
  rewardRedeemedCount: number;
  lastVisit: string | null;
  daysSinceLastVisit: number | null;
  visits30d: number;
  visits90d: number;
  avgVisitGap: number | null;
  persona: Persona;
}

interface AnalyticsData {
  kpis: {
    total: number;
    activeThisMonth: number;
    avgStampsPerCustomer: number;
    totalRedemptions: number;
    personaCounts: Record<Persona, number>;
  };
  customers: CustomerRow[];
}

// ── Persona config ─────────────────────────────────────────────────────────────

const PERSONA_CONFIG: Record<
  Persona,
  { label: string; emoji: string; color: string; desc: string }
> = {
  champion: {
    label: "Champion",
    emoji: "👑",
    color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    desc: "High-value, frequent visitors",
  },
  loyal: {
    label: "Loyal",
    emoji: "⭐",
    color: "text-sky-400 bg-sky-500/10 border-sky-500/30",
    desc: "Regular customers, consistent engagement",
  },
  at_risk: {
    label: "At Risk",
    emoji: "⚠️",
    color: "text-orange-400 bg-orange-500/10 border-orange-500/30",
    desc: "Haven't visited recently",
  },
  lost: {
    label: "Lost",
    emoji: "💤",
    color: "text-rose-400 bg-rose-500/10 border-rose-500/30",
    desc: "Inactive for 90+ days",
  },
  new: {
    label: "New",
    emoji: "🌱",
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    desc: "Just joined, no stamps yet",
  },
};

// ── Sort helpers ────────────────────────────────────────────────────────────────

type SortKey = keyof CustomerRow;
type SortDir = "asc" | "desc";

function sortCustomers(
  customers: CustomerRow[],
  key: SortKey,
  dir: SortDir
): CustomerRow[] {
  return [...customers].sort((a, b) => {
    const av = a[key] ?? (dir === "asc" ? Infinity : -Infinity);
    const bv = b[key] ?? (dir === "asc" ? Infinity : -Infinity);
    if (av < bv) return dir === "asc" ? -1 : 1;
    if (av > bv) return dir === "asc" ? 1 : -1;
    return 0;
  });
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function CustomerAnalyticsPage() {
  const [search, setSearch] = useState("");
  const [personaFilter, setPersonaFilter] = useState<Persona | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("totalStamps");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [locationId, setLocationId] = useState<string>("");

  const { data: locations = [] } = useQuery<{ id: string; name: string }[]>({
    queryKey: ["locations"],
    queryFn: () => api.get("/business/locations"),
  });

  const { data, isLoading, isError } = useQuery<AnalyticsData>({
    queryKey: ["customer-analytics", locationId],
    queryFn: () => api.get<AnalyticsData>(`/business/analytics/customers${locationId ? `?locationId=${locationId}` : ""}`),
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const filtered = useMemo(() => {
    if (!data) return [];
    let rows = data.customers;
    if (personaFilter !== "all")
      rows = rows.filter((c) => c.persona === personaFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (c) =>
          `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
          (c.email ?? "").toLowerCase().includes(q) ||
          (c.phone ?? "").includes(q)
      );
    }
    return sortCustomers(rows, sortKey, sortDir);
  }, [data, personaFilter, search, sortKey, sortDir]);

  const kpis = data?.kpis;

  // ── KPI Cards ──────────────────────────────────────────────────────────────
  const kpiCards = kpis
    ? [
        {
          label: "Total Customers",
          value: kpis.total,
          icon: Users,
          color: "text-stone-300",
        },
        {
          label: "Active This Month",
          value: kpis.activeThisMonth,
          icon: TrendingUp,
          color: "text-emerald-400",
        },
        {
          label: "Avg Stamps / Customer",
          value: kpis.avgStampsPerCustomer,
          icon: Award,
          color: "text-amber-400",
        },
        {
          label: "Total Redemptions",
          value: kpis.totalRedemptions,
          icon: Repeat2,
          color: "text-sky-400",
        },
      ]
    : [];

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col)
      return <ArrowUpDown className="size-3 text-stone-600 inline ml-1" />;
    return sortDir === "asc" ? (
      <ArrowUp className="size-3 text-amber-400 inline ml-1" />
    ) : (
      <ArrowDown className="size-3 text-amber-400 inline ml-1" />
    );
  };

  const thClass =
    "px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest text-stone-500 cursor-pointer select-none whitespace-nowrap hover:text-stone-300 transition-colors";
  const tdClass = "px-3 py-3 text-xs text-stone-300 font-medium";

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-50">
          Customer Analytics
        </h1>
        <p className="text-xs text-stone-500 font-medium mt-0.5">
          Personas, visit frequency, loyalty health, and engagement depth.
        </p>
      </div>

      {/* KPI row */}
      {isLoading && (
        <div className="py-16 flex items-center justify-center">
          <Loader2 className="size-6 animate-spin text-amber-500" />
        </div>
      )}
      {isError && (
        <div className="py-16 text-center text-rose-400 text-sm">
          Failed to load analytics.
        </div>
      )}

      {!isLoading && !isError && kpis && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiCards.map((k) => (
              <Card
                key={k.label}
                className="border-stone-800/80 bg-[#14100E] rounded-2xl p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest">
                    {k.label}
                  </p>
                  <k.icon className={`size-4 ${k.color}`} />
                </div>
                <p className={`text-2xl font-black ${k.color}`}>{k.value}</p>
              </Card>
            ))}
          </div>

          {/* Persona breakdown */}
          <div>
            <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest mb-3">
              Customer Personas
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {(Object.keys(PERSONA_CONFIG) as Persona[]).map((p) => {
                const cfg = PERSONA_CONFIG[p];
                const count = kpis.personaCounts[p];
                const pct =
                  kpis.total > 0
                    ? Math.round((count / kpis.total) * 100)
                    : 0;
                const active = personaFilter === p;
                return (
                  <button
                    key={p}
                    onClick={() =>
                      setPersonaFilter((prev) => (prev === p ? "all" : p))
                    }
                    className={`rounded-2xl border p-4 text-left transition-all ${
                      active
                        ? cfg.color + " ring-1 ring-inset"
                        : "border-stone-800/80 bg-[#14100E] hover:border-stone-700"
                    }`}
                  >
                    <div className="text-xl mb-2">{cfg.emoji}</div>
                    <p className="text-sm font-black text-stone-100">
                      {count}
                    </p>
                    <p className="text-[10px] font-bold text-stone-400 mt-0.5">
                      {cfg.label}
                    </p>
                    <p className="text-[9px] text-stone-600 mt-1">
                      {pct}% of total
                    </p>
                    <p className="text-[9px] text-stone-600 hidden sm:block mt-0.5">
                      {cfg.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search + table */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="flex gap-2 flex-wrap">
                <div className="relative max-w-xs w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-stone-600" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search customers…"
                    className="pl-9 bg-[#14100E] border-stone-800 text-stone-100 text-xs rounded-xl h-10"
                  />
                </div>
                {locations.length > 1 && (
                  <div className="relative flex items-center">
                    <MapPin className="absolute left-2.5 size-3.5 text-stone-600 pointer-events-none" />
                    <select
                      value={locationId}
                      onChange={(e) => setLocationId(e.target.value)}
                      className="h-10 pl-8 pr-3 bg-[#14100E] border border-stone-800 text-stone-300 text-xs rounded-xl outline-none focus:border-amber-500/50"
                    >
                      <option value="">All branches</option>
                      {locations.map((l) => (
                        <option key={l.id} value={l.id}>{l.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <p className="text-[10px] text-stone-600 whitespace-nowrap">
                {filtered.length} customer{filtered.length !== 1 ? "s" : ""}
                {personaFilter !== "all" && (
                  <span>
                    {" "}
                    ·{" "}
                    <button
                      className="text-amber-400 hover:underline"
                      onClick={() => setPersonaFilter("all")}
                    >
                      Clear filter
                    </button>
                  </span>
                )}
              </p>
            </div>

            <Card className="border-stone-800/80 bg-[#14100E] rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead className="border-b border-stone-800">
                    <tr>
                      <th className={thClass}>Customer</th>
                      <th className={thClass}>Persona</th>
                      <th
                        className={thClass}
                        onClick={() => handleSort("totalStamps")}
                      >
                        Total Stamps
                        <SortIcon col="totalStamps" />
                      </th>
                      <th
                        className={thClass}
                        onClick={() => handleSort("visits30d")}
                      >
                        Visits (30d)
                        <SortIcon col="visits30d" />
                      </th>
                      <th
                        className={thClass}
                        onClick={() => handleSort("visits90d")}
                      >
                        Visits (90d)
                        <SortIcon col="visits90d" />
                      </th>
                      <th
                        className={thClass}
                        onClick={() => handleSort("daysSinceLastVisit")}
                      >
                        Last Visit
                        <SortIcon col="daysSinceLastVisit" />
                      </th>
                      <th
                        className={thClass}
                        onClick={() => handleSort("avgVisitGap")}
                      >
                        Avg Gap
                        <SortIcon col="avgVisitGap" />
                      </th>
                      <th
                        className={thClass}
                        onClick={() => handleSort("rewardRedeemedCount")}
                      >
                        Redeemed
                        <SortIcon col="rewardRedeemedCount" />
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-900">
                    {filtered.length === 0 ? (
                      <tr>
                        <td
                          colSpan={8}
                          className="py-12 text-center text-stone-600 text-xs"
                        >
                          No customers match your filter.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((c) => {
                        const pcfg = PERSONA_CONFIG[c.persona];
                        const lastVisitLabel =
                          c.daysSinceLastVisit === null
                            ? "—"
                            : c.daysSinceLastVisit === 0
                            ? "Today"
                            : c.daysSinceLastVisit === 1
                            ? "Yesterday"
                            : `${c.daysSinceLastVisit}d ago`;
                        return (
                          <tr
                            key={c.id}
                            className="hover:bg-stone-900/40 transition-colors"
                          >
                            <td className={tdClass}>
                              <div className="flex items-center gap-2.5">
                                <div className="size-7 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-xs font-black text-stone-500 shrink-0">
                                  {(c.firstName?.[0] ?? "?").toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-black text-stone-100 text-xs">
                                    {c.firstName} {c.lastName}
                                  </p>
                                  <p className="text-[10px] text-stone-600 font-mono">
                                    {c.email ?? c.phone ?? "—"}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className={tdClass}>
                              <span
                                className={`inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded border font-bold uppercase tracking-wide ${pcfg.color}`}
                              >
                                {pcfg.emoji} {pcfg.label}
                              </span>
                            </td>
                            <td className={tdClass}>
                              <span className="font-black text-stone-200">
                                {c.totalStamps}
                              </span>
                            </td>
                            <td className={tdClass}>
                              <span
                                className={
                                  c.visits30d > 0
                                    ? "text-emerald-400 font-bold"
                                    : "text-stone-600"
                                }
                              >
                                {c.visits30d}
                              </span>
                            </td>
                            <td className={tdClass}>{c.visits90d}</td>
                            <td className={tdClass}>
                              <span
                                className={
                                  c.daysSinceLastVisit === null
                                    ? "text-stone-600"
                                    : c.daysSinceLastVisit > 60
                                    ? "text-rose-400"
                                    : c.daysSinceLastVisit > 30
                                    ? "text-orange-400"
                                    : "text-stone-300"
                                }
                              >
                                {lastVisitLabel}
                              </span>
                            </td>
                            <td className={tdClass}>
                              {c.avgVisitGap !== null
                                ? `${c.avgVisitGap}d`
                                : "—"}
                            </td>
                            <td className={tdClass}>
                              <div className="flex items-center gap-1.5">
                                {c.rewardAvailable && (
                                  <Star className="size-3 text-amber-400" />
                                )}
                                {c.rewardRedeemedCount}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
