"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Gift, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/toast";

interface LoyaltyProgram {
  stampsRequired: number;
  rewardTitle: string;
  rewardDescription?: string;
}

interface RewardCard {
  id: string;
  businessId: string;
  currentStamps: number;
  rewardAvailable: boolean;
  business?: { name: string; loyaltyProgram?: LoyaltyProgram[] };
}

export default function RewardsPage() {
  const toast = useToast();

  const { data: cards = [], isLoading, isError } = useQuery<RewardCard[]>({
    queryKey: ["my-cards"],
    queryFn: () => api.get<RewardCard[]>("/cards"),
    throwOnError: false,
    meta: {
      onError: (err: Error) => toast.error(err.message || "Failed to load rewards."),
    },
  });

  return (
    <div className="min-h-screen bg-[#0C0A09] px-4 py-8 max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-stone-50 tracking-tight">Rewards</h1>
        <p className="text-xs text-stone-500 mt-1">Perks available across your loyalty programs.</p>
      </div>

      {isLoading && (
        <div className="py-20 flex items-center justify-center">
          <Loader2 className="size-6 animate-spin text-amber-500" />
        </div>
      )}

      {!isLoading && isError && (
        <p className="py-20 text-center text-rose-400 text-sm">Failed to load rewards.</p>
      )}

      {!isLoading && !isError && cards.length === 0 && (
        <div className="py-20 text-center space-y-3">
          <Gift className="size-10 text-stone-700 mx-auto" />
          <p className="text-stone-500 text-sm">No rewards yet.</p>
          <p className="text-stone-600 text-xs">Scan a café&apos;s QR code to enrol in a loyalty program.</p>
        </div>
      )}

      {!isLoading && !isError && cards.map((card) => {
        const program = card.business?.loyaltyProgram?.[0];
        if (!program) return null;
        const stampsRequired = program.stampsRequired ?? 10;
        const progress = Math.min((card.currentStamps / stampsRequired) * 100, 100);

        return (
          <Card key={card.id} className="border-stone-800 bg-[#14100E] rounded-3xl p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-stone-500">{card.business?.name}</p>
                <p className="text-base font-black text-stone-100 mt-0.5">{program.rewardTitle}</p>
              </div>
              {card.rewardAvailable && (
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md whitespace-nowrap">
                  Ready to Claim
                </span>
              )}
            </div>

            {program.rewardDescription && (
              <p className="text-xs text-stone-500">{program.rewardDescription}</p>
            )}

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-stone-500">
                <span>{card.currentStamps} / {stampsRequired} stamps</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-1.5 bg-stone-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {card.rewardAvailable && (
              <Link
                href="/wallet"
                className="block w-full h-11 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm rounded-2xl flex items-center justify-center gap-2"
              >
                <Gift className="size-4" /> Claim in Wallet
              </Link>
            )}
          </Card>
        );
      })}
    </div>
  );
}
