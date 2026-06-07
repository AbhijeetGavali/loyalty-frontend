"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Coffee, Smartphone, Heart } from "lucide-react";

export default function CtaSection() {
  // Live State Simulator for the floating reward card
  const [completeStamp, setCompleteStamp] = useState(false);

  useEffect(() => {
    // Simulates a card ticking its final stamp to get a free reward item
    const stampTimer = setInterval(() => {
      setCompleteStamp((prev) => !prev);
    }, 2800);

    return () => clearInterval(stampTimer);
  }, []);

  return (
    <section className="relative overflow-hidden py-28 px-6  text-stone-100 bg-grain ">
      {/* Radiant Amber & Gold Aura Blooms */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-amber-500/[0.03] blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-24 right-10 w-[400px] h-[200px] bg-orange-500/[0.02] blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* UPPER FLOATING MINI-CLIP: The Real-time Reward Experience */}
        <div className="mb-10 relative group perspective-1000">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/20 to-transparent blur-xl rounded-full opacity-60 group-hover:opacity-100 transition-opacity" />

          {/* Mock Smartphone Pass Floating Frame */}
          <div className="relative bg-[#16120F] border border-stone-800 p-4 rounded-2xl w-56 shadow-2xl transition-transform duration-500 hover:scale-105 select-none text-center">
            <div className="text-[9px] uppercase font-bold tracking-widest text-stone-500 mb-2 flex items-center justify-center gap-1">
              <Coffee className="size-2.5 text-amber-500" /> Neighborhood Roast
            </div>

            {/* The Stamp Loop Indicator Block */}
            <div className="flex gap-1.5 justify-center py-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`size-6 rounded-full border flex items-center justify-center text-[10px] font-black transition-all duration-500 ${
                    i < 4 || completeStamp
                      ? "bg-amber-600 border-amber-400 text-white scale-105 shadow-md shadow-amber-900/30"
                      : "bg-stone-950 border-stone-800 text-stone-700"
                  }`}
                >
                  {i < 4 || completeStamp ? "☕" : i}
                </div>
              ))}
            </div>

            {/* Micro-Notification Dynamic Banner */}
            <div className="mt-2 h-5 flex items-center justify-center">
              {completeStamp ? (
                <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-1 animate-fade-in">
                  <Heart className="size-2.5 fill-emerald-500 text-emerald-500 animate-bounce" />{" "}
                  Next Cup Free!
                </span>
              ) : (
                <span className="text-[9px] font-mono text-stone-500">
                  1 stamp needed
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Urgency/Trust micro badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-sm">
          <Sparkles className="size-3.5" />
          <span>Launch In Under 5 Minutes</span>
        </div>

        {/* Dynamic Typography Header Layout */}
        <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-6 max-w-2xl bg-gradient-to-b from-white to-stone-300 bg-clip-text text-transparent leading-tight">
          Ready to turn first-time visitors into shop regulars?
        </h2>

        <p className="text-base sm:text-lg text-stone-400 mb-10 max-w-xl mx-auto leading-relaxed font-medium">
          Digitize your physical loyalty loyalty setup cleanly. Claim your{" "}
          <span className="text-amber-400 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-900/30 font-bold">
            3-day free trial
          </span>{" "}
          today — no credit cards needed, cancel single-click anytime.
        </p>

        {/* Action Button & Interface Meta Indicators */}
        <div className="flex flex-col items-center gap-4 w-full sm:w-auto">
          <Link
            href="/register-business?plan=BASIC"
            className="w-full sm:w-auto"
          >
            <Button
              size="lg"
              className="w-full sm:w-auto px-8 py-6 rounded-xl bg-amber-500 text-stone-950 hover:bg-amber-400 font-bold text-base shadow-xl shadow-amber-500/10 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 group border border-amber-400/20"
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>

          {/* Micro-UX support legend lines */}
          <p className="text-[11px] font-medium text-stone-500 tracking-wide mt-2 flex items-center gap-2">
            <span>No software installations</span>
            <span className="text-stone-800">•</span>
            <span className="flex items-center gap-1">
              <Smartphone className="size-3" /> 100% Mobile Browser PWA
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
