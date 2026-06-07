"use client";
import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  FileX,
  Zap,
  Coffee,
  Shield,
  TrendingUp,
} from "lucide-react";

export default function ProblemAgitation() {
  // Fraud Clip Simulator State
  const [paperStamps, setPaperStamps] = useState([true, true, true, false]);
  const [showWarning, setShowWarning] = useState(false);

  // Analytics Solution Clip State
  const [revenueMetric, setRevenueMetric] = useState(42);
  const [activePulse, setActivePulse] = useState(false);

  useEffect(() => {
    // 1. Loop simulating duplicate/fraud paper stamping
    const paperInterval = setInterval(() => {
      setPaperStamps([true, true, true, true]);
      setShowWarning(true);

      setTimeout(() => {
        setPaperStamps([true, true, true, false]);
        setShowWarning(false);
      }, 1800);
    }, 3500);

    // 2. Loop simulating clean live tracking transactions updating analytics metrics
    const analyticsInterval = setInterval(() => {
      setActivePulse(true);
      setRevenueMetric((prev) => (prev >= 48 ? 42 : prev + 2));
      setTimeout(() => setActivePulse(false), 600);
    }, 2500);

    return () => {
      clearInterval(paperInterval);
      clearInterval(analyticsInterval);
    };
  }, []);

  return (
    <section className="py-24 px-6 bg-[#FAF8F5] dark:bg-[#120E0B] border-y border-stone-200/60 dark:border-stone-900/60 bg-grain">
      <div className="max-w-6xl mx-auto">
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 text-xs font-bold uppercase tracking-wider mb-4 animate-pulse">
            <AlertTriangle className="size-3.5" />
            <span>The Hidden Leak in Storefront Margins</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-stone-900 dark:text-stone-50 mb-4">
            Paper punch cards are leaking your revenue
          </h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Traditional paper systems are invisible to analytics, trivial to
            forge, and constantly lost by customers at the bottom of bags.
          </p>
        </div>

        {/* Comparison Matrix Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* ================= COLUMN 1: THE PROBLEM (PAPER SYSTEM) ================= */}
          <div className="bg-white dark:bg-[#1C1612] border border-red-200/50 dark:border-red-950/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-sm flex flex-col justify-between group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/[0.01] rounded-full blur-2xl pointer-events-none" />

            <div>
              <h3 className="text-lg font-black text-red-700 dark:text-red-400 flex items-center gap-2 mb-6 pb-4 border-b border-stone-100 dark:border-stone-800/80">
                <FileX className="size-5 shrink-0" />
                The Vulnerable Paper Route
              </h3>

              <ul className="space-y-5 mb-8">
                <li className="flex items-start gap-3">
                  <div className="size-5 rounded-full bg-red-50 dark:bg-red-950/50 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0 mt-0.5 font-black text-xs">
                    ✕
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                      Easily Faked & Duplicated
                    </h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 leading-relaxed">
                      Anyone can buy a matching custom ink Amazon stamp. Margins
                      leak out via fake reward claims without any actual receipt
                      verification.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="size-5 rounded-full bg-red-50 dark:bg-red-950/50 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0 mt-0.5 font-black text-xs">
                    ✕
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                      Constantly Forgotten by Guests
                    </h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 leading-relaxed">
                      When cards get left at home, the customer retention loop
                      snaps. If they lose it entirely, they get frustrated and
                      go elsewhere.
                    </p>
                  </div>
                </li>{" "}
                <li className="flex items-start gap-3.5">
                  <div className="size-5 rounded-full bg-red-50 dark:bg-red-950/60 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0 mt-0.5 font-bold text-xs">
                    ✕
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-zinc-100 text-sm">
                      Zero Customer Data
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                      You have absolutely no idea who your best regulars are,
                      how often they return, or when your peak visit frequencies
                      happen.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* LIVE SIMULATOR REEL: The Fraud Card Clip */}
            <div className="bg-stone-50 dark:bg-[#120E0B] rounded-2xl p-4 border border-stone-200/40 relative min-h-[130px] flex flex-col justify-center">
              <span className="absolute top-2.5 right-3 text-[9px] font-bold text-stone-400 uppercase tracking-wider">
                Live Fraud Loop Demo
              </span>

              <div className="flex items-center gap-4">
                {/* Visual Representation of Old Crinkly Punch Card */}
                <div className="bg-amber-50 dark:bg-amber-950/20 border-2 border-dashed border-amber-800/30 rounded-xl p-3 flex gap-2 relative">
                  {paperStamps.map((filled, idx) => (
                    <div
                      key={idx}
                      className={`size-8 rounded-full border-2 flex items-center justify-center text-[10px] font-black transition-all duration-300 ${filled ? "bg-amber-900 text-white border-amber-950 scale-105" : "border-stone-300 bg-white text-transparent"}`}
                    >
                      {filled ? "☕" : idx + 1}
                    </div>
                  ))}
                  {/* Fake stamp tool indicator overlay */}
                  <div className="absolute -bottom-1 -right-2 text-xl animate-bounce pointer-events-none">
                    🪵
                  </div>
                </div>

                {/* Simulated Error Alert Overlay Box */}
                <div
                  className={`flex-1 transition-all duration-300 transform ${showWarning ? "opacity-100 translate-x-0" : "opacity-30 scale-95"}`}
                >
                  {showWarning ? (
                    <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 p-2 rounded-xl text-red-700 dark:text-red-400 text-[10px] font-semibold flex items-center gap-1.5 animate-shake">
                      <AlertTriangle className="size-3.5 shrink-0" />
                      <span>
                        Fraud Detected: Duplicate Unverified Stamp Applied
                      </span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-stone-400 font-medium italic pl-1">
                      Simulating unverified double-stamps...
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ================= COLUMN 2: THE SOLUTION (REGULARS CLUB) ================= */}
          <div className="bg-white dark:bg-[#1C1612] border border-amber-600/30 dark:border-amber-500/20 shadow-xl shadow-stone-200/30 dark:shadow-none rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between group ring-1 ring-amber-500/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/[0.02] rounded-full blur-2xl pointer-events-none" />

            <div>
              <h3 className="text-lg font-black text-amber-800 dark:text-amber-400 flex items-center gap-2 mb-6 pb-4 border-b border-stone-100 dark:border-stone-800/80">
                <Zap className="size-5 shrink-0 fill-amber-500/10" />
                With Regulars Club
              </h3>

              <ul className="space-y-5 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                      Invoice-Verified Stamper
                    </h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 leading-relaxed">
                      Our platform requires a secure invoice validation sequence
                      to cross-verify transactions. Eliminates double-stamping
                      exploits completely.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                      App-Free Browser Experience (PWA)
                    </h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 leading-relaxed">
                      Cards open instantly in their mobile web browser right
                      after scanning. No tedious App Store setup cycles, meaning
                      cards are never lost.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3.5">
                  <CheckCircle2 className="size-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-zinc-100 text-sm">
                      Automated Analytics Pipeline
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                      Track metrics across all locations. Identify your
                      high-value customers, measure return velocity, and make
                      data-backed choices.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* LIVE SIMULATOR REEL: The Secure Analytics Stream Clip */}
            <div className="bg-stone-900 text-stone-100 rounded-2xl p-4 border border-stone-800 relative min-h-[130px] flex flex-col justify-center">
              <span className="absolute top-2.5 right-3 text-[9px] font-bold text-stone-500 uppercase tracking-wider">
                Live Analytics Pipeline
              </span>

              <div className="flex items-center justify-between gap-4">
                {/* Live transaction indicator node */}
                <div className="flex flex-col gap-1.5 flex-1">
                  <div className="flex items-center gap-2 bg-stone-800/80 px-2.5 py-1.5 rounded-xl border border-stone-700 text-[10px] font-mono">
                    <Shield
                      className={`size-3 text-emerald-400 ${activePulse ? "scale-125" : ""}`}
                    />
                    <span className="text-stone-300">Invoice #20412 </span>
                    <span className="text-emerald-400 font-bold ml-auto animate-fade-in">
                      +1 Stamp
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-stone-800/30 opacity-40 px-2.5 py-1 rounded-xl text-[9px] font-mono">
                    <Shield className="size-3 text-stone-500" />
                    <span>Invoice #20411</span>
                    <span className="text-stone-400 ml-auto">Verified</span>
                  </div>
                </div>

                {/* Dashboard metric response element */}
                <div className="bg-gradient-to-br from-stone-800 to-stone-900 p-3 rounded-xl border border-stone-700/60 text-center min-w-[90px] shadow-sm relative">
                  {activePulse && (
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                  )}
                  <div className="text-xs text-stone-400 font-bold tracking-tight uppercase flex items-center justify-center gap-1 mb-0.5">
                    <TrendingUp className="size-3 text-amber-500" />
                    Visits
                  </div>
                  <span className="text-xl font-black font-mono text-stone-50 transition-all duration-300">
                    {revenueMetric}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
