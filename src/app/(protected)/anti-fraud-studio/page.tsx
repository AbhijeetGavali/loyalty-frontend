"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ShieldAlert, ShieldCheck, Search, Fingerprint, AlertTriangle,
  Activity, UserX, Clock, Loader2, CheckCircle2, Settings2,
  Zap, Eye, Bot, Users, ToggleLeft, ToggleRight, MapPin, Save,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/toast";
import { useApp } from "@/lib/appContext";

// ── Types ──────────────────────────────────────────────────────────────────────
interface FraudFlag {
  id: string;
  reason: string;
  ruleTriggered: string | null;
  autoDetected: boolean;
  resolved: boolean;
  createdAt: string;
  stampRequest: {
    id: string;
    status: string;
    createdAt: string;
    customer?: { firstName: string; lastName: string };
    invoice?: { invoiceNumber: string; purchaseAmount: number };
    storeLocation?: { name: string };
  };
}

interface FraudStats {
  total: number;
  open: number;
  resolved: number;
  autoDetected: number;
  byRule: { ruleTriggered: string | null; _count: { id: number } }[];
}

interface FraudConfig {
  enabled: boolean;
  maxStampsPerHour: number;
  maxStampsPerDay: number;
  minMinutesBetweenStamps: number;
  alertOnBurst: boolean;
  burstWindowMinutes: number;
  burstThreshold: number;
}

interface Suspect {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  openFlags: number;
  cards: { currentStamps: number; totalEarned: number }[];
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const RULE_LABELS: Record<string, string> = {
  VELOCITY_HOUR: "Velocity / Hour",
  VELOCITY_DAY:  "Velocity / Day",
  MIN_INTERVAL:  "Min Interval",
  BURST:         "Burst Pattern",
  MANUAL:        "Manual Flag",
};

function ruleColor(rule: string | null) {
  if (rule === "BURST")         return "text-red-400 bg-red-500/10 border-red-500/20";
  if (rule === "VELOCITY_HOUR") return "text-orange-400 bg-orange-500/10 border-orange-500/20";
  if (rule === "VELOCITY_DAY")  return "text-amber-400 bg-amber-500/10 border-amber-500/20";
  if (rule === "MIN_INTERVAL")  return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
  return "text-stone-400 bg-stone-800 border-stone-700";
}

function timeAgo(date: string) {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// ── Config Panel (owner-only) ──────────────────────────────────────────────────
function ConfigPanel() {
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: config, isLoading } = useQuery<FraudConfig>({
    queryKey: ["fraud-config"],
    queryFn: () => api.get<FraudConfig>("/business/fraud-config"),
  });

  const [form, setForm] = useState<FraudConfig | null>(null);
  const active = form ?? config;

  const saveMutation = useMutation({
    mutationFn: (data: FraudConfig) => api.put("/business/fraud-config", data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["fraud-config"] }); toast.success("Config saved."); setForm(null); },
    onError: (err: Error) => toast.error(err.message || "Failed to save config."),
  });

  if (isLoading || !active) return <div className="py-8 flex justify-center"><Loader2 className="size-4 animate-spin text-amber-500" /></div>;

  const set = (key: keyof FraudConfig, val: FraudConfig[keyof FraudConfig]) => setForm(f => ({ ...(f ?? active), [key]: val }));
  const isDirty = form !== null;

  return (
    <div className="space-y-5">
      {/* Master toggle */}
      <div className="flex items-center justify-between p-4 bg-stone-900/50 rounded-xl border border-stone-800">
        <div>
          <p className="text-sm font-black text-stone-100">Auto-Detection Engine</p>
          <p className="text-[10px] text-stone-500 mt-0.5">Automatically flag suspicious stamps on approval</p>
        </div>
        <button onClick={() => set("enabled", !active.enabled)} className="flex items-center gap-1.5 text-xs font-bold">
          {active.enabled
            ? <><ToggleRight className="size-6 text-emerald-400" /><span className="text-emerald-400">On</span></>
            : <><ToggleLeft className="size-6 text-stone-500" /><span className="text-stone-500">Off</span></>}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { key: "maxStampsPerHour",        label: "Max stamps / hour",    min: 1, max: 20,   hint: "Flag if customer exceeds this in 1 hour" },
          { key: "maxStampsPerDay",         label: "Max stamps / day",     min: 1, max: 50,   hint: "Flag if customer exceeds this in 24 hours" },
          { key: "minMinutesBetweenStamps", label: "Min minutes between",  min: 0, max: 1440, hint: "Flag if next stamp is too soon" },
          { key: "burstThreshold",          label: "Burst threshold",      min: 1, max: 10,   hint: "Flag if this many stamps in burst window" },
          { key: "burstWindowMinutes",      label: "Burst window (min)",   min: 1, max: 60,   hint: "Time window for burst detection" },
        ].map(({ key, label, min, max, hint }) => (
          <div key={key} className="space-y-1.5">
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">{label}</label>
            <input
              type="number" min={min} max={max}
              value={active[key as keyof FraudConfig] as number}
              onChange={e => set(key as keyof FraudConfig, parseInt(e.target.value))}
              className="w-full h-9 px-3 bg-[#0C0A09] border border-stone-800 rounded-xl text-stone-100 text-xs focus:outline-none focus:border-amber-500/50"
            />
            <p className="text-[9px] text-stone-600">{hint}</p>
          </div>
        ))}

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Burst detection</label>
          <button
            onClick={() => set("alertOnBurst", !active.alertOnBurst)}
            className={`w-full h-9 rounded-xl text-xs font-bold border flex items-center gap-2 px-3 transition-all ${
              active.alertOnBurst ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-stone-900 border-stone-800 text-stone-500"
            }`}
          >
            {active.alertOnBurst ? <ToggleRight className="size-4" /> : <ToggleLeft className="size-4" />}
            {active.alertOnBurst ? "Enabled" : "Disabled"}
          </button>
          <p className="text-[9px] text-stone-600">Flag rapid multi-stamp patterns</p>
        </div>
      </div>

      {isDirty && (
        <button
          onClick={() => saveMutation.mutate(form!)}
          disabled={saveMutation.isPending}
          className="w-full h-9 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs rounded-xl flex items-center justify-center gap-2"
        >
          {saveMutation.isPending ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
          Save Configuration
        </button>
      )}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function AntiFraudStudioPage() {
  const { role } = useApp();
  const isOwner = role === "BUSINESS_OWNER";
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "open" | "resolved" | "auto">("open");
  const [tab, setTab] = useState<"flags" | "suspects" | "config">("flags");
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: flags = [], isLoading: loadingFlags } = useQuery<FraudFlag[]>({
    queryKey: ["fraud-flags"],
    queryFn: () => api.get<FraudFlag[]>("/business/fraud-flags"),
    refetchInterval: 30000,
  });

  const { data: stats } = useQuery<FraudStats>({
    queryKey: ["fraud-stats"],
    queryFn: () => api.get<FraudStats>("/business/fraud-stats"),
    refetchInterval: 30000,
  });

  const { data: suspects = [], isLoading: loadingSuspects } = useQuery<Suspect[]>({
    queryKey: ["fraud-suspects"],
    queryFn: () => api.get<Suspect[]>("/business/fraud-suspects"),
    enabled: tab === "suspects",
  });

  const resolveMutation = useMutation({
    mutationFn: (id: string) => api.put(`/business/fraud-flags/${id}/resolve`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fraud-flags"] });
      queryClient.invalidateQueries({ queryKey: ["fraud-stats"] });
      queryClient.invalidateQueries({ queryKey: ["fraud-suspects"] });
      toast.success("Flag resolved.");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to resolve."),
  });

  const filtered = flags.filter((f) => {
    const name = `${f.stampRequest.customer?.firstName ?? ""} ${f.stampRequest.customer?.lastName ?? ""}`.trim().toLowerCase();
    const matchSearch = !search || name.includes(search.toLowerCase()) || f.reason.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all"      ||
      (filter === "open"     && !f.resolved) ||
      (filter === "resolved" && f.resolved) ||
      (filter === "auto"     && f.autoDetected && !f.resolved);
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-8 animate-fade-in text-stone-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-50 flex items-center gap-3">
            <ShieldAlert className="size-7 text-amber-500 shrink-0" />
            Anti-Fraud Studio
          </h1>
          <p className="text-xs text-stone-500 font-medium">Real-time fraud detection and investigation workspace.</p>
        </div>
        {stats && stats.open > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-xl text-xs font-bold text-red-400">
            <AlertTriangle className="size-3.5" />
            {stats.open} open alert{stats.open !== 1 ? "s" : ""} need attention
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Activity,   label: "Total Flags",    value: stats?.total        ?? "—", color: "text-stone-200",  bg: "bg-stone-800/40 border-stone-700" },
          { icon: UserX,      label: "Open",           value: stats?.open         ?? "—", color: "text-red-400",    bg: "bg-red-500/10 border-red-500/20" },
          { icon: ShieldCheck,label: "Resolved",       value: stats?.resolved     ?? "—", color: "text-emerald-400",bg: "bg-emerald-500/10 border-emerald-500/20" },
          { icon: Bot,        label: "Auto-Detected",  value: stats?.autoDetected ?? "—", color: "text-amber-400",  bg: "bg-amber-500/10 border-amber-500/20" },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className={`p-4 border rounded-2xl flex items-center gap-3.5 ${bg}`}>
            <div className="size-9 rounded-xl bg-stone-900/60 flex items-center justify-center shrink-0">
              <Icon className={`size-4 ${color}`} />
            </div>
            <div>
              <p className="text-[9px] font-bold text-stone-600 uppercase tracking-wider">{label}</p>
              <p className={`text-xl font-black mt-0.5 ${color}`}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Rule breakdown */}
      {stats && stats.byRule.length > 0 && (
        <div className="bg-[#14100E] border border-stone-800/80 rounded-2xl p-5">
          <p className="text-[10px] font-black text-stone-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Zap className="size-3" /> Detection Breakdown
          </p>
          <div className="flex flex-wrap gap-2">
            {stats.byRule.map(r => (
              <span key={r.ruleTriggered ?? "manual"} className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${ruleColor(r.ruleTriggered)}`}>
                {RULE_LABELS[r.ruleTriggered ?? "MANUAL"] ?? r.ruleTriggered ?? "Manual"} · {r._count.id}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[#14100E] border border-stone-800 rounded-xl w-fit">
        {([
          { key: "flags",   label: "Fraud Flags",  icon: ShieldAlert },
          { key: "suspects",label: "Suspects",      icon: Users },
          ...(isOwner ? [{ key: "config", label: "Configuration", icon: Settings2 }] : []),
        ] as { key: string; label: string; icon: React.ElementType }[]).map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key as "flags" | "suspects" | "config")}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${tab === key ? "bg-[#0C0A09] text-amber-400 border border-stone-900" : "text-stone-500 hover:text-stone-300"}`}>
            <Icon className="size-3" /> {label}
          </button>
        ))}
      </div>

      {/* ── Flags Tab ── */}
      {tab === "flags" && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-stone-600" />
              <Input placeholder="Search customer or reason..." value={search} onChange={e => setSearch(e.target.value)}
                className="h-9 pl-9 rounded-xl bg-[#14100E] border-stone-800 text-stone-100 placeholder:text-stone-600 text-xs" />
            </div>
            <div className="flex gap-1.5">
              {(["open","auto","all","resolved"] as const).map(s => (
                <button key={s} onClick={() => setFilter(s)}
                  className={`h-8 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wide border transition-all ${filter === s ? "bg-amber-500 border-amber-500 text-stone-950" : "bg-[#14100E] border-stone-800 text-stone-500 hover:text-stone-300"}`}>
                  {s === "auto" ? "Auto" : s}
                </button>
              ))}
            </div>
          </div>

          {loadingFlags && <div className="py-12 flex justify-center"><Loader2 className="size-5 animate-spin text-amber-500" /></div>}

          {!loadingFlags && filtered.length === 0 && (
            <div className="py-16 border border-dashed border-stone-800 rounded-2xl flex flex-col items-center justify-center text-center">
              <ShieldCheck className="size-8 text-stone-700 mb-2" />
              <p className="text-xs font-bold text-stone-400">No flags found</p>
              <p className="text-[10px] text-stone-600 mt-0.5">{filter === "open" ? "System is clean." : "Try a different filter."}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map((flag) => {
              const name = flag.stampRequest.customer
                ? `${flag.stampRequest.customer.firstName} ${flag.stampRequest.customer.lastName}`.trim()
                : "Unknown";
              const invoice = flag.stampRequest.invoice;
              const location = flag.stampRequest.storeLocation;

              return (
                <Card key={flag.id} className="border-stone-800/80 bg-[#14100E] rounded-2xl p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`size-9 rounded-xl flex items-center justify-center border shrink-0 ${flag.resolved ? "bg-emerald-500/10 border-emerald-500/20" : "bg-red-500/10 border-red-500/20"}`}>
                        {flag.resolved ? <ShieldCheck className="size-4 text-emerald-400" /> : <AlertTriangle className="size-4 text-red-400" />}
                      </div>
                      <div>
                        <p className="text-sm font-black text-stone-100">{name}</p>
                        <div className="flex items-center gap-2 flex-wrap mt-0.5">
                          {invoice && <span className="text-[9px] font-mono text-stone-500">#{invoice.invoiceNumber}</span>}
                          {location && <span className="text-[9px] text-stone-600 flex items-center gap-0.5"><MapPin className="size-2.5" />{location.name}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded border font-bold uppercase ${flag.resolved ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-red-400 bg-red-500/10 border-red-500/20"}`}>
                        {flag.resolved ? "Resolved" : "Open"}
                      </span>
                      {flag.autoDetected
                        ? <span className="text-[8px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/10 font-bold flex items-center gap-0.5"><Bot className="size-2.5" />Auto</span>
                        : <span className="text-[8px] px-1.5 py-0.5 rounded bg-stone-800 text-stone-500 border border-stone-700 font-bold flex items-center gap-0.5"><Eye className="size-2.5" />Manual</span>}
                    </div>
                  </div>

                  {flag.ruleTriggered && (
                    <span className={`inline-flex text-[9px] font-bold px-2 py-0.5 rounded border ${ruleColor(flag.ruleTriggered)}`}>
                      {RULE_LABELS[flag.ruleTriggered] ?? flag.ruleTriggered}
                    </span>
                  )}

                  <div className="p-3 bg-stone-900/50 rounded-xl border border-stone-900">
                    <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1 mb-1">
                      <Fingerprint className="size-3" /> Reason
                    </p>
                    <p className="text-xs text-stone-300">{flag.reason}</p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-stone-500">
                    <span className="flex items-center gap-1"><Clock className="size-3" />{timeAgo(flag.createdAt)}</span>
                    <span>Stamp: <span className={`font-bold ${flag.stampRequest.status === "APPROVED" ? "text-emerald-400" : flag.stampRequest.status === "REJECTED" ? "text-red-400" : "text-amber-400"}`}>{flag.stampRequest.status}</span></span>
                  </div>

                  {!flag.resolved && (
                    <button onClick={() => resolveMutation.mutate(flag.id)} disabled={resolveMutation.isPending}
                      className="w-full h-8 text-[10px] font-bold rounded-xl border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 flex items-center justify-center gap-1.5 transition-colors">
                      {resolveMutation.isPending ? <Loader2 className="size-3 animate-spin" /> : <CheckCircle2 className="size-3" />}
                      Mark Resolved
                    </button>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Suspects Tab ── */}
      {tab === "suspects" && (
        <div className="space-y-4">
          {loadingSuspects && <div className="py-12 flex justify-center"><Loader2 className="size-5 animate-spin text-amber-500" /></div>}
          {!loadingSuspects && suspects.length === 0 && (
            <div className="py-16 border border-dashed border-stone-800 rounded-2xl text-center">
              <ShieldCheck className="size-8 text-stone-700 mx-auto mb-2" />
              <p className="text-xs font-bold text-stone-400">No suspicious customers</p>
              <p className="text-[10px] text-stone-600 mt-0.5">Customers with 2+ open flags appear here.</p>
            </div>
          )}
          {suspects.length > 0 && (
            <div className="bg-[#14100E] border border-stone-800/80 rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-stone-900 flex items-center gap-2">
                <UserX className="size-4 text-red-400" />
                <p className="text-xs font-black text-stone-100">High-Risk Customers</p>
                <span className="ml-auto text-[9px] font-bold text-stone-600 uppercase tracking-wider">2+ open flags</span>
              </div>
              <div className="divide-y divide-stone-900/60">
                {suspects.map(s => (
                  <div key={s.id} className="px-5 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                        <UserX className="size-3.5 text-red-400" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-stone-100">{s.firstName} {s.lastName}</p>
                        <p className="text-[10px] text-stone-500">{s.phone ?? "No phone"} · {s.cards[0]?.totalEarned ?? 0} lifetime stamps</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded">
                        {s.openFlags} open flags
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Config Tab (owner only) ── */}
      {tab === "config" && isOwner && (
        <div className="bg-[#14100E] border border-stone-800/80 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Settings2 className="size-4 text-amber-500" />
            <h3 className="text-sm font-black text-stone-100">Detection Rules</h3>
            <span className="ml-auto text-[9px] font-bold text-stone-600 uppercase tracking-wider">Owner only</span>
          </div>
          <ConfigPanel />
        </div>
      )}

      {tab === "config" && !isOwner && (
        <div className="py-16 border border-dashed border-stone-800 rounded-2xl text-center">
          <ShieldAlert className="size-8 text-stone-700 mx-auto mb-2" />
          <p className="text-xs font-bold text-stone-400">Configuration is restricted to business owners.</p>
        </div>
      )}
    </div>
  );
}
