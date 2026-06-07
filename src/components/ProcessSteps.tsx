"use client";
import React, { useState, useEffect } from "react";
import { AppWindow, Presentation, Users, Sparkles, Coffee } from "lucide-react";

export default function ProcessSteps() {
  // Live State Simulators for Onboarding Steps
  const [milestoneCount, setMilestoneCount] = useState(8);
  const [qrPulse, setQrPulse] = useState(false);
  const [growthMetrics, setGrowthMetrics] = useState([40, 55, 85]);

  useEffect(() => {
    // Step 1: Simulates choosing reward thresholds (e.g. 8 stamps vs 10 stamps)
    const milestoneInterval = setInterval(() => {
      setMilestoneCount((prev) => (prev === 8 ? 10 : 8));
    }, 3000);

    // Step 2: Simulates incoming customer scans bouncing on the physical card stand
    const qrInterval = setInterval(() => {
      setQrPulse(true);
      setTimeout(() => setQrPulse(false), 800);
    }, 2400);

    // Step 3: Simulates upward climbing conversion analytics charts
    const growthInterval = setInterval(() => {
      setGrowthMetrics((prev) => {
        const next = [...prev];
        next[2] = next[2] >= 95 ? 75 : next[2] + 5;
        return next;
      });
    }, 2000);

    return () => {
      clearInterval(milestoneInterval);
      clearInterval(qrInterval);
      clearInterval(growthInterval);
    };
  }, []);

  const steps = [
    {
      number: "01",
      icon: <AppWindow className="size-5" />,
      title: "Register Your Spot",
      desc: "Sign up in 60 seconds. Input your workspace details and define your reward milestones (e.g., Buy 8 coffees, get the 9th free).",
      clip: (
        <div className="w-full bg-[#110E0C] border border-stone-800 rounded-2xl p-4 flex flex-col justify-center min-h-[120px]">
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-2 flex items-center justify-between text-[11px] font-mono text-stone-300">
            <span className="flex items-center gap-1.5">
              <Coffee className="size-3.5 text-amber-500" /> Goal Threshold:
            </span>
            <span className="bg-amber-950 text-amber-400 font-bold px-2 py-0.5 rounded border border-amber-900/50 transition-all duration-300">
              {milestoneCount} Stamps
            </span>
          </div>
          <div className="flex gap-1 justify-center mt-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`size-3 rounded-full border ${i < 3 ? "bg-amber-600 border-amber-500" : "bg-stone-950 border-stone-800"}`}
              />
            ))}
          </div>
        </div>
      ),
    },
    {
      number: "02",
      icon: <Presentation className="size-5" />,
      title: "Display Your Counter QR",
      desc: "Download your custom digital templates instantly, or place the premium physical acrylic counter stand we ship straight to your door.",
      clip: (
        <div className="w-full bg-[#110E0C] border border-stone-800 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[120px] relative overflow-hidden">
          {qrPulse && (
            <div className="absolute size-16 border border-amber-500/20 rounded-full animate-ping pointer-events-none" />
          )}
          <div className="w-8 h-12 bg-stone-900 rounded-t border-t border-x border-stone-700 relative shadow-lg flex items-center justify-center">
            <div className="size-4 bg-white rounded p-0.5 flex items-center justify-center">
              <div className="size-3 bg-stone-950 rounded-[1px]" />
            </div>
            <div className="absolute bottom-0 w-10 h-1 bg-stone-600 rounded-full" />
          </div>
          <span className="text-[9px] font-mono text-stone-500 mt-2">
            Counter Display Sheet
          </span>
        </div>
      ),
    },
    {
      number: "03",
      icon: <Users className="size-5" />,
      title: "Watch Your Revenue Grow",
      desc: "Customers scan to claim stamps on every checkout. Track repeat frequencies, retention metrics, and trends straight from your dashboard.",
      clip: (
        <div className="w-full bg-[#110E0C] border border-stone-800 rounded-2xl p-4 flex flex-col justify-end min-h-[120px] gap-2">
          <div className="flex items-end justify-center gap-3 h-12 pt-2">
            {growthMetrics.map((val, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center gap-1 flex-1"
              >
                <div
                  className="w-full rounded-t bg-gradient-to-t from-amber-900 to-amber-500 transition-all duration-500 relative"
                  style={{ height: `${val / 2}px` }}
                >
                  {idx === 2 && (
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 size-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  )}
                </div>
                <span className="text-[8px] font-mono text-stone-600">
                  Wk 0{idx + 1}
                </span>
              </div>
            ))}
          </div>
          <div className="text-[10px] text-center text-emerald-400 font-bold font-mono tracking-tight">
            +{growthMetrics[2]}% Retention Return
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="py-24 px-6  text-stone-100 relative overflow-hidden bg-grain" id="how">
      {/* Delicate upper light glow overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[250px] bg-amber-500/[0.02] blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-24">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="size-3.5" />
            <span>Up and running in 3 simple steps</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-4">
            Go live with your digital loyalty cards in 3 steps
          </h2>
          <p className="text-stone-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Zero engineering pipelines required. Zero heavy hardware
            installations. Just clean browser mechanics setup under 5 minutes.
          </p>
        </div>

        {/* Timeline Matrix Wrapper */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative items-stretch">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative z-10 flex flex-col justify-between bg-stone-900/30 border border-stone-800/60 rounded-3xl p-6 transition-all duration-300 hover:border-stone-700/80 hover:bg-stone-900/50 group"
            >
              <div>
                {/* Header Sequence Card row */}
                <div className="flex items-center justify-between mb-6">
                  <div className="size-11 rounded-xl bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-400 transition-transform duration-500 group-hover:[transform:rotateY(180deg)]">
                    {step.icon}
                  </div>
                  <span className="font-mono text-sm font-black text-stone-600 tracking-wider">
                    STEP / {step.number}
                  </span>
                </div>

                {/* Text Block Details */}
                <h3 className="text-lg font-bold text-white mb-2 tracking-tight group-hover:text-amber-400 transition-colors flex items-center gap-1">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-400 leading-relaxed mb-6">
                  {step.desc}
                </p>
              </div>

              {/* Dynamic Interactive Mini-Clip Window */}
              <div className="mt-auto pt-2">{step.clip}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
