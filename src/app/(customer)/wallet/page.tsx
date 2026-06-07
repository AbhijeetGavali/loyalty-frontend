"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Ticket, Coffee, Loader2, ChevronRight, Star } from "lucide-react";
import { api } from "@/lib/api";

export default function WalletPage() {
  const router = useRouter();

  const { data: cards = [], isLoading, isError } = useQuery<any[]>({
    queryKey: ["my-cards"],
    queryFn: () => api.get<any[]>("/cards"),
  });

  // Only show cards where the user has activity (at least 1 stamp earned or reward redeemed)
  const activeCards = cards.filter(
    (c: any) => c.totalEarned > 0 || c.rewardRedeemedCount > 0 || c.currentStamps > 0,
  );

  return (
    <div className="min-h-screen bg-[#0C0A09] px-4 py-8 max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-stone-50 tracking-tight">My Wallet</h1>
        <p className="text-xs text-stone-500 mt-1">
          Your loyalty cards — tap a business to view stamps.
        </p>
      </div>

      {isLoading && (
        <div className="py-20 flex items-center justify-center">
          <Loader2 className="size-6 animate-spin text-amber-500" />
        </div>
      )}

      {!isLoading && isError && (
        <p className="text-rose-400 text-sm text-center py-20">Failed to load your cards.</p>
      )}

      {!isLoading && !isError && activeCards.length === 0 && (
        <div className="py-20 text-center space-y-3">
          <Ticket className="size-10 text-stone-700 mx-auto" />
          <p className="text-stone-500 text-sm">No cards with stamps yet.</p>
          <p className="text-stone-600 text-xs">Scan a café's QR code and collect your first stamp.</p>
        </div>
      )}

      {!isLoading && !isError && activeCards.length > 0 && (
        <div className="space-y-3">
          {activeCards.map((card: any) => {
            const program = card.business?.loyaltyProgram?.[0];
            const stampsRequired = program?.stampsRequired ?? 10;
            const progress = Math.min((card.currentStamps / stampsRequired) * 100, 100);

            return (
              <button
                key={card.id}
                onClick={() => router.push(`/wallet/card/${card.businessId}`)}
                className="w-full text-left bg-[#14100E] border border-stone-800 rounded-2xl p-4 flex items-center gap-4 hover:border-stone-700 active:scale-[0.99] transition-all"
              >
                {/* Icon */}
                <div className="size-12 rounded-xl bg-stone-900 border border-stone-800 flex flex-col items-center justify-center shrink-0">
                  <Coffee className="size-5 text-amber-500/70" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-stone-100 truncate">{card.business?.name}</p>
                    {card.rewardAvailable && (
                      <span className="flex items-center gap-1 text-[9px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full shrink-0">
                        <Star className="size-2.5" /> Reward ready
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-stone-500 truncate">{card.business?.location}</p>
                  {/* Progress bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-stone-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-[9px] text-stone-500 tabular-nums shrink-0">
                      {card.currentStamps}/{stampsRequired}
                    </span>
                  </div>
                </div>

                <ChevronRight className="size-4 text-stone-600 shrink-0" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
