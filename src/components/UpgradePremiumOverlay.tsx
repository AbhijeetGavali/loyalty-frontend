import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Lock, Sparkles } from "lucide-react";

export default function UpgradePremiumOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-40 bg-[#0C0A09] p-4 sm:p-8 flex items-center justify-center animate-fade-in">
      <Card className="max-w-md w-full bg-[#14100E] border-stone-800/80 p-6 rounded-2xl relative overflow-hidden flex flex-col items-center text-center space-y-6 shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-[0.02] translate-x-12 -translate-y-12">
          <Sparkles className="size-64 text-amber-500" />
        </div>

        <div className="size-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shadow-lg shadow-amber-500/5">
          <Lock className="size-5 stroke-[2.2]" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-black text-stone-50 tracking-tight">
            Enterprise Infrastructure Gated
          </h2>
          <p className="text-xs text-stone-400 font-medium leading-relaxed max-w-sm mx-auto">
            Advanced cryptographic team-access rules and anti-fraud telemetry
            models are restricted to{" "}
            <span className="text-amber-400 font-bold">Premium Core</span>{" "}
            accounts.
          </p>
        </div>

        {/* FEATURE DENSITY SPECIFICATION PREVIEW GRID */}
        <div className="w-full grid grid-cols-1 gap-2 p-3.5 rounded-xl bg-[#0C0A09]/60 border border-stone-900/80 text-left text-xs font-bold text-stone-300">
          <div className="flex items-center gap-2">
            <Sparkles className="size-3.5 text-amber-500 shrink-0" />
            <span>Multi-Branch Hierarchical Profiles</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="size-3.5 text-amber-500 shrink-0" />
            <span>Hardware POS API Webhook Mesh</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="size-3.5 text-amber-500 shrink-0" />
            <span>Anti-Fraud Velocity Limit Engine</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 w-full pt-2">
          <Button
            onClick={onClose}
            className="h-10 rounded-xl bg-[#1C1613] hover:bg-[#261E1A] border border-stone-800 text-stone-300 font-bold text-xs gap-2 flex-1 transition-all active:scale-95"
          >
            <ArrowLeft className="size-3.5" /> Return to Workspace
          </Button>

          <Button
            onClick={() => {}}
            className="h-10 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs gap-2 flex-1 shadow-lg shadow-amber-500/10 transition-all active:scale-95"
          >
            Unlock Premium Tier
          </Button>
        </div>
      </Card>
    </div>
  );
}
