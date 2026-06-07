"use client";
import React, { useState, useEffect } from "react";
import {
  QrCode,
  ArrowUpRight,
  BarChart3,
  MapPin,
  Sliders,
  Gift,
  Sparkles,
  Coffee,
  CheckCircle,
} from "lucide-react";

export default function BenefitsGrid() {
  // Live State Simulators for UI clips
  const [stampCount, setStampCount] = useState(3);
  const [chartValue, setChartValue] = useState(84);
  const [pulseActive, setPulseActive] = useState(false);

  useEffect(() => {
    // Simulates an app-free user getting a reward stamp
    const stampInterval = setInterval(() => {
      setStampCount((prev) => (prev >= 5 ? 0 : prev + 1));
    }, 2800);

    // Simulates live foot traffic metrics climbing on the dashboard
    const metricsInterval = setInterval(() => {
      setPulseActive(true);
      setChartValue((prev) => (prev >= 92 ? 84 : prev + 4));
      setTimeout(() => setPulseActive(false), 800);
    }, 3400);

    return () => {
      clearInterval(stampInterval);
      clearInterval(metricsInterval);
    };
  }, []);

  return (
    <section className="py-24 px-6 text-stone-100 relative overflow-hidden bg-grain">
      {/* Soft warm ambient lighting blooms */}
      <div className="absolute top-1/3 left-1/4 w-[800px] h-[400px] bg-amber-500/[0.03] blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[300px] bg-orange-500/[0.02] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="size-3.5" />
            <span>Why Brands Choose Regulars Club</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 bg-gradient-to-b from-white to-stone-300 bg-clip-text text-transparent">
            Everything you need to turn casual visitors into loyal regulars
          </h2>
          <p className="text-stone-400 text-sm sm:text-base max-w-xl mx-auto">
            Ditch complex apps and fragile paper. Run a high-conversion,
            fraud-proof digital loyalty loop straight from your shop counter.
          </p>
        </div>

        {/* Enhanced Bento-Style Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {/* BENEFIT 1: One QR Code + Live Card Clip */}
          <div className="bg-stone-900/40 border border-stone-800/80 p-6 rounded-3xl flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1 hover:border-stone-700/80 hover:bg-stone-900/60">
            <div className="mb-6">
              <div className="size-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-5 text-amber-400 group-hover:scale-105 transition-transform">
                <QrCode className="size-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                One QR Code, Zero Apps
              </h3>
              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                Print a single sleek tag for your register. Customers scan,
                instantly open their progressive web pass in Safari or Chrome,
                and stack points.
              </p>
            </div>

            {/* CLIP: Live Browser Wallet Experience */}
            <div className="mt-4 bg-[#110E0C] border border-stone-800 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[110px] relative overflow-hidden">
              <div className="w-full max-w-[180px] bg-stone-900 border border-stone-800 rounded-xl p-2.5 shadow-xl text-center">
                <div className="text-[9px] uppercase font-bold tracking-wider text-amber-500 mb-1.5 flex items-center justify-center gap-1">
                  <Coffee className="size-2.5" /> Golden Roast Café
                </div>
                {/* Simulated Stamp Grid Blocks */}
                <div className="flex justify-center gap-1.5 py-1">
                  {[1, 2, 3, 4, 5].map((slot) => (
                    <div
                      key={slot}
                      className={`size-6 rounded-full border flex items-center justify-center text-[9px] font-black transition-all duration-500 ${
                        slot <= stampCount
                          ? "bg-amber-600 text-white border-amber-500 scale-110"
                          : "bg-stone-950 border-stone-800 text-stone-600"
                      }`}
                    >
                      {slot <= stampCount ? "☕" : slot}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* BENEFIT 2: Predictable Repeat Visits */}
          <div className="bg-stone-900/40 border border-stone-800/80 p-6 rounded-3xl flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1 hover:border-stone-700/80 hover:bg-stone-900/60">
            <div className="mb-6">
              <div className="size-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5 text-emerald-400 group-hover:scale-105 transition-transform">
                <ArrowUpRight className="size-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Predictable Repeat Visits
              </h3>
              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                Leverage gamified reward mechanics to stay top of mind. Cafe
                owners see an average 40% uptick in customer return velocity
                inside 60 days.
              </p>
            </div>

            {/* CLIP: Retention Counter Tag */}
            <div className="mt-4 bg-[#110E0C] border border-stone-800 rounded-2xl p-4 flex items-center justify-center gap-3 min-h-[110px]">
              <div className="bg-emerald-950/30 border border-emerald-500/20 px-4 py-3 rounded-2xl text-center">
                <div className="text-[26px] font-black font-mono text-emerald-400 leading-none">
                  +42%
                </div>
                <div className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mt-1">
                  Monthly Visits
                </div>
              </div>
            </div>
          </div>

          {/* BENEFIT 3: Real-Time Analytics Dashboard + Live Pipeline Clip */}
          <div className="bg-stone-900/40 border border-stone-800/80 p-6 rounded-3xl flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1 hover:border-stone-700/80 hover:bg-stone-900/60">
            <div className="mb-6">
              <div className="size-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5 text-blue-400 group-hover:scale-105 transition-transform">
                <BarChart3 className="size-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Live Analytics Engine
              </h3>
              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                Monitor live storefront activity, see total rewards claimed,
                measure peak rush hours, and pinpoint your top 10% most
                profitable regulars instantly.
              </p>
            </div>

            {/* CLIP: Analytics Live Stream Feed */}
            <div className="mt-4 bg-[#110E0C] border border-stone-800 rounded-2xl p-4 flex items-center justify-between gap-2 min-h-[110px]">
              <div className="flex flex-col gap-1 w-2/3">
                <div className="h-3 w-full bg-stone-800/80 rounded-md animate-pulse" />
                <div className="h-3 w-4/5 bg-stone-800/50 rounded-md animate-pulse" />
              </div>
              <div className="bg-stone-900 border border-stone-700/50 p-2 rounded-xl text-center min-w-[70px] relative">
                {pulseActive && (
                  <span className="absolute -top-0.5 -right-0.5 flex size-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  </span>
                )}
                <div className="text-[8px] uppercase tracking-wider text-stone-500 font-bold">
                  Total Scans
                </div>
                <span className="text-sm font-bold font-mono text-stone-200">
                  {chartValue}
                </span>
              </div>
            </div>
          </div>

          {/* BENEFIT 4: Smart GPS Multi-Branching + Geofence Clip */}
          <div className="bg-stone-900/40 border border-stone-800/80 p-6 rounded-3xl flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1 hover:border-stone-700/80 hover:bg-stone-900/60">
            <div className="mb-6">
              <div className="size-11 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-5 text-orange-400 group-hover:scale-105 transition-transform">
                <MapPin className="size-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Smart GPS Multi-Branching
              </h3>
              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                Running multiple outlets? Use the exact same physical QR code
                sheet. The browser automatically confirms the correct store
                location via background GPS.
              </p>
            </div>

            {/* CLIP: GPS Radar Simulation */}
            <div className="mt-4 bg-[#110E0C] border border-stone-800 rounded-2xl p-3 flex items-center justify-center min-h-[110px] relative overflow-hidden">
              <div className="absolute size-14 border border-orange-500/20 rounded-full animate-ping pointer-events-none" />
              <div className="bg-orange-950/40 border border-orange-500/30 px-3 py-1.5 rounded-xl flex items-center gap-2 text-[10px] font-mono text-orange-300 shadow-sm">
                <MapPin className="size-3 text-orange-400 animate-bounce" />
                <span>Downtown Branch Locked</span>
              </div>
            </div>
          </div>

          {/* BENEFIT 5: Anti-Fraud Protection */}
          <div className="bg-stone-900/40 border border-stone-800/80 p-6 rounded-3xl flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1 hover:border-stone-700/80 hover:bg-stone-900/60">
            <div className="mb-6">
              <div className="size-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-5 text-purple-400 group-hover:scale-105 transition-transform">
                <Sliders className="size-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Anti-Fraud Protection
              </h3>
              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                Protect your profit margins. Each stamp distribution event
                requires an active receipt or invoice cross-reference validation
                to block employee exploitation.
              </p>
            </div>

            {/* CLIP: Verified Safe Checkbox */}
            <div className="mt-4 bg-[#110E0C] border border-stone-800 rounded-2xl p-4 flex items-center justify-center gap-2 min-h-[110px]">
              <div className="flex items-center gap-2 bg-stone-900 px-3 py-2 rounded-xl border border-stone-800 text-[10px] text-stone-300 font-mono">
                <CheckCircle className="size-3.5 text-emerald-400 shrink-0" />
                <span>Invoice Certified</span>
              </div>
            </div>
          </div>

          {/* BENEFIT 6: Free Acrylic Welcome Kit */}
          <div className="bg-stone-900/40 border border-stone-800/80 p-6 rounded-3xl flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1 hover:border-stone-700/80 hover:bg-stone-900/60">
            <div className="mb-6">
              <div className="size-11 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-5 text-rose-400 group-hover:scale-105 transition-transform">
                <Gift className="size-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Custom QR Counter Display
              </h3>
              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                Download your custom-branded QR template instantly and print it for your counter — or use the fullscreen display mode on any tablet or screen.
              </p>
            </div>

            {/* CLIP: Floating Acrylic Stand Silhouette */}
            <div className="mt-4 bg-[#110E0C] border border-stone-800 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[110px] relative group-hover:bg-[#1A1410] transition-colors">
              <div className="w-9 h-14 bg-stone-800 dark:bg-stone-700 rounded-t-md relative shadow-md flex items-center justify-center border-t border-x border-stone-600/40">
                <QrCode className="size-4 text-stone-500" />
                <div className="absolute bottom-0 w-12 h-1.5 bg-stone-600 rounded-full shadow-sm" />
              </div>
              <span className="text-[9px] font-bold text-stone-500 uppercase tracking-widest mt-2">
                Print or display anywhere
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
