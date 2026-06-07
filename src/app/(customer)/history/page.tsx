"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Coffee, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/toast";

const TABS = ["Stamps", "Rewards"] as const;

export default function HistoryPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Stamps");
  const toast = useToast();

  interface LoyaltyCard {
    id: string;
    businessId: string;
    currentStamps: number;
    totalEarned: number | null;
    rewardRedeemedCount: number;
    business?: { name: string };
  }

  const { data: cards = [], isLoading, isError } = useQuery<LoyaltyCard[]>({
    queryKey: ["my-cards"],
    queryFn: () => api.get<LoyaltyCard[]>("/cards"),
    throwOnError: false,
    meta: {
      onError: (err: Error) => toast.error(err.message || "Failed to load history."),
    },
  });

  return (
    <div className="min-h-screen bg-[#0C0A09] px-4 py-8 max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-stone-50 tracking-tight">Activity</h1>
        <p className="text-xs text-stone-500 mt-1">Your stamp and reward history.</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-stone-900 rounded-2xl p-1 gap-1">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${
              tab === t ? "bg-amber-500 text-stone-950" : "text-stone-500 hover:text-stone-300"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="py-20 flex items-center justify-center">
          <Loader2 className="size-6 animate-spin text-amber-500" />
        </div>
      )}

      {!isLoading && isError && (
        <p className="py-20 text-center text-rose-400 text-sm">Failed to load history.</p>
      )}

      {!isLoading && !isError && cards.length === 0 && (
        <div className="py-20 text-center space-y-3">
          <Coffee className="size-10 text-stone-700 mx-auto" />
          <p className="text-stone-500 text-sm">No activity yet.</p>
        </div>
      )}

      {!isLoading && !isError && cards.length > 0 && (
        <div className="space-y-3">
          {cards.map((card) => (
            <Card key={card.id} className="border-stone-800 bg-[#14100E] rounded-2xl p-4 space-y-1">
              <p className="text-sm font-black text-stone-100">{card.business?.name}</p>
              {tab === "Stamps" ? (
                <>
                  <p className="text-xs text-stone-400">
                    Current stamps: <span className="text-amber-400 font-bold">{card.currentStamps}</span>
                  </p>
                  <p className="text-xs text-stone-500">Total earned: {card.totalEarned ?? "—"}</p>
                </>
              ) : (
                <p className="text-xs text-stone-400">
                  Rewards redeemed: <span className="text-amber-400 font-bold">{card.rewardRedeemedCount ?? 0}</span>
                </p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
