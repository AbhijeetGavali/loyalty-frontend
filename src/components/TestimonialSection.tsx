"use client";
import React, { useState, useEffect } from "react";
import {
  Quote,
  StarIcon,
  ShieldCheck,
  Coffee,
  Smartphone,
} from "lucide-react";

export default function TestimonialSection() {
  // Live simulation states for Coffee Culture's streaming receipts
  const [activeReceipt, setActiveReceipt] = useState({
    id: "208",
    time: "Just now",
    stamps: "★★★★☆",
  });
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const streamInterval = setInterval(() => {
      setPulse(true);
      const ids = ["194", "201", "205", "208", "212"];
      const randomId = ids[Math.floor(Math.random() * ids.length)];

      setActiveReceipt({
        id: randomId,
        time: "Just now",
        stamps: "★★★★★",
      });

      setTimeout(() => setPulse(false), 800);
    }, 4500);

    return () => clearInterval(streamInterval);
  }, []);

  return (
    <section className="py-24 px-6  text-stone-100 relative overflow-hidden bg-grain ">
      {/* Decorative Brand Ambience Blur Blooms */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-amber-500/[0.02] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-orange-500/[0.01] blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Subtle Top Tag Row */}
        <div className="flex items-center justify-center gap-2 mb-16">
          <div className="h-px w-6 bg-stone-800" />
          <p className="text-[11px] font-bold uppercase tracking-widest text-amber-500/80 flex items-center gap-1.5">
            <Coffee className="size-3" /> Spotlights From The Counter
          </p>
          <div className="h-px w-6 bg-stone-800" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Main Testimonial Card Block (Spans 2 columns) */}
          <div className="lg:col-span-2 relative overflow-hidden bg-stone-900/20 border border-stone-900 rounded-3xl p-8 sm:p-10 flex flex-col justify-between group transition-all duration-300 hover:border-stone-800/80 hover:bg-stone-900/30">
            {/* Elegant warm backdrop quote icon accent */}
            <Quote className="absolute -top-6 -left-4 size-28 text-stone-800/20 pointer-events-none select-none group-hover:text-amber-500/[0.03] transition-colors duration-500" />

            <div>
              {/* Star Tier Layout */}
              <div className="flex gap-1 mb-8">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className="size-4 fill-amber-500 text-amber-500 animate-pulse"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>

              {/* Big Quote Sentence */}
              <blockquote className="text-xl sm:text-2xl font-medium tracking-tight text-stone-100 leading-relaxed mb-10">
                “Since dropping paper cards for Regulars Club, we’ve seen a{" "}
                <span className="text-amber-400 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-900/30 font-bold">
                  30% spike in repeat visits
                </span>
                . Our guests love that they don&apos;t have to download an extra app,
                and the anti-fraud invoice check completely protects our profit
                margins.”
              </blockquote>
            </div>

            {/* Profile Avatar Block Container */}
            <div className="flex items-center gap-4 pt-4 border-t border-stone-900">
              <div className="size-11 rounded-2xl bg-gradient-to-br from-amber-800 to-amber-950 border border-amber-700/50 flex items-center justify-center font-black text-xs text-amber-200 uppercase tracking-wider shrink-0 shadow-inner">
                RV
              </div>
              <div>
                <div className="font-bold text-white text-sm sm:text-base tracking-tight">
                  Rahul V.
                </div>
                <div className="text-xs text-stone-500 font-semibold tracking-wide flex items-center gap-1">
                  Owner, Coffee Culture & Co.{" "}
                  <span className="text-stone-700">•</span> Bengaluru
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN SIDEBAR: Live Activity Screen + Operational Ledger Card */}
          <div className="bg-stone-900/40 border border-stone-800/80 rounded-3xl p-6 flex flex-col justify-between relative group transition-all duration-300 hover:border-stone-700/60">
            {/* Top Identity Meta Meta row */}
            <div className="mb-6">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-4 flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-emerald-500" /> Counter
                Verification Log
              </h4>

              {/* Verified Metrics Stack */}
              <div className="space-y-4">
                <div className="flex justify-between items-baseline bg-[#110E0C] p-3 rounded-xl border border-stone-950">
                  <span className="text-xs text-stone-400 font-medium">
                    Retention Boost
                  </span>
                  <span className="text-xl font-black font-mono text-stone-100">
                    +30%
                  </span>
                </div>
                <div className="flex justify-between items-baseline bg-[#110E0C] p-3 rounded-xl border border-stone-950">
                  <span className="text-xs text-stone-400 font-medium">
                    Avg Loop Cycle
                  </span>
                  <span className="text-xl font-black font-mono text-amber-400">
                    5 Days
                  </span>
                </div>
                <div className="flex justify-between items-baseline bg-[#110E0C] p-3 rounded-xl border border-stone-950">
                  <span className="text-xs text-stone-400 font-medium">
                    Exploit Incidents
                  </span>
                  <span className="text-xl font-black font-mono text-emerald-500">
                    0%
                  </span>
                </div>
              </div>
            </div>

            {/* LOWER INTERACTIVE CLIP: Live Ticker Screen Stream */}
            <div className="bg-[#110E0C] border border-stone-950 rounded-2xl p-3.5 mt-2 relative overflow-hidden flex flex-col justify-center min-h-[95px]">
              <div className="absolute top-2 right-3 flex items-center gap-1 text-[8px] font-bold uppercase tracking-wider text-stone-600">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-ping" />{" "}
                Real-time feed
              </div>

              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 shrink-0">
                  <Smartphone className="size-4 text-amber-500" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-mono text-stone-300 flex items-center gap-1">
                    Receipt{" "}
                    <span className="text-stone-500">
                      #CC-{activeReceipt.id}
                    </span>
                    {pulse && (
                      <span className="text-[9px] font-bold text-emerald-400 animate-fade-in ml-auto">
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-stone-400 truncate font-semibold mt-0.5 flex items-center gap-1">
                    Logged Card Stamp{" "}
                    <span className="text-amber-500 text-[9px] font-mono tracking-tight">
                      {activeReceipt.stamps}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
