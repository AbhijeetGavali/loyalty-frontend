import Link from "next/link";
import { ArrowRight, Coffee, Store, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingBean, StampRing, SteamWave } from "./CafeDecorations";
import { ProductMockupClip } from "./ProductMockupClip";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#FAF8F5] dark:bg-zinc-950 py-28 px-6 border-b border-slate-200/50 dark:border-zinc-900 bg-grain">
      {/* Floating Café Atmosphere Elements */}
      <FloatingBean className="top-16 left-[8%] rotate-12 scale-110" />
      <FloatingBean className="bottom-24 right-[10%] -rotate-45 scale-90" />
      <StampRing className="top-20 right-[5%] rotate-12" />
      <StampRing className="bottom-12 left-[3%]" />

      {/* Radial lighting backgrounds */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[3200px] h-[1200px] bg-green-500/[0.2] blur-[140px] rounded-full pointer-events-none -z-0" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1600px] h-[900px] bg-amber-500/[0.2] blur-[140px] rounded-full pointer-events-none -z-0" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-red-500/[0.2] blur-[120px] rounded-full pointer-events-none -z-0" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-red-500/[0.3] blur-[120px] rounded-full pointer-events-none -z-0" />
      <div className="flex items-center relative z-10 max-w-5xl mx-auto flex-col md:flex-row gap-12 lg:gap-20">
        <div className="relative  text-center flex flex-col items-center z-10">
          {/* Steaming Playful Badge Container */}
          <div className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-900/5 dark:bg-amber-400/10 border border-amber-900/10 dark:border-amber-400/20 text-amber-900 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider mb-8 backdrop-blur-sm transition-transform duration-300 hover:scale-105">
            <SteamWave className="top-[-30px] left-[18px]" />
            <SteamWave className="top-[-30px] left-[9px]" />
            <SteamWave className="top-[-30px] left-[0px]" />
            <Coffee className="size-4 text-amber-800 dark:text-amber-400 animate-bounce" />
            <span>No Apps. Just Fresh loyalty rewards.</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-slate-900 dark:text-zinc-50 mb-6 max-w-4xl leading-[1.1]">
            Turn first-time sippers into <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-amber-800 via-amber-600 to-indigo-600 bg-clip-text text-transparent font-black relative">
              lifetime regulars.
            </span>
          </h1>

          {/* Body Text */}
          <p className="text-lg md:text-xl text-slate-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Ditch those crinkly, easily lost paper punch cards. Regulars Club
            helps local cafés, bakeshops, and neighborhood spots launch digital
            stamp cards that open instantly in your customer&apos;s browser. Safe for
            margins, sweet for retention.
          </p>

          {/* Call To Action Buttons */}
          <div className="flex flex-col items-center gap-4 w-full sm:w-auto mb-16">
            <Link
              href="/register-business?plan=BASIC"
              className="w-full sm:w-auto"
            >
              <Button
                size="lg"
                className="w-full sm:w-auto px-8 py-7 rounded-2xl bg-amber-900 text-white hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-500 font-bold text-lg shadow-xl shadow-amber-900/10 dark:shadow-amber-600/10 transition-all duration-300 hover:-translate-y-1 active:translate-y-0 group"
              >
                Claim Your Free 3-Day Trial
                <ArrowRight className="ml-2 size-5 transition-transform duration-300 group-hover:translate-x-1.5" />
              </Button>
            </Link>
            <p className="text-xs text-slate-400 dark:text-zinc-500 font-medium tracking-wide">
              ☕ Set up takes 5 minutes flat • No credit card required
            </p>
          </div>

          {/* Feature Strips with Enhanced Icon Boxes */}
          <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-slate-200/60 dark:border-zinc-800/80">
            <div className="flex items-center justify-center gap-3 text-slate-600 dark:text-zinc-400 group">
              <div className="size-9 rounded-xl bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center text-amber-800 dark:text-amber-400 shrink-0 transition-transform duration-300 group-hover:rotate-12">
                <Coffee className="size-4" />
              </div>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-left">
                Built for Fast-Paced Cafes
              </span>
            </div>

            <div className="flex items-center justify-center gap-3 text-slate-600 dark:text-zinc-400 group">
              <div className="size-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 transition-transform duration-300 group-hover:scale-110">
                <ShieldCheck className="size-4" />
              </div>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-left">
                Anti-Fraud Stamp Checks
              </span>
            </div>

            <div className="flex items-center justify-center gap-3 text-slate-600 dark:text-zinc-400 group">
              <div className="size-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 transition-transform duration-300 group-hover:-translate-y-1">
                <Store className="size-4" />
              </div>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-left">
                Instant Mobile PWA Launch
              </span>
            </div>
          </div>
        </div>

        <div className=" flex flex-col items-center select-none pointer-events-none group">
          {/* Perspective Wrapper for the Phone */}
          <div className="relative z-10 transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:rotate-1">
            <ProductMockupClip />
          </div>

          {/* Premium Minimal Stand Base (Resting right underneath the device) */}
          <div className="relative z-0 -mt-5 flex flex-col items-center">
            {/* The Stand Neck Bracket */}
            <div
              className="w-10 h-12 bg-gradient-to-b from-slate-400 to-slate-500 dark:from-zinc-700 dark:to-zinc-800 clip-path-slant shadow-md"
              style={{
                clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
              }}
            />

            {/* The Solid Counter Base Pad */}
            <div className="w-32 h-3 bg-gradient-to-r from-slate-300 via-slate-400 to-slate-300 dark:from-zinc-600 dark:via-zinc-700 dark:to-zinc-600 rounded-full shadow-lg border-b border-slate-500/30" />
          </div>

          {/* Highly Realistic 3D Floor Shadow */}
          <div className="absolute -bottom-6 w-52 h-4 bg-slate-950/20 dark:bg-black/40 rounded-full blur-md mix-blend-multiply transition-all duration-500 ease-out group-hover:scale-x-90 group-hover:opacity-60" />
        </div>
      </div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1200px] h-[400px] bg-blue-500/[0.1] blur-[140px] rounded-full pointer-events-none -z-0" />
    </section>
  );
}
