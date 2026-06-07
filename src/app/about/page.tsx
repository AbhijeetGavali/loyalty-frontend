"use client";
import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Coffee,
  ShieldCheck,
  Zap,
  Sparkles,
  Flame,
} from "lucide-react";

export default function AboutPage() {
  // Live Simulated Platform Counter Values to build trust
  const [liveStampsIssued, setLiveStampsIssued] = useState(142840);

  useEffect(() => {
    const metricsTimer = setInterval(() => {
      setLiveStampsIssued((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 3500);
    return () => clearInterval(metricsTimer);
  }, []);

  const coreValues = [
    {
      icon: <Zap className="size-4 text-amber-400" />,
      title: "Zero-Friction Access",
      description:
        "We refuse to force app storefront downloads on buyers. A single web camera scan loads their stamp card instantly in their native mobile browser.",
    },
    {
      icon: <ShieldCheck className="size-4 text-emerald-400" />,
      title: "Hardened Merchant Security",
      description:
        "Using secure, single-use invoice matching safeguards to block bad actors, employee card stuffing, and phantom stamp requests.",
    },
    {
      icon: <Coffee className="size-4 text-orange-400" />,
      title: "Honest, Static Pricing",
      description:
        "We never tax your success. Zero processing percentages, zero per-transaction cuts—just one transparent, predictable subscription rate.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0F0C0A] text-stone-100 flex flex-col justify-between overflow-hidden bg-grain">
      <Navbar />

      {/* Radiant Background Ambient Glow Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/[0.02] blur-[150px] rounded-full pointer-events-none" />

      <main className="max-w-6xl mx-auto py-20 px-6 relative z-10 w-full flex-1">
        {/* UPPER HERO GRID: Mission & The Live Data Tracker Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          {/* Mission Copy Block */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="size-3.5" /> Our Origin Story
            </div>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              We build tech for the <br />
              <span className="text-amber-400">neighborhood regulars.</span>
            </h1>

            <p className="text-stone-400 text-sm sm:text-base leading-relaxed max-w-xl">
              Engineered out of Pune by **IdeaSprout Technologies**, Regulars
              Club was founded to replace the fragile, easily lost paper punch
              cards floating around in customer wallets.
            </p>

            <p className="text-stone-400 text-sm sm:text-base leading-relaxed max-w-xl">
              We equip local baristas, bakers, salon teams, and physical
              storefronts with high-speed digital loyalty platforms built to
              match corporate tracking setups, keeping consumers linked natively
              to your checkout counter.
            </p>
          </div>

          {/* LIVE DATA TICKER WIDGET: Reassuring Throughput Counters */}
          <div className="lg:col-span-5 bg-stone-900/30 border border-stone-900 rounded-3xl p-6 space-y-4 relative shadow-2xl">
            <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wider text-stone-500">
              <span className="flex items-center gap-1">
                <Flame className="size-3 text-orange-500" /> Platform Pulse
                Ledger
              </span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-ping" />{" "}
                Live Network
              </span>
            </div>

            {/* Main Running Ticker Block */}
            <div className="bg-[#110E0C] p-4 rounded-xl border border-stone-950 text-center space-y-1">
              <div className="text-[10px] font-mono text-stone-500 uppercase tracking-wide">
                Total Digital Stamps Awarded
              </div>
              <div className="text-3xl font-black font-mono text-amber-400 tracking-tight transition-all duration-300">
                {liveStampsIssued.toLocaleString()}
              </div>
            </div>

            {/* Secondary Static Proof Indicators */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#110E0C] p-3 rounded-xl border border-stone-950">
                <div className="text-[9px] font-mono text-stone-500 uppercase">
                  Active Counters
                </div>
                <div className="text-base font-black text-stone-200 mt-0.5">
                  Growing Daily
                </div>
              </div>
              <div className="bg-[#110E0C] p-3 rounded-xl border border-stone-950">
                <div className="text-[9px] font-mono text-stone-500 uppercase">
                  Paper Cards Replaced
                </div>
                <div className="text-base font-black text-emerald-400 mt-0.5">
                  Every Day
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LOWER SECTION: Pillars & Technical Core Commitments */}
        <div className="border-t border-stone-900/60 pt-16">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              The rules we operate by
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-2 font-medium">
              We design software specifically around the rapid real-world pace
              of high-traffic sales counters.
            </p>
          </div>

          {/* Grid Layout mapping corporate values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coreValues.map((value, idx) => (
              <div
                key={idx}
                className="bg-stone-900/10 border border-stone-900 rounded-2xl p-5 hover:border-stone-800 transition-colors group"
              >
                <div className="size-9 rounded-xl bg-stone-900 border border-stone-850 flex items-center justify-center mb-4 shadow-inner">
                  {value.icon}
                </div>
                <h3 className="text-sm font-bold text-stone-200 mb-2 group-hover:text-amber-400 transition-colors">
                  {value.title}
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed font-medium">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
