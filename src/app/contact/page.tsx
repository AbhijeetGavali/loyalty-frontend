"use client";
import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Mail,
  Clock,
  MessageSquare,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  Building2,
  Smartphone,
} from "lucide-react";

export default function ContactPage() {
  // Live operations status simulation state
  const [activeSupportQueue, setActiveSupportQueue] = useState({
    load: "Optimal",
    waitTime: "12 mins",
  });

  useEffect(() => {
    const queueTicker = setInterval(() => {
      const waitTimes = ["9 mins", "12 mins", "14 mins", "8 mins"];
      const randomWait =
        waitTimes[Math.floor(Math.random() * waitTimes.length)];
      setActiveSupportQueue({
        load: "Optimal",
        waitTime: randomWait,
      });
    }, 6000);

    return () => clearInterval(queueTicker);
  }, []);

  return (
    <div className="min-h-screen bg-[#0F0C0A] text-stone-100 flex flex-col justify-between overflow-hidden bg-grain">
      <Navbar />

      {/* Radiant Background Ambient Lighting Blooms */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-amber-500/[0.02] blur-[130px] rounded-full pointer-events-none" />

      <main className="max-w-6xl mx-auto py-20 px-6 relative z-10 w-full flex-1">
        {/* Main Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* LEFT COLUMN: Explicit Context & High-Detailed Copywriting */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-bold uppercase tracking-wider mb-4">
                <HelpCircle className="size-3.5" /> Merchant Help Desk
              </div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-6 leading-tight">
                Let’s get your counter <br />
                <span className="text-amber-400">set up for success.</span>
              </h1>
              <p className="text-stone-400 text-sm sm:text-base leading-relaxed max-w-xl">
                Whether you’re managing an independent coffee shop bar, a
                multi-location boutique salon chain, or configuring geofenced
                branches, our support engineers are standing by to keep your
                retention loops operating flawlessly.
              </p>
            </div>

            {/* Structured Channels Matrix */}
            <div className="space-y-4">
              {/* Core Email Support Channel */}
              <div className="bg-stone-900/20 border border-stone-900 p-5 rounded-2xl flex gap-4 group hover:border-stone-800 transition-colors">
                <div className="size-10 rounded-xl bg-amber-500/5 border border-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
                  <Mail className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-200 mb-1">
                    General & Account Infrastructure Support
                  </h3>
                  <p className="text-xs text-stone-400 leading-relaxed mb-2">
                    For terminal setup hitches, billing inquiries, plan shifts,
                    or custom QR graphics processing orders.
                  </p>
                  <a
                    href="mailto:support@ideasprout.in"
                    className="text-xs font-mono font-bold text-amber-400 hover:underline inline-flex items-center gap-1 group/link"
                  >
                    support@ideasprout.in
                    <ArrowRight className="size-3 text-amber-500/60 group-hover/link:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Operations & Partnership Channel */}
              <div className="bg-stone-900/20 border border-stone-900 p-5 rounded-2xl flex gap-4 group hover:border-stone-800 transition-colors">
                <div className="size-10 rounded-xl bg-amber-500/5 border border-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
                  <Building2 className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-200 mb-1">
                    Enterprise Sales & High-Volume Integrations
                  </h3>
                  <p className="text-xs text-stone-400 leading-relaxed mb-2">
                    Operating greater than 6 branches? Contact our solutions
                    wing to map localized POS custom integrations or white-label
                    loyalty systems.
                  </p>
                  <a
                    href="mailto:hello@ideasprout.in"
                    className="text-xs font-mono font-bold text-stone-300 hover:text-amber-400 hover:underline inline-flex items-center gap-1 group/link"
                  >
                    hello@ideasprout.in
                    <ArrowRight className="size-3 text-stone-500 group-hover/link:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Live Operations Monitor Clip & SLA Ledger */}
          <div className="lg:col-span-5 bg-stone-900/40 border border-stone-800/80 rounded-3xl p-6 space-y-6 relative group transition-all duration-300 hover:border-stone-700/60">
            {/* Header Status Label */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-4 flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-emerald-500" />{" "}
                Operational Service Status
              </h4>

              {/* Service Level Targets (SLA) Details Stack */}
              <div className="space-y-3">
                <div className="bg-[#110E0C] p-3.5 rounded-xl border border-stone-950 flex justify-between items-center">
                  <div>
                    <div className="text-xs font-bold text-stone-200">
                      Growth & Pro Priority Response
                    </div>
                    <div className="text-[10px] text-stone-500 mt-0.5 font-medium">
                      Guaranteed threshold reply window
                    </div>
                  </div>
                  <span className="text-xs font-black font-mono text-amber-400 bg-amber-950/40 border border-amber-900/30 px-2 py-0.5 rounded">
                    Under 2 Hours
                  </span>
                </div>

                <div className="bg-[#110E0C] p-3.5 rounded-xl border border-stone-950 flex justify-between items-center">
                  <div>
                    <div className="text-xs font-bold text-stone-200">
                      Standard Account Support
                    </div>
                    <div className="text-[10px] text-stone-500 mt-0.5 font-medium">
                      Basic tier email response cycle
                    </div>
                  </div>
                  <span className="text-xs font-black font-mono text-stone-400 bg-stone-900 border border-stone-800 px-2 py-0.5 rounded">
                    Same Business Day
                  </span>
                </div>

                <div className="bg-[#110E0C] p-3.5 rounded-xl border border-stone-950 flex justify-between items-center">
                  <div>
                    <div className="text-xs font-bold text-stone-200">
                      Anti-Fraud Escalation Check
                    </div>
                    <div className="text-[10px] text-stone-500 mt-0.5 font-medium">
                      Urgent exploit tracking triggers
                    </div>
                  </div>
                  <span className="text-xs font-black font-mono text-emerald-400 bg-emerald-950/20 border border-emerald-900/20 px-2 py-0.5 rounded">
                    Monitored 24/7
                  </span>
                </div>
              </div>
            </div>

            {/* LOWER LIVE TICKER CLIP: Active Support Channel Metrics */}
            <div className="bg-[#110E0C] border border-stone-950 rounded-2xl p-4 relative overflow-hidden">
              <div className="absolute top-2 right-3 flex items-center gap-1 text-[8px] font-bold uppercase tracking-wider text-stone-600">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-ping" />{" "}
                Live Status
              </div>

              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 shrink-0">
                  <Smartphone className="size-4 text-amber-500 animate-pulse" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-stone-500 uppercase tracking-wider">
                    Pune HQ Active Wait Time
                  </div>
                  <div className="text-sm font-black text-stone-200 mt-0.5 flex items-center gap-1.5">
                    <span>{activeSupportQueue.waitTime}</span>
                    <span className="text-xs font-normal text-stone-600">
                      •
                    </span>
                    <span className="text-xs font-bold text-emerald-400 font-sans tracking-tight">
                      Queue Status: {activeSupportQueue.load}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
