"use client";
import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Building2,
  Users,
  QrCode,
  LayoutGrid,
  ShieldCheck,
  Play,
  Video,
  RotateCcw,
  Lock,
  EyeOff,
  Radio,
  AlertTriangle,
} from "lucide-react";

export default function HowItWorksPage() {
  // Simulator State variables for tracking UI micro-interactions
  const [simStamps, setSimStamps] = useState(2);
  const [isRedeemed, setIsRedeemed] = useState(false);
  const [lastStampedIdx, setLastStampedIdx] = useState<number | null>(null);

  // Anti-fraud live inspection console log simulation state
  const [activeSecurityLog, setActiveSecurityLog] = useState([
    "// Anti-Fraud Network Monitoring Active...",
    "POS Sync Status: Connected [Node Pune-04]",
  ]);

  const handleSimStamp = () => {
    if (simStamps < 5) {
      const nextIdx = simStamps;
      setSimStamps((prev) => prev + 1);
      setLastStampedIdx(nextIdx);

      // Append live pseudo cryptography logs into our simulated terminal box
      const mockInvoice = `INV-${Math.floor(10000 + Math.random() * 90000)}`;
      setActiveSecurityLog((prev) => [
        `-> Verified unique sequence: ${mockInvoice}`,
        `[PASS] Cryptographic verification complete. Stamp token #${nextIdx + 1} pushed.`,
        ...prev.slice(0, 2),
      ]);

      setTimeout(() => setLastStampedIdx(null), 400);
    } else {
      setIsRedeemed(true);
      setActiveSecurityLog((prev) => [
        `🚨 WARNING: Card threshold limit maxed out. Transitioning to static reward coupon state.`,
        ...prev,
      ]);
    }
  };

  const resetSimulator = () => {
    setSimStamps(0);
    setIsRedeemed(false);
    setLastStampedIdx(null);
    setActiveSecurityLog([
      "// Terminal reset command handled successfully.",
      "POS Sync Status: Connected [Node Pune-04]",
    ]);
  };

  return (
    <div className="min-h-screen bg-[#0F0C0A] text-stone-100 flex flex-col justify-between overflow-hidden bg-grain">
      <Navbar />

      {/* Decorative Radiant Warm Lighting Blooms */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[300px] bg-amber-500/[0.01] blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-2/3 right-1/4 w-[500px] h-[250px] bg-orange-500/[0.01] blur-[120px] rounded-full pointer-events-none" />

      <main className="max-w-6xl mx-auto py-20 px-6 relative z-10 w-full flex-1">
        {/* PAGE HEADER ROW */}
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-bold uppercase tracking-wider">
            <LayoutGrid className="size-3.5" /> Platform Motion Blueprint
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            One scan. No app stores. <br />
            <span className="text-amber-400">Zero point-of-sale lag.</span>
          </h1>
          <p className="text-stone-400 text-sm sm:text-base leading-relaxed">
            From sticking up your custom countertop QR code block to validating
            single-use cash register invoice numbers, here is exactly how your
            shop floor transforms.
          </p>
        </div>

        {/* NEW SECTION: HD WALKTHROUGH VIDEO CLIPS BLOCK */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {/* CLIP 1: MERCHANT INTERFACE PREVIEW */}
          <div className="bg-[#14100E] border border-stone-900 rounded-3xl p-5 space-y-4 relative group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-200">
                <Video className="size-3.5 text-amber-400" />
                <span>Clip: Setting Up the Counter Dashboard</span>
              </div>
              <span className="text-[10px] font-mono text-stone-600 uppercase">
                0:45 min walkthrough
              </span>
            </div>

            {/* Visual Media Placeholder Box - Replace 'src' with your actual mp4 production assets */}
            <div className="aspect-video bg-stone-950/80 rounded-2xl border border-stone-900 flex items-center justify-center relative overflow-hidden group-hover:border-stone-800 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-60 z-10" />

              {/* Simulated UI Snapshot to act as thumbnail */}
              <div className="absolute inset-4 border border-stone-900/40 rounded-xl opacity-20 flex flex-col justify-between p-3 font-mono text-[8px] text-stone-500">
                <div className="flex justify-between">
                  <span>[Merchant Desk]</span>
                  <span>System Node: OK</span>
                </div>
                <div className="h-1 w-2/3 bg-stone-800 rounded" />
                <div className="h-1 w-1/2 bg-stone-800 rounded" />
              </div>

              <button className="size-12 rounded-full bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400 hover:bg-amber-500 hover:text-stone-950 hover:scale-105 transition-all duration-300 z-20 shadow-xl group-hover:border-amber-400">
                <Play className="size-5 fill-current ml-0.5" />
              </button>
            </div>
            <p className="text-xs text-stone-500 font-medium">
              See how a physical store owner logs into the administrative web
              desk, assigns their loyalty milestone values, and exports
              high-quality print files.
            </p>
          </div>

          {/* CLIP 2: RETAIL REGULAR INTERFACE PREVIEW */}
          <div className="bg-[#14100E] border border-stone-900 rounded-3xl p-5 space-y-4 relative group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-200">
                <Video className="size-3.5 text-orange-400" />
                <span>Clip: Customer Countertop Scan-Loop</span>
              </div>
              <span className="text-[10px] font-mono text-stone-600 uppercase">
                1:10 min walkthrough
              </span>
            </div>

            {/* Visual Media Placeholder Box with Scanner Laser Animation Layer */}
            <div className="aspect-video bg-stone-950/80 rounded-2xl border border-stone-900 flex items-center justify-center relative overflow-hidden group-hover:border-stone-800 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-60 z-10" />

              {/* Scanning Line Animation Vector */}
              <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-40 animate-laser z-20" />

              <div className="absolute size-20 border border-orange-500/10 rounded-xl flex items-center justify-center opacity-30">
                <QrCode className="size-10 text-stone-500" />
              </div>

              <button className="size-12 rounded-full bg-orange-500/10 border border-orange-400/30 flex items-center justify-center text-orange-400 hover:bg-orange-500 hover:text-stone-950 hover:scale-105 transition-all duration-300 z-20 shadow-xl group-hover:border-orange-400">
                <Play className="size-5 fill-current ml-0.5" />
              </button>
            </div>
            <p className="text-xs text-stone-500 font-medium">
              Watch a real camera interact with the tabletop code plaque,
              register a secure PWA bookmark hook, and enter an active register
              receipt number sequence.
            </p>
          </div>
        </div>

        {/* SECTION 3: THE DUAL-PERSONA BLUEPRINT ARCHITECTURE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-24">
          {/* LEFT COLUMN: THE BUSINESS SIDE PANEL */}
          <div className="space-y-8 bg-stone-900/10 border border-stone-900/60 p-6 sm:p-8 rounded-3xl backdrop-blur-sm">
            <div className="flex items-center gap-3 pb-4 border-b border-stone-900">
              <div className="size-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-inner">
                <Building2 className="size-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white tracking-tight">
                  For Local Businesses
                </h2>
                <p className="text-[11px] font-mono text-stone-500 uppercase tracking-wider">
                  Merchant Portal Setup Loop
                </p>
              </div>
            </div>

            {/* Merchant Deep Steps */}
            <div className="space-y-6">
              {[
                {
                  title: "Establish Brand Parameters",
                  body: "Log into the admin dashboard via any desktop browser or smartphone interface. Upload your high-res logo asset, map your location coordinates, and define your color themes to dynamically generate your customized native mobile stamp pass view.",
                },
                {
                  title: "Tailor Your Retention Economics",
                  body: "Calibrate your reward milestones logic (e.g., Settle 8 payments, collect a free item on index 9). Write descriptive, clear reward text triggers directly onto the block canvas so your consumers see precisely what target they are tracking towards.",
                },
                {
                  title: "Deploy Countertop Artworks",
                  body: "Download your custom-generated vector QR layout sheet from the system assets deck. Print this asset card and slip it into an acrylic frame placed right next to your terminal register or food pick-up bar shelf.",
                },
                {
                  title: "Audit Fraud Logs & Analytics",
                  body: "Watch real-world transactional density indicators form directly on your display. Monitor lifetime customer distributions, check tracking metrics, and trace specific receipt hashes to eliminate employee card manipulation or phantom stamps.",
                },
              ].map((step, idx) => (
                <div key={idx} className="flex gap-4 group">
                  <div className="text-xs font-mono font-black text-stone-600 bg-stone-950 border border-stone-900 size-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 group-hover:text-amber-400 group-hover:border-amber-500/30 transition-colors">
                    0{idx + 1}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-200 mb-1">
                      {step.title}
                    </h3>
                    <p className="text-xs text-stone-400 leading-relaxed font-medium">
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: THE CUSTOMER SIDE PANEL */}
          <div className="space-y-8 bg-stone-900/10 border border-stone-900/60 p-6 sm:p-8 rounded-3xl backdrop-blur-sm">
            <div className="flex items-center gap-3 pb-4 border-b border-stone-900">
              <div className="size-10 rounded-xl bg-orange-500/10 border border-amber-500/20 flex items-center justify-center text-orange-400 shadow-inner">
                <Users className="size-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white tracking-tight">
                  For Your Regulars
                </h2>
                <p className="text-[11px] font-mono text-stone-500 uppercase tracking-wider">
                  Frictionless Countertop Journey
                </p>
              </div>
            </div>

            {/* Customer Deep Steps */}
            <div className="space-y-6">
              {[
                {
                  title: "Scan Countertop QR Code",
                  body: "At checkout, your customer opens their native iOS or Android camera app and points it directly at the acrylic countertop QR plate. There is absolutely no app store loading barrier or slow download delay.",
                },
                {
                  title: "Initialize the Mobile PWA Card",
                  body: "The link fires open a progressive web card natively within their mobile browser. With one click, regulars can tap 'Add to Home Screen' to hook your brand icon directly into their app dock layer for high-speed offline recall.",
                },
                {
                  title: "Log the Invoice Receipt Sequence",
                  body: "To append an active loyalty credit stamp, the buyer types in the short, unique receipt number sequence printed on their transaction voucher slip directly into their mobile web card view interface.",
                },
                {
                  title: "Claim Free Milestone Rewards",
                  body: "Once the target stamp slot threshold is cleared, the digital web interface shifts into a bright, secure visual coupon token. The regular holds this up to your barista, who taps redeem to hand over the free house item.",
                },
              ].map((step, idx) => (
                <div key={idx} className="flex gap-4 group">
                  <div className="text-xs font-mono font-black text-stone-600 bg-stone-950 border border-stone-900 size-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 group-hover:text-orange-400 group-hover:border-orange-500/30 transition-colors">
                    0{idx + 1}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-200 mb-1">
                      {step.title}
                    </h3>
                    <p className="text-xs text-stone-400 leading-relaxed font-medium">
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECURITY ALERT CALLOUT BANNER */}
        <div className="bg-[#14100E] border border-stone-900 rounded-2xl p-5 mb-24 flex flex-col sm:flex-row items-start gap-4">
          <div className="size-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="size-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-stone-200 mb-0.5">
              The Single-Use Invoice Security Matrix
            </h4>
            <p className="text-xs text-stone-500 leading-relaxed font-medium">
              Regulars Club does not use unsecure, easily copied static stamp
              links. Because every stamp verification transaction forces
              verification matching against a specific invoice hash token logged
              by the store register, users cannot fabricate points from home,
              protecting your margins.
            </p>
          </div>
        </div>

        {/* SECTION 4: INTERACTIVE LIVE COUNTER HAPTIC SIMULATION WIDGET */}
        <div className="border-t border-stone-900/60 pt-16 mb-16" id="security">
          <div className="max-w-xl mx-auto text-center mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Try the haptic counter simulator
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-medium">
              Click the button block below to simulate appending a transactional
              verification stamp on a customer&apos;s browser pass interface with
              live spring animation feedback loops.
            </p>
          </div>

          {/* SIMULATOR CONTAINER BLOCK */}
          <div className="max-w-md mx-auto bg-stone-900/30 border border-stone-900 rounded-3xl p-6 shadow-2xl space-y-6">
            {/* Embedded Mini Mobile View Screen Mockup */}
            <div className="bg-[#0B0806] border border-stone-950 rounded-2xl p-5 relative overflow-hidden text-center space-y-4">
              <div className="absolute top-2 left-3 text-[8px] font-mono text-stone-600 uppercase tracking-wider">
                Regulars Web-App Viewer
              </div>

              {/* Card Title Content */}
              <div className="pt-2">
                <div className="text-xs font-bold text-stone-200">
                  The Local Espresso Lab
                </div>
                <div className="text-[9px] text-stone-500">Pune, IN</div>
              </div>

              {/* Dynamic Stamps Progress Tracker Dots Matrix with Reactive CSS Class Flags */}
              {!isRedeemed ? (
                <div className="flex justify-center gap-2 py-2">
                  {[...Array(5)].map((_, idx) => {
                    const isPassed = idx < simStamps;
                    const isJustStamped = idx === lastStampedIdx;
                    return (
                      <div
                        key={idx}
                        className={`size-8 rounded-xl border flex items-center justify-center font-mono text-xs font-black transition-all duration-200 ${
                          isJustStamped ? "animate-stamp" : ""
                        } ${
                          isPassed
                            ? "bg-amber-500 border-amber-400 text-stone-950 scale-105 shadow-md shadow-amber-500/10"
                            : "bg-stone-900/50 border-stone-800 text-stone-600"
                        }`}
                      >
                        {isPassed ? "✓" : idx + 1}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-emerald-950/20 border border-emerald-900/30 p-3 rounded-xl transition-all duration-300">
                  <div className="text-xs font-bold text-emerald-400 animate-pulse">
                    🔥 Reward Level Cleared!
                  </div>
                  <p className="text-[10px] text-stone-400 mt-0.5">
                    Show this dashboard to the server to claim your free brew.
                  </p>
                </div>
              )}

              {/* Live Count Counter Readout Label */}
              <div className="text-[10px] font-mono text-stone-400">
                {!isRedeemed
                  ? `Card Progress Log: ${simStamps} / 5 Tokens Collected`
                  : "Status: Ready for Counter Redemption"}
              </div>
            </div>

            {/* ACTION TRIGGERS DOCK */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleSimStamp}
                disabled={isRedeemed}
                className="bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-stone-950 font-black text-xs rounded-xl py-3 flex items-center justify-center gap-1.5 transition-all shadow-md active:translate-y-0.5"
              >
                <Play className="size-3 fill-current" />
                <span>Simulate Stamp</span>
              </button>

              <button
                onClick={resetSimulator}
                className="bg-stone-900 border border-stone-800 hover:text-stone-200 text-stone-400 font-bold text-xs rounded-xl py-3 flex items-center justify-center gap-1.5 transition-all"
              >
                <RotateCcw className="size-3" />
                <span>Reset Canvas</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[#130F0D] border border-stone-900 rounded-3xl p-6 sm:p-8 mb-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/[0.01] blur-[80px] rounded-full pointer-events-none" />

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Explanatory Core Pillars */}
            <div className="md:w-1/2 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-wider">
                <ShieldCheck className="size-3.5" /> Hardened Margin Defense
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                Eliminating paper punch exploits <br />
                <span className="text-amber-400">
                  and rogue device generation.
                </span>
              </h2>

              <p className="text-xs text-stone-400 leading-relaxed font-medium">
                Traditional paper punch systems suffer from massive merchant
                loss leakage: staff handing multiple points to friends, or
                customers cloning physical custom-made stamp patterns. Regulars
                Club stops this with a triple-layer backend architecture.
              </p>

              {/* Three Specific Security Pillars */}
              <div className="space-y-4 pt-2">
                <div className="flex gap-3">
                  <div className="size-7 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 shrink-0 mt-0.5">
                    <Lock className="size-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-200">
                      Single-Use Receipt Matching
                    </h4>
                    <p className="text-[11px] text-stone-500 leading-normal mt-0.5">
                      Once an individual billing sequence string is registered,
                      it instantly burns inside our central database cluster. It
                      can never be used again across any device profile.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="size-7 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 shrink-0 mt-0.5">
                    <EyeOff className="size-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-200">
                      Anti-GPS Geo-Fencing Constraints
                    </h4>
                    <p className="text-[11px] text-stone-500 leading-normal mt-0.5">
                      Ensures customer requests execute cleanly inside your
                      restaurant&apos;s spatial radius coordinates. Prevents users
                      from sharing checkout code strings over internet groups to
                      claim points remotely.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="size-7 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 shrink-0 mt-0.5">
                    <Radio className="size-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-200">
                      Velocity Burn Threshold Limits
                    </h4>
                    <p className="text-[11px] text-stone-500 leading-normal mt-0.5">
                      Locks transactional submissions if an active card tries to
                      log points multiple times within a 15-minute checkout
                      sequence, neutralizing bulk-entry macros.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* LIVE INSPECTION DECK WIDGET */}
            <div className="md:w-1/2 w-full bg-[#0B0806] border border-stone-950 rounded-2xl p-4 sm:p-5 font-mono space-y-4">
              <div className="flex items-center justify-between border-b border-stone-900 pb-3">
                <div className="text-[10px] text-stone-400 flex items-center gap-1.5 font-sans font-bold">
                  <AlertTriangle className="size-3.5 text-amber-500 animate-pulse" />
                  <span>Real-time POS Cryptography Stream</span>
                </div>
                <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-900/30 px-2 py-0.5 rounded">
                  Active
                </span>
              </div>

              {/* Dynamic Console Rows Layout */}
              <div className="space-y-2 min-h-[100px] text-[10px] leading-relaxed text-stone-500">
                {activeSecurityLog.map((log, i) => (
                  <div
                    key={i}
                    className={`transition-all duration-300 ${
                      i === 0
                        ? "text-stone-300 font-bold"
                        : log.includes("PASS")
                          ? "text-emerald-500"
                          : "text-stone-600"
                    }`}
                  >
                    {log}
                  </div>
                ))}
              </div>

              <div className="text-[9px] text-stone-600 font-sans leading-normal bg-stone-900/20 p-3 rounded-lg border border-stone-900/40">
                <strong>Operator Analytics:</strong> Every submission registers
                browser canvas prints, request hashes, and receipt stamps.
                Suspicious anomalies trigger merchant warning notifications
                immediately.
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
