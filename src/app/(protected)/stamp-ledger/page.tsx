"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Coffee, Gift, CheckCircle2, Loader2, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";

export default function StampLedgerPage() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"stamps" | "rewards">("stamps");

  const { data: stampHistory = [], isLoading: isLoadingStamps } = useQuery<any[]>({
    queryKey: ["stamp-history"],
    queryFn: () => api.get<any[]>("/stamp/history"),
  });

  const { data: rewardHistory = [], isLoading: isLoadingRewards } = useQuery<any[]>({
    queryKey: ["reward-history"],
    queryFn: () => api.get<any[]>("/reward/history"),
  });

  const isLoading = isLoadingStamps || isLoadingRewards;

  const stampEntries = stampHistory.map((r: any) => ({
    id: r.id,
    type: "stamp" as const,
    customer: `${r.customer?.firstName || ""} ${r.customer?.lastName || ""}`.trim() || "Customer",
    email: r.customer?.user?.email ?? "",
    detail: r.invoice?.invoiceNumber ? `Invoice #${r.invoice.invoiceNumber}` : "Stamp Issued",
    location: r.storeLocation?.name ?? null,
    date: r.approvedAt ? new Date(r.approvedAt).toLocaleString() : new Date(r.createdAt).toLocaleString(),
  }));

  const rewardEntries = rewardHistory.map((r: any) => ({
    id: r.id,
    type: "reward" as const,
    customer: `${r.loyaltyCard?.customer?.firstName || ""} ${r.loyaltyCard?.customer?.lastName || ""}`.trim() || "Customer",
    email: "",
    detail: "Reward Redeemed",
    location: null,
    date: r.approvedAt ? new Date(r.approvedAt).toLocaleString() : new Date(r.requestedAt).toLocaleString(),
  }));

  const entries = tab === "stamps" ? stampEntries : rewardEntries;

  const filtered = entries.filter(e =>
    e.customer.toLowerCase().includes(search.toLowerCase()) ||
    e.detail.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-50">Stamp Ledger</h1>
          <p className="text-xs text-stone-500 mt-0.5 font-medium">Complete history of stamp and reward transactions.</p>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex gap-1 p-1 bg-[#14100E] border border-stone-800 rounded-xl">
          {(["stamps", "rewards"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${tab === t ? "bg-[#0C0A09] text-amber-400 border border-stone-900" : "text-stone-500"}`}>
              {t === "stamps" ? <Coffee className="size-3" /> : <Gift className="size-3" />}
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-stone-600" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
            className="pl-9 bg-[#14100E] border-stone-800 text-stone-100 text-xs rounded-xl h-10" />
        </div>
      </div>

      {isLoading ? (
        <div className="py-16 flex items-center justify-center"><Loader2 className="size-6 animate-spin text-amber-500" /></div>
      ) : (
        <div className="bg-[#14100E] border border-stone-800/80 rounded-2xl overflow-hidden">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-stone-600 text-sm">No {tab} history found.</div>
          ) : (
            <div className="divide-y divide-stone-900/60">
              {filtered.map(entry => (
                <div key={entry.id} className="flex items-center justify-between gap-4 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`size-8 rounded-lg flex items-center justify-center ${entry.type === "stamp" ? "bg-amber-500/10" : "bg-purple-500/10"}`}>
                      {entry.type === "stamp"
                        ? <Coffee className="size-3.5 text-amber-400" />
                        : <Gift className="size-3.5 text-purple-400" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-200">{entry.customer}</p>
                      <p className="text-[10px] text-stone-500">{entry.detail}</p>
                      {entry.location && (
                        <p className="text-[10px] text-stone-600 flex items-center gap-0.5 mt-0.5">
                          <MapPin className="size-2.5 inline" /> {entry.location}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-stone-600">{entry.date}</span>
                    <CheckCircle2 className="size-3.5 text-emerald-500" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
