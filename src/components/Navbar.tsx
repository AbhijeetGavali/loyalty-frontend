import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Coffee, ArrowRight } from "lucide-react";

export const Navbar = () => {
  return (
    <nav className="border-b border-stone-900/60 bg-[#0F0C0A] backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-6 py-3.5 flex justify-between items-center">
        {/* Brand Logo & Coffee House Badge */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="size-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:bg-amber-500/20 group-hover:scale-105 transition-all duration-300 shadow-inner">
            <Coffee className="size-4" />
          </div>
          <span className="text-lg font-black tracking-tight text-white transition-colors">
            Regulars<span className="text-amber-400 font-extrabold">Club</span>
          </span>
        </Link>

        {/* Action Controls Panel */}
        <div className="flex items-center gap-2">
          {/* Affiliate quick-links */}
          <Link href="/affiliate-program" className="hidden sm:block">
            <Button
              variant="ghost"
              className="font-bold text-xs text-stone-400 hover:text-amber-400 hover:bg-stone-900/40 rounded-xl px-3 transition-all"
            >
              Earn with Us
            </Button>
          </Link>

          {/* Merchant Portal Quick-link */}
          <Link href="/customer-login">
            <Button
              variant="ghost"
              className="font-bold text-xs sm:text-sm text-stone-400 hover:text-stone-100 hover:bg-stone-900/40 rounded-xl px-3 sm:px-4 transition-all"
            >
              Portal Login
            </Button>
          </Link>

          {/* Core Onboarding Button Trigger */}
          <Link href="/register-business?plan=BASIC">
            <Button className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs sm:text-sm rounded-xl px-4 sm:px-5 py-5 shadow-lg shadow-amber-500/5 hover:shadow-amber-500/10 hover:-translate-y-0.5 active:translate-y-0 border border-amber-400/20 transition-all duration-300 group">
              <span>Start Trial</span>
              <ArrowRight className="size-3.5 ml-1.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};
