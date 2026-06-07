import { Card } from "./ui/card";
import { ArrowLeft, Layers, ShieldAlert } from "lucide-react";
import { Button } from "./ui/button";

export default function ComingSoonOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-40 bg-[#0C0A09] p-4 sm:p-8 flex items-center justify-center animate-fade-in">
      <Card className="max-w-md w-full bg-[#14100E] border-stone-800/80 p-6 rounded-2xl relative overflow-hidden flex flex-col items-center text-center space-y-5 shadow-2xl">
        <div className="size-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center shadow-lg shadow-blue-500/5">
          <Layers className="size-5 stroke-[2.2]" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-black text-stone-50 tracking-tight">
            System Laboratory Architecture
          </h2>
          <p className="text-xs text-stone-400 font-medium leading-relaxed max-w-sm mx-auto">
            This module is undergoing active staging within our framework
            matrix. Native POS synchronization models are scheduled to manifest
            on production clusters soon.
          </p>
        </div>

        <div className="px-3.5 py-2.5 rounded-xl bg-[#0C0A09]/60 border border-stone-900/80 w-full flex items-center justify-between text-[11px] font-mono font-bold text-stone-500 uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="size-3.5 text-stone-600" /> Pipeline
            Registry
          </div>
          <span className="text-blue-400">Alpha Core Build v2.86</span>
        </div>

        <Button
          onClick={onClose}
          className="h-10 px-5 rounded-xl bg-[#1C1613] hover:bg-[#261E1A] border border-stone-800 text-stone-300 font-bold text-xs gap-2 transition-all active:scale-95 w-full sm:w-auto"
        >
          <ArrowLeft className="size-3.5" /> Back to Dashboard Terminal
        </Button>
      </Card>
    </div>
  );
}
