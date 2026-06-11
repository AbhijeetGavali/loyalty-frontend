"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Coffee, Loader2, CheckCircle2, XCircle, Clock, ChevronDown, ChevronUp, MapPin } from "lucide-react";
import { api } from "@/lib/api";

interface LoyaltyCard {
  id: string;
  businessId: string;
  currentStamps: number;
  totalEarned: number;
  rewardRedeemedCount: number;
  business?: { name: string; location?: string };
}

interface StampHistoryEntry {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  approvedAt: string | null;
  invoice: { invoiceNumber: string } | null;
  storeLocation: { name: string } | null;
}

function MerchantHistoryRow({ card }: { card: LoyaltyCard }) {
  const [open, setOpen] = useState(false);

  const { data: history = [], isLoading } = useQuery<StampHistoryEntry[]>({
    queryKey: ["stamp-history", card.businessId],
    queryFn: () => api.get<StampHistoryEntry[]>(`/cards/by-business/${card.businessId}/history`),
    enabled: open,
  });

  return (
    <div className="bg-[#14100E] border border-stone-800 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 hover:bg-stone-900/40 transition-colors"
      >
        <div className="text-left min-w-0">
          <p className="text-sm font-black text-stone-100 truncate">{card.business?.name}</p>
          <p className="text-[10px] text-stone-500 mt-0.5">
            {card.currentStamps} current · {card.totalEarned} total earned · {card.rewardRedeemedCount} redeemed
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg">
            {card.totalEarned} stamps
          </span>
          {open ? <ChevronUp className="size-4 text-stone-500" /> : <ChevronDown className="size-4 text-stone-500" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-stone-800/60 px-5 pb-4 pt-3 space-y-2">
          {isLoading && (
            <div className="py-4 flex justify-center">
              <Loader2 className="size-4 animate-spin text-amber-500" />
            </div>
          )}
          {!isLoading && history.length === 0 && (
            <p className="text-xs text-stone-600 py-3 text-center">No stamp requests yet.</p>
          )}
          {!isLoading && history.map((entry) => (
            <div key={entry.id} className="flex items-start justify-between gap-3 text-[11px] py-2 border-b border-stone-900/40 last:border-none">
              <div className="flex items-start gap-2">
                {entry.status === "APPROVED" ? (
                  <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
                ) : entry.status === "REJECTED" ? (
                  <XCircle className="size-3.5 text-rose-500 shrink-0 mt-0.5" />
                ) : (
                  <Clock className="size-3.5 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
                )}
                <div>
                  <span className={`font-bold capitalize ${entry.status === "APPROVED" ? "text-emerald-400" : entry.status === "REJECTED" ? "text-rose-400" : "text-amber-400"}`}>
                    {entry.status.toLowerCase()}
                  </span>
                  {entry.invoice && (
                    <span className="text-stone-500"> · Invoice #{entry.invoice.invoiceNumber}</span>
                  )}
                  {entry.storeLocation && (
                    <p className="text-stone-600 flex items-center gap-0.5 mt-0.5">
                      <MapPin className="size-2.5" /> {entry.storeLocation.name}
                    </p>
                  )}
                </div>
              </div>
              <span className="text-stone-600 font-mono shrink-0">
                {new Date(entry.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function HistoryPage() {
  const { data: cards = [], isLoading, isError } = useQuery<LoyaltyCard[]>({
    queryKey: ["my-cards"],
    queryFn: () => api.get<LoyaltyCard[]>("/cards"),
  });

  const activeCards = cards.filter((c) => c.totalEarned > 0 || c.currentStamps > 0 || c.rewardRedeemedCount > 0);

  return (
    <div className="min-h-screen bg-[#0C0A09] px-4 py-8 max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-stone-50 tracking-tight">Activity</h1>
        <p className="text-xs text-stone-500 mt-1">Your full stamp history, per merchant.</p>
      </div>

      {isLoading && (
        <div className="py-20 flex items-center justify-center">
          <Loader2 className="size-6 animate-spin text-amber-500" />
        </div>
      )}

      {!isLoading && isError && (
        <p className="py-20 text-center text-rose-400 text-sm">Failed to load history.</p>
      )}

      {!isLoading && !isError && activeCards.length === 0 && (
        <div className="py-20 text-center space-y-3">
          <Coffee className="size-10 text-stone-700 mx-auto" />
          <p className="text-stone-500 text-sm">No activity yet.</p>
        </div>
      )}

      {!isLoading && !isError && activeCards.length > 0 && (
        <div className="space-y-3">
          {activeCards.map((card) => (
            <MerchantHistoryRow key={card.id} card={card} />
          ))}
        </div>
      )}
    </div>
  );
}
