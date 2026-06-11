"use client";

import React, { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Monitor, QrCode, Loader2, Copy, ExternalLink, Download, Maximize2, X, Pencil, MapPin, ChevronDown, ChevronUp, CheckCircle2, XCircle, Coffee, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useApp } from "@/lib/appContext";
import { useToast } from "@/components/ui/toast";

function CustomerHistoryPanel({ customerId }: { customerId: string }) {
  const { data, isLoading } = useQuery<{
    history: { id: string; approvedAt: string | null; invoice: { invoiceNumber: string } | null; storeLocation: { name: string } | null }[];
    card: { currentStamps: number; totalEarned: number; rewardAvailable: boolean } | null;
  }>({
    queryKey: ["customer-history", customerId],
    queryFn: () => api.get(`/stamp/customer-history/${customerId}`),
  });

  if (isLoading) return <div className="py-2 flex justify-center"><Loader2 className="size-3.5 animate-spin text-amber-500" /></div>;

  return (
    <div className="mt-2 pt-2 border-t border-stone-800/60 space-y-1.5">
      <div className="flex items-center gap-2 text-[9px] font-bold text-stone-500 uppercase tracking-wider">
        <Coffee className="size-3" />
        {data?.card ? (
          <span>{data.card.currentStamps} active stamps · {data.card.totalEarned} total{data.card.rewardAvailable ? " · 🎉 reward ready" : ""}</span>
        ) : "No card found"}
      </div>
      {data?.history && data.history.length > 0 ? (
        <div className="space-y-1">
          {data.history.map((h) => (
            <div key={h.id} className="flex items-center justify-between text-[10px] text-stone-500">
              <span className="font-mono">{h.invoice?.invoiceNumber ?? "—"}</span>
              <span>{h.approvedAt ? new Date(h.approvedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : "—"}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[10px] text-stone-600">No previous stamps at this business.</p>
      )}
    </div>
  );
}

interface PendingRequest {
  id: string;
  customerId: string;
  customer: { firstName: string; lastName: string; user?: { email?: string } };
  invoice?: { invoiceNumber?: string } | null;
  storeLocation?: { name?: string } | null;
  createdAt: string;
}

function PendingRequestCard({ req }: { req: PendingRequest }) {
  const [expanded, setExpanded] = useState(false);
  const queryClient = useQueryClient();
  const toast = useToast();

  const approveMutation = useMutation({
    mutationFn: () => api.post(`/stamp/${req.id}/approve`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-requests"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardMetrics"] });
      toast.success("Stamp approved!");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to approve"),
  });

  const rejectMutation = useMutation({
    mutationFn: () => api.post(`/stamp/${req.id}/reject`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-requests"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardMetrics"] });
      toast.info("Request rejected.");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to reject"),
  });

  const isPending = approveMutation.isPending || rejectMutation.isPending;

  return (
    <div className="p-4 rounded-xl border border-stone-800 bg-[#0C0A09] space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold text-stone-200 truncate">
            {req.customer.firstName} {req.customer.lastName}
          </p>
          <p className="text-[10px] text-stone-500 truncate">
            Invoice: <span className="font-mono text-stone-400">{req.invoice?.invoiceNumber ?? "—"}</span>
            {req.storeLocation?.name && <span className="ml-2">· {req.storeLocation.name}</span>}
          </p>
          <p className="text-[9px] text-stone-600 mt-0.5">
            <Clock className="size-2.5 inline mr-0.5" />
            {new Date(req.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => rejectMutation.mutate()}
            disabled={isPending}
            className="size-8 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 flex items-center justify-center transition-all disabled:opacity-50"
          >
            {rejectMutation.isPending ? <Loader2 className="size-3.5 animate-spin" /> : <XCircle className="size-4" />}
          </button>
          <button
            onClick={() => approveMutation.mutate()}
            disabled={isPending}
            className="size-8 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 flex items-center justify-center transition-all disabled:opacity-50"
          >
            {approveMutation.isPending ? <Loader2 className="size-3.5 animate-spin" /> : <CheckCircle2 className="size-4" />}
          </button>
          <button
            onClick={() => setExpanded(v => !v)}
            className="size-8 rounded-lg border border-stone-800 text-stone-500 hover:text-stone-300 flex items-center justify-center transition-all"
          >
            {expanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
          </button>
        </div>
      </div>
      {expanded && <CustomerHistoryPanel customerId={req.customerId} />}
    </div>
  );
}

export default function CounterDisplaysPage() {
  const [fullscreen, setFullscreen] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const { role } = useApp();

  const { data: qrData, isLoading } = useQuery<{ businessId: string; onboardingUrl: string }>({
    queryKey: ["qr-info"],
    queryFn: () => api.get("/qr/me"),
  });

  const { data: metrics } = useQuery<{ pendingStamps: number }>({
    queryKey: ["dashboardMetrics"],
    queryFn: () => api.get("/business/dashboard"),
    refetchInterval: 15000,
  });

  const { data: pendingRequests = [], isLoading: isPendingLoading } = useQuery<PendingRequest[]>({
    queryKey: ["pending-requests"],
    queryFn: () => api.get("/stamp/pending"),
    refetchInterval: 15000,
  });

  const { data: staffMe } = useQuery<{ storeLocation: { name: string; address: string; phone?: string } | null }>({
    queryKey: ["staff-me"],
    queryFn: () => api.get("/staff/me"),
    enabled: role === "BUSINESS_STAFF",
  });

  const qrImageUrl = qrData?.onboardingUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qrData.onboardingUrl)}`
    : null;

  const copyUrl = () => {
    if (qrData?.onboardingUrl) navigator.clipboard.writeText(qrData.onboardingUrl);
  };

  const download = async () => {
    if (!qrImageUrl) return;
    const res = await fetch(qrImageUrl);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "loyalty-qr.png";
    a.click();
    URL.revokeObjectURL(url);
  };

  const openEditor = () => {
    if (!qrData?.onboardingUrl) return;
    window.open(`https://qr.ideasprout.in/?url=${encodeURIComponent(qrData.onboardingUrl)}`, "_blank");
  };

  return (
    <>
      {fullscreen && qrImageUrl && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center" onClick={() => setFullscreen(false)}>
          <button className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors" onClick={() => setFullscreen(false)}>
            <X className="size-7" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrImageUrl} alt="Loyalty QR Code" className="max-w-[90vmin] max-h-[90vmin] rounded-2xl bg-white p-4" />
          {role === "BUSINESS_STAFF" && staffMe?.storeLocation && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/70 border border-amber-500/30 rounded-xl px-4 py-2 backdrop-blur-sm">
              <MapPin className="size-4 text-amber-400 shrink-0" />
              <div className="text-center">
                <p className="text-sm font-black text-amber-300">{staffMe.storeLocation.name}</p>
                <p className="text-[11px] text-stone-400">{staffMe.storeLocation.address}</p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="space-y-8 animate-fade-in">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-50">Counter Displays</h1>
            {(metrics?.pendingStamps ?? 0) > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-xs font-bold text-amber-400">{metrics!.pendingStamps} pending</span>
              </div>
            )}
          </div>
          <p className="text-xs text-stone-500 mt-0.5 font-medium">Share your QR code so customers can join your loyalty program.</p>
        </div>

        {isLoading ? (
          <div className="py-20 flex items-center justify-center">
            <Loader2 className="size-6 animate-spin text-amber-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Left: QR card */}
            <div className="space-y-5 max-w-lg">
              <Card className="border-stone-800 bg-[#14100E] rounded-2xl p-8 flex flex-col items-center gap-6">
                <div className="size-10 rounded-xl bg-amber-500/10 border border-amber-500/10 flex items-center justify-center">
                  <QrCode className="size-5 text-amber-400" />
                </div>

                {qrImageUrl && (
                  <div className="relative group bg-white p-4 rounded-2xl shadow-lg cursor-pointer" onClick={() => setFullscreen(true)}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img ref={imgRef} src={qrImageUrl} alt="Loyalty QR Code" width={200} height={200} className="block" />
                    <div className="absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
                      <Maximize2 className="size-6 text-transparent group-hover:text-stone-700 transition-all" />
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button onClick={download} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-[11px] font-bold text-stone-300 hover:text-amber-400 hover:border-amber-500/30 transition-all">
                    <Download className="size-3.5" /> Download
                  </button>
                  <button onClick={openEditor} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-[11px] font-bold text-stone-300 hover:text-amber-400 hover:border-amber-500/30 transition-all">
                    <Pencil className="size-3.5" /> Customise QR
                  </button>
                  <button onClick={() => setFullscreen(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-[11px] font-bold text-stone-300 hover:text-amber-400 hover:border-amber-500/30 transition-all">
                    <Maximize2 className="size-3.5" /> Fullscreen
                  </button>
                </div>

                <div className="w-full space-y-2 text-center">
                  <p className="text-xs text-stone-400 font-medium">Customer scan link</p>
                  <div className="flex items-center gap-2 bg-stone-900 border border-stone-800 rounded-xl px-3 py-2">
                    <p className="text-[11px] font-mono text-stone-400 truncate flex-1">{qrData?.onboardingUrl}</p>
                    <button onClick={copyUrl} className="text-stone-500 hover:text-amber-400 transition-colors shrink-0">
                      <Copy className="size-3.5" />
                    </button>
                    <a href={qrData?.onboardingUrl} target="_blank" rel="noreferrer" className="text-stone-500 hover:text-amber-400 transition-colors shrink-0">
                      <ExternalLink className="size-3.5" />
                    </a>
                  </div>
                </div>
              </Card>

              {role === "BUSINESS_STAFF" && (
                <Card className="border-amber-500/20 bg-amber-500/5 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-amber-400" />
                    <h3 className="text-xs font-black text-amber-300 uppercase tracking-wider">Your Branch</h3>
                  </div>
                  {staffMe?.storeLocation ? (
                    <div className="space-y-1">
                      <p className="text-sm font-black text-stone-100">{staffMe.storeLocation.name}</p>
                      <p className="text-xs text-stone-400">{staffMe.storeLocation.address}</p>
                      {staffMe.storeLocation.phone && <p className="text-xs text-stone-500">{staffMe.storeLocation.phone}</p>}
                    </div>
                  ) : (
                    <p className="text-xs text-stone-500">No branch assigned. Contact your manager.</p>
                  )}
                </Card>
              )}

              <Card className="border-stone-800/60 bg-[#14100E] rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Monitor className="size-4 text-stone-500" />
                  <h3 className="text-xs font-black text-stone-300 uppercase tracking-wider">How to use</h3>
                </div>
                <ol className="space-y-2 text-xs text-stone-500 list-decimal list-inside">
                  <li>Print or display this QR code at your counter.</li>
                  <li>Customers scan it with their phone camera.</li>
                  <li>They create a loyalty card for your café instantly.</li>
                  <li>They show the invoice number from each purchase to earn stamps.</li>
                </ol>
              </Card>
            </div>

            {/* Right: Pending approval queue */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black text-stone-300 uppercase tracking-wider">Pending Approvals</h2>
                {pendingRequests.length > 0 && (
                  <span className="text-[9px] font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">{pendingRequests.length}</span>
                )}
              </div>
              {isPendingLoading ? (
                <div className="py-6 flex justify-center"><Loader2 className="size-5 animate-spin text-amber-500" /></div>
              ) : pendingRequests.length === 0 ? (
                <div className="py-8 text-center text-stone-600 text-xs border border-stone-800/60 rounded-xl bg-[#14100E]">
                  <CheckCircle2 className="size-5 mx-auto mb-2 text-emerald-500/40" />
                  No pending requests
                </div>
              ) : (
                <div className="space-y-2">
                  {pendingRequests.map((req) => (
                    <PendingRequestCard key={req.id} req={req} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
