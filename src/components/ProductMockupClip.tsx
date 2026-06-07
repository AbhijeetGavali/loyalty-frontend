"use client";
import React, { useState, useEffect } from "react";
import { Check, Star, Coffee } from "lucide-react";

export function ProductMockupClip() {
  const [stamps, setStamps] = useState<boolean[]>([
    true,
    true,
    true,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [isAnimating, setIsAnimating] = useState(false);

  // Simple automated loop simulating a customer collecting stamps over time
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setStamps((prev) => {
        const nextActiveIndex = prev.indexOf(false);
        if (nextActiveIndex === -1 || nextActiveIndex >= 6) {
          // Reset after hitting near capacity
          return [true, true, true, false, false, false, false, false];
        }
        const updated = [...prev];
        updated[nextActiveIndex] = true;
        return updated;
      });

      setTimeout(() => setIsAnimating(false), 600);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative mx-auto my-8 w-[280px] h-[540px] bg-slate-950 rounded-[40px] p-3 shadow-2xl border-4 border-slate-800 ring-1 ring-slate-900/10 overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
      {/* Phone Camera Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-4 bg-slate-950 rounded-b-xl z-30" />

      {/* PWA Browser Interface Container */}
      <div className="w-full h-full bg-[#FAF8F5] rounded-[32px] overflow-hidden flex flex-col justify-between p-4 relative font-sans text-slate-800">
        {/* Top Header Branding */}
        <div className="text-center pt-4 border-b border-amber-900/5 pb-3">
          <div className="inline-flex items-center justify-center size-8 rounded-full bg-amber-900/10 text-amber-900 font-bold text-xs mb-1">
            ☕
          </div>
          <h4 className="text-sm font-black tracking-tight text-amber-900">
            Blue Tokai Roasters
          </h4>
          <p className="text-[10px] text-slate-400 font-medium">
            Your Digital Loyalty Pass
          </p>
        </div>

        {/* The Live Interactive Stamp Matrix Grid Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 my-auto">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              Stamp Rewards Card
            </span>
            <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
              {stamps.filter(Boolean).length}/8 Collected
            </span>
          </div>

          {/* Grid Grid Blocks */}
          <div className="grid grid-cols-4 gap-2.5">
            {stamps.map((active, index) => (
              <div
                key={index}
                className={`aspect-square rounded-xl border-2 flex items-center justify-center relative transition-all duration-500 ${
                  active
                    ? "border-amber-700 bg-amber-50 text-amber-800"
                    : "border-dashed border-slate-200 bg-slate-50 text-slate-300"
                } ${active && index === stamps.filter(Boolean).length - 1 && isAnimating ? "scale-115 rotate-6" : ""}`}
              >
                {active ? (
                  <Coffee className="size-5 stroke-[2.5] animate-fade-in" />
                ) : (
                  <span className="text-xs font-bold">{index + 1}</span>
                )}

                {/* Micro animation pop explosion hint */}
                {active &&
                  index === stamps.filter(Boolean).length - 1 &&
                  isAnimating && (
                    <span className="absolute inset-0 rounded-xl bg-amber-400/20 animate-ping pointer-events-none" />
                  )}
              </div>
            ))}
          </div>

          <p className="text-[10px] text-slate-400 text-center mt-3 font-medium">
            Collect 8 stamps to unlock 1 Free Craft Brew
          </p>
        </div>

        {/* Live Scan Notification Alert Box Graphic */}
        <div className="bg-emerald-950 text-emerald-300 text-[11px] font-medium p-2.5 rounded-xl flex items-center gap-2 border border-emerald-800 shadow-sm animate-pulse mb-2">
          <div className="size-4 rounded-full bg-emerald-500 flex items-center justify-center text-emerald-950">
            <Check className="size-2.5 stroke-[4]" />
          </div>
          <span>
            Stamp # {stamps.filter(Boolean).length} authorized via invoice
            verification!
          </span>
        </div>
      </div>
    </div>
  );
}
