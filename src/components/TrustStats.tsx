"use client";
import React, { useState, useEffect } from "react";
import { Store, QrCode, TrendingUp, ShieldCheck, Activity } from "lucide-react";

export default function TrustStats() {
  // Live metric counters for continuous movement
  const [liveStamps, setLiveStamps] = useState(52140);
  const [pulseMetric, setPulseMetric] = useState(false);

  useEffect(() => {
    // Simulates live checkouts processing stamps across India stores in real-time
    const stampTicker = setInterval(() => {
      setPulseMetric(true);
      setLiveStamps((prev) => prev + Math.floor(Math.random() * 3) + 1);
      setTimeout(() => setPulseMetric(false), 600);
    }, 4000);

    return () => clearInterval(stampTicker);
  }, []);

  const stats = [
    {
      value: "India",
      label: "Built & Hosted in India",
      icon: <Store className="size-4 text-amber-400" />,
      clip: (
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] dark:opacity-[0.05] group-hover:opacity-[0.08] transition-opacity pointer-events-none -z-10">
          <div className="size-24 rounded-full border border-amber-500 animate-ping" />
        </div>
      ),
    },
    {
      value: liveStamps.toLocaleString() + "+",
      label: "Digital Stamps Processed",
      icon: <QrCode className="size-4 text-orange-400" />,
      clip: (
        <div className="absolute top-2 right-3 flex items-center gap-1 bg-stone-900 border border-stone-800 px-1.5 py-0.5 rounded text-[9px] font-mono text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
          <Activity className="size-2.5 animate-pulse" /> Live Stream
        </div>
      ),
    },
    {
      value: "40%",
      label: "Average Retention Rate Boost",
      icon: <TrendingUp className="size-4 text-emerald-400" />,
      clip: (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-4/5 h-1 bg-stone-900 rounded-full overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="h-full bg-emerald-500 w-[40%] rounded-full animate-pulse" />
        </div>
      ),
    },
    {
      value: "0%",
      label: "Fraudulent Claims Encountered",
      icon: <ShieldCheck className="size-4 text-amber-500" />,
      clip: (
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      ),
    },
  ];

  return (
    <section className="py-20 px-6  text-stone-100 relative overflow-hidden bg-grain ">
      {/* Background soft copper light blooms */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[250px] bg-amber-500/[0.02] blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[250px] bg-orange-500/[0.01] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Animated Subtitle Header */}
        <div className="flex items-center justify-center gap-2 mb-12 text-center">
          <div className="h-[1px] w-8 bg-stone-800" />
          <p className="text-[11px] font-bold text-stone-500 uppercase tracking-widest flex items-center gap-1.5">
            Empowering Independent Storefronts Across India
          </p>
          <div className="h-[1px] w-8 bg-stone-800" />
        </div>

        {/* Interactive Score Grid Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="relative overflow-hidden bg-stone-900/20 border border-stone-900 rounded-2xl p-6 flex flex-col justify-between items-center text-center group transition-all duration-300 hover:-translate-y-1 hover:border-stone-800/80 hover:bg-stone-900/40 z-10"
            >
              {/* Dynamic contextual clip component logic */}
              {stat.clip}

              {/* Icon Frame */}
              <div className="size-8 rounded-lg bg-stone-900/60 border border-stone-800/60 flex items-center justify-center mb-4 text-stone-400 group-hover:text-white transition-colors">
                {stat.icon}
              </div>

              {/* Big Numerical Metrics */}
              <div className="relative mb-2">
                {index === 1 && pulseMetric && (
                  <span className="absolute -top-1 -right-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                )}
                <span className="text-4xl sm:text-5xl font-black font-mono bg-gradient-to-b from-white to-stone-400 bg-clip-text text-transparent tracking-tight group-hover:to-stone-200 transition-all duration-300">
                  {stat.value}
                </span>
              </div>

              {/* Text Meta Label */}
              <div className="text-xs text-stone-400 max-w-[170px] font-bold tracking-tight leading-snug group-hover:text-stone-300 transition-colors">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
