"use client";
"use client";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApp } from "@/lib/appContext";
import AdminDashboard from "./AdminDashboard";
import {
  Users,
  Ticket,
  ShieldCheck,
  ArrowUpRight,
  Activity,
  Sparkles,
  Coffee,
  CheckCircle2,
  XCircle,
  Clock,
  FileSpreadsheet,
  Gift,
  Loader2,
  MapPin,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/toast";

// Define a type for our unified requests
interface LedgerRequest {
  id: string;
  type: "stamp" | "reward";
  user: string;
  email: string;
  detail: string; // e.g., "Espresso" or "Free Latte Reward"
  count?: number; // relevant for stamps
  date: string;
}

function timeAgo(date: string) {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

interface StampEntry {
  id: string;
  customerId?: string;
  customer?: { firstName?: string; lastName?: string };
  invoice?: { invoiceNumber?: string };
  storeLocation?: { name?: string };
  approvedAt?: string;
  createdAt: string;
}

function StampLedgerFeed() {
  const { data: history = [], isLoading } = useQuery<StampEntry[]>({
    queryKey: ["stampHistory"],
    queryFn: () => api.get<StampEntry[]>("/stamp/history"),
    refetchInterval: 30000,
  });

  const recent = history.slice(0, 8);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-stone-900 pb-3">
        <h3 className="text-sm font-black text-stone-50 tracking-tight">Stamp Ledger Feed</h3>
        <ArrowUpRight className="size-3.5 text-stone-500" />
      </div>

      {isLoading && (
        <div className="py-6 flex items-center justify-center">
          <Loader2 className="size-4 animate-spin text-amber-500" />
        </div>
      )}

      {!isLoading && recent.length === 0 && (
        <p className="text-[11px] text-stone-600 py-4 text-center">No stamps issued yet.</p>
      )}

      {!isLoading && recent.length > 0 && (
        <div className="space-y-3">
          {recent.map((r) => {
            const name = `${r.customer?.firstName || ""} ${r.customer?.lastName || ""}`.trim() || `Customer #${r.customerId?.slice(-4)}`;
            const invoice = r.invoice?.invoiceNumber;
            const location = r.storeLocation?.name;
            return (
              <div key={r.id} className="flex justify-between items-start gap-4 text-[11px] leading-tight border-b border-stone-900/40 pb-2 last:border-none">
                <div className="space-y-0.5">
                  <p className="font-semibold text-stone-300">
                    1 stamp awarded{invoice ? ` · ${invoice}` : ""}
                  </p>
                  <span className="text-[10px] text-stone-600 font-medium">{name}</span>
                  {location && (
                    <span className="text-[10px] text-stone-600 font-medium flex items-center gap-0.5">
                      <MapPin className="size-2.5 inline" /> {location}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-mono text-stone-600 shrink-0">{timeAgo(r.approvedAt ?? r.createdAt)}</span>
              </div>
            );
          })}
        </div>
      )}

      <div className="pt-3 border-t border-stone-900 flex items-center gap-2 text-[10px] font-medium text-stone-500">
        <div className="size-1.5 rounded-full bg-emerald-500" />
        <span>{history.length} total stamps issued</span>
      </div>
    </div>
  );
}

export default function DashboardOverview() {
  const { role } = useApp();
  if (role === "SUPER_ADMIN") return <AdminDashboard />;

  const queryClient = useQueryClient();
  const toast = useToast();

  // Track invoice inputs locally per stamp request ID
  const [invoices, setInvoices] = useState<Record<string, string>>({});

  // 1. Fetch Overview Metrics
  const { data: metrics } = useQuery({
    queryKey: ["dashboardMetrics"],
    queryFn: () => api.get<{
      totalCards: number;
      pendingStamps: number;
      pendingRewards: number;
      redeemedRewards: number;
      stampsIssued: number;
    }>("/business/dashboard"),
  });

  interface PendingStamp {
    id: string;
    customerId?: string;
    createdAt: string;
    customer?: { firstName?: string; lastName?: string; user?: { email?: string } };
    invoice?: { invoiceNumber?: string };
  }

  interface PendingReward {
    id: string;
    requestedAt: string;
    loyaltyCard?: { customer?: { firstName?: string; lastName?: string } };
  }

  // 2. Fetch Pending Stamp Requests
  const {
    data: pendingStamps,
    isLoading: isLoadingStamps,
    isError: isErrorStamps,
  } = useQuery<PendingStamp[]>({
    queryKey: ["pendingStamps"],
    queryFn: () => api.get<PendingStamp[]>("/stamp/pending"),
  });

  // 3. Fetch Pending Reward Redemptions
  const {
    data: pendingRewards,
    isLoading: isLoadingRewards,
  } = useQuery<PendingReward[]>({
    queryKey: ["pendingRewards"],
    queryFn: () => api.get<PendingReward[]>("/reward/pending"),
  });

  // Merge both into a unified queue
  const queueRequests: LedgerRequest[] = [
    ...(pendingStamps ?? []).map((r) => ({
      id: r.id,
      type: "stamp" as const,
      user: `${r.customer?.firstName || ""} ${r.customer?.lastName || ""}`.trim() || `Customer #${r.customerId?.slice(-4)}`,
      email: r.customer?.user?.email ?? "",
      detail: r.invoice?.invoiceNumber ?? "Invoice",
      count: 1,
      date: new Date(r.createdAt).toLocaleTimeString(),
    })),
    ...(pendingRewards ?? []).map((r) => ({
      id: r.id,
      type: "reward" as const,
      user: `${r.loyaltyCard?.customer?.firstName || ""} ${r.loyaltyCard?.customer?.lastName || ""}`.trim() || "Customer",
      email: "",
      detail: "Reward Redemption",
      date: new Date(r.requestedAt).toLocaleTimeString(),
    })),
  ];

  const isLoading = isLoadingStamps || isLoadingRewards;
  const isError = isErrorStamps;

  // 3. Action Mutations (Approve/Reject)
  const approveMutation = useMutation({
    mutationFn: async ({ requestId, type, invoiceNumber }: { requestId: string; type: "stamp" | "reward"; invoiceNumber?: string }) => {
      if (type === "stamp") {
        if (!invoiceNumber?.trim()) throw new Error("Invoice number required for stamp confirmations");
        return api.post(`/stamp/${requestId}/approve`, { invoiceNumber });
      }
      return api.post(`/reward/${requestId}/approve`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingStamps"] });
      queryClient.invalidateQueries({ queryKey: ["pendingRewards"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardMetrics"] });
      queryClient.invalidateQueries({ queryKey: ["stampHistory"] });
      toast.success("Request approved successfully.");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to approve request."),
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ requestId, type }: { requestId: string; type: "stamp" | "reward" }) => {
      if (type === "stamp") return api.post(`/stamp/${requestId}/reject`, {});
      return api.post(`/reward/${requestId}/reject`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingStamps"] });
      queryClient.invalidateQueries({ queryKey: ["pendingRewards"] });
      toast.success("Request rejected.");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to reject request."),
  });

  const handleInvoiceChange = (id: string, value: string) => {
    setInvoices((prev) => ({ ...prev, [id]: value }));
  };

  const handleApprove = (request: LedgerRequest) => {
    const invoiceNumber = invoices[request.id] || "";
    if (request.type === "stamp" && !invoiceNumber.trim()) {
      toast.warning("Please provide an invoice number before approving this stamp request.");
      return;
    }
    approveMutation.mutate({
      requestId: request.id,
      type: request.type,
      invoiceNumber: request.type === "stamp" ? invoiceNumber : undefined,
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* SECTION HEADER BLOCK */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-50">
            System Overview
          </h1>
          <p className="text-xs text-stone-500 font-medium leading-relaxed">
            Live operations ledger and loyalty card configuration metrics.
          </p>
        </div>

        {/* NETWORK STATUS DEPLOYED SYNC NODES */}
        <div className="self-start sm:self-center px-3 py-1.5 rounded-xl bg-[#14100E] border border-stone-800/80 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-mono font-bold tracking-wider text-stone-400 uppercase">
            Ecosystem Core Synced
          </span>
        </div>
      </div>

      {/* CORE TELEMETRY STATISTIC CARDS MATRIX GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-stone-800/80 bg-[#14100E] rounded-2xl shadow-none hover:border-stone-700/60 transition-all relative overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[11px] font-black text-stone-500 tracking-wider uppercase">Total Regulars</CardTitle>
            <Users className="size-4 text-stone-600 group-hover:text-amber-400 transition-colors" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-stone-50 tracking-tight">{metrics?.totalCards?.toLocaleString() ?? "—"}</div>
            <p className="text-[10px] text-stone-500 font-medium mt-1">Active loyalty card holders</p>
          </CardContent>
        </Card>

        <Card className="border-stone-800/80 bg-[#14100E] rounded-2xl shadow-none hover:border-stone-700/60 transition-all relative overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[11px] font-black text-stone-500 tracking-wider uppercase">Stamps Issued</CardTitle>
            <Coffee className="size-4 text-stone-600 group-hover:text-amber-400 transition-colors" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-stone-50 tracking-tight">{metrics?.stampsIssued?.toLocaleString() ?? "—"}</div>
            <p className="text-[10px] text-stone-500 font-medium mt-1">Total approved stamps</p>
          </CardContent>
        </Card>

        <Card className="border-stone-800/80 bg-[#14100E] rounded-2xl shadow-none hover:border-stone-700/60 transition-all relative overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[11px] font-black text-stone-500 tracking-wider uppercase">Rewards Redeemed</CardTitle>
            <Ticket className="size-4 text-stone-600 group-hover:text-amber-400 transition-colors" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-stone-50 tracking-tight">{metrics?.redeemedRewards?.toLocaleString() ?? "—"}</div>
            <p className="text-[10px] text-stone-500 font-medium mt-1">Perks claimed by customers</p>
          </CardContent>
        </Card>

        <Card className="border-stone-800/80 bg-[#14100E] rounded-2xl shadow-none hover:border-stone-700/60 transition-all relative overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[11px] font-black text-stone-500 tracking-wider uppercase">Pending Actions</CardTitle>
            <ShieldCheck className="size-4 text-stone-600 group-hover:text-emerald-400 transition-colors" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-stone-50 tracking-tight">
              {((metrics?.pendingStamps ?? 0) + (metrics?.pendingRewards ?? 0)).toLocaleString()}
            </div>
            <p className="text-[10px] text-stone-500 font-medium mt-1">
              {metrics?.pendingStamps ?? 0} stamps · {metrics?.pendingRewards ?? 0} rewards
            </p>
          </CardContent>
        </Card>
      </div>

      {/* UNIFIED STAMP & REWARD REQUESTS PROCESSING LEDGER */}
      <div className="bg-[#14100E] border border-stone-800/80 rounded-3xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-900 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-amber-500" />
            <h3 className="text-sm font-black text-stone-50 tracking-tight">
              Operations Verification Queue
            </h3>
          </div>
          <span className="text-[10px] font-mono text-stone-500 font-bold uppercase tracking-wider">
            Stamp & Reward Claims Pending
          </span>
        </div>

        {isLoading && (
          <div className="py-8 text-center text-xs font-medium text-stone-500 animate-pulse">
            Pulling operation queue submissions...
          </div>
        )}

        {isError && (
          <div className="py-8 text-center text-xs font-bold text-red-400">
            Failed to coordinate state with verification pipeline.
          </div>
        )}

        {!isLoading && !isError && queueRequests?.length === 0 && (
          <div className="py-8 text-center text-xs font-medium text-stone-600">
            Inbox clear. No transaction parameters waiting validation.
          </div>
        )}

        {!isLoading &&
          !isError &&
          queueRequests &&
          queueRequests.length > 0 && (
            <div className="divide-y divide-stone-900/60 max-h-[420px] overflow-y-auto pr-1 space-y-1">
              {queueRequests.map((request) => (
                <div
                  key={request.id}
                  className="pt-4 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-4 first:pt-0"
                >
                  {/* Meta details & Request Type Badges */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black text-stone-200">
                        {request.user}
                      </span>

                      {request.type === "stamp" ? (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/10 font-bold tracking-wide uppercase flex items-center gap-1">
                          <Coffee className="size-2.5" /> Stamp Request
                        </span>
                      ) : (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/10 font-bold tracking-wide uppercase flex items-center gap-1">
                          <Gift className="size-2.5" /> Reward Redeem
                        </span>
                      )}

                      <span className="text-[10px] font-mono text-stone-600">
                        {request.date}
                      </span>
                    </div>

                    <p className="text-[11px] text-stone-400 font-medium">
                      {request.type === "stamp" ? (
                        <>
                          Requested{" "}
                          <span className="text-amber-400 font-bold">
                            {request.count} stamp(s)
                          </span>{" "}
                          for{" "}
                          <span className="italic text-stone-300">
                            &quot;{request.detail}&quot;
                          </span>
                        </>
                      ) : (
                        <>
                          Claiming reward entitlement:{" "}
                          <span className="text-purple-400 font-bold">
                            {request.detail}
                          </span>
                        </>
                      )}
                    </p>
                    <p className="text-[9px] text-stone-600 font-mono tracking-tight">
                      {request.email}
                    </p>
                  </div>

                  {/* Operations Actions & Conditionals */}
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Conditional input: Only show invoice logic if request type is "stamp" */}
                    {request.type === "stamp" ? (
                      <div className="relative flex items-center">
                        <FileSpreadsheet className="size-3.5 text-stone-600 absolute left-2.5 pointer-events-none" />
                        <input
                          type="text"
                          placeholder="Invoice #"
                          value={invoices[request.id] || ""}
                          onChange={(e) =>
                            handleInvoiceChange(request.id, e.target.value)
                          }
                          className="bg-[#0C0A09] border border-stone-800 text-stone-100 placeholder-stone-600 text-[11px] font-mono rounded-xl pl-8 pr-2.5 py-1.5 w-36 focus:outline-none focus:border-stone-700 transition-colors"
                        />
                      </div>
                    ) : (
                      <div className="text-[10px] font-mono font-medium text-stone-600 bg-stone-900/40 border border-stone-800/40 rounded-xl px-3 py-1.5 h-8 flex items-center">
                        No invoice required
                      </div>
                    )}

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleApprove(request)}
                        className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold rounded-xl flex items-center gap-1 transition-all"
                      >
                        <CheckCircle2 className="size-3.5" />
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          rejectMutation.mutate({
                            requestId: request.id,
                            type: request.type,
                          })
                        }
                        className="px-2.5 py-1.5 bg-stone-900 hover:bg-red-900/20 text-stone-400 hover:text-red-400 border border-stone-800 hover:border-red-900/40 text-[11px] font-bold rounded-xl flex items-center gap-1 transition-all"
                      >
                        <XCircle className="size-3.5" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>

      {/* DUAL WORKSPACE CHARTS & LEDGER SIMULATION BLOCK */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* OPERATIONAL INSIGHT CANVAS BLOCK (8 UNITS WIDE) */}
        <div className="lg:col-span-8 bg-[#14100E] border border-stone-800/80 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/[0.01] blur-3xl rounded-full pointer-events-none" />

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Activity className="size-4 text-amber-500" />
              <h3 className="text-sm font-black text-stone-50 tracking-tight">
                Live Retention Analytics
              </h3>
            </div>
            <span className="text-[10px] font-mono text-stone-600 font-bold uppercase tracking-wider">
              Realtime Activity Loop
            </span>
          </div>

          {/* Graphical Mock Matrix Block Frame */}
          <div className="h-48 border border-dashed border-stone-800/80 bg-[#0C0A09]/40 rounded-2xl flex flex-col items-center justify-center p-4 text-center">
            <Sparkles className="size-5 text-stone-700 animate-pulse mb-2" />
            <span className="text-xs font-bold text-stone-400">
              ROI Pattern Chart Ready
            </span>
            <p className="text-[10px] text-stone-600 max-w-xs mt-0.5">
              Chart node component is listening. Transactions initialized on
              counter displays will plot coordinates live.
            </p>
          </div>
        </div>

        {/* RECENT LEDGER TELEMETRY BLOCK (4 UNITS WIDE) */}
        <div className="lg:col-span-4 bg-[#14100E] border border-stone-800/80 rounded-3xl p-6 flex flex-col justify-between">
          <StampLedgerFeed />
        </div>
      </div>
    </div>
  );
}
