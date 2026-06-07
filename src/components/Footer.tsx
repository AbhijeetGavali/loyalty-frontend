import React from "react";
import Link from "next/link";
import { Coffee, Mail, MapPin, Heart, ArrowUpRight } from "lucide-react";

export const Footer = () => {
  // Cohesive product matrices cleaning up legacy string relics
  const columnData = [
    {
      title: "Product",
      links: [
        { href: "/#features", label: "Core Features" },
        { href: "/#how", label: "How It Works" },
        { href: "/#pricing", label: "Pricing Structures" },
        { href: "/#faq", label: "Platform FAQs" },
      ],
    },
    {
      title: "For Vendors",
      links: [
        { href: "/login", label: "Merchant Portal" },
        { href: "/contact", label: "Contact Sales" },
        { href: "/demo#security", label: "Anti-Fraud System" },
        { href: "/demo", label: "Request Walkthrough" },
      ],
    },
    {
      title: "Legal & Trust",
      links: [
        { href: "/privacy", label: "Privacy Policy" },
        { href: "/terms", label: "Terms of Service" },
        { href: "/refund", label: "Refund Policy" },
        { href: "/data-deletion", label: "Data Deletion" },
        { href: "/about", label: "About Our Team" },
      ],
    },
  ];

  return (
    <footer className="bg-[#0B0806] text-stone-500 pt-20 pb-10 px-6 relative overflow-hidden bg-grain border-t border-stone-900">
      {/* Soft warm gold corner accent lighting bloom */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[250px] bg-amber-500/[0.01] blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Main Nav Links and Brand Description Grid Area */}
        <div className="grid grid-cols-2 md:grid-cols-10 gap-10 mb-16">
          {/* Main Brand Profile Column */}
          <div className="col-span-2 md:col-span-4 flex flex-col justify-between space-y-6">
            <div>
              {/* Brand Identity Wordmark */}
              <div className="flex items-center gap-2 mb-4 text-white group cursor-default">
                <div className="size-6 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:bg-amber-500/20 transition-colors">
                  <Coffee className="size-3.5" />
                </div>
                <span className="font-black tracking-tight text-base sm:text-lg">
                  Regulars<span className="text-amber-400">Club</span>
                </span>
              </div>

              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-sm">
                Empowering independent cafés and retail spots across India to
                build unbreakable retention loops through native digital stamp
                cards and secure dashboard analytics.
              </p>
            </div>

            {/* Entity Location Details & Live Pulse Anchor Point */}
            <div className="bg-[#110E0C] border border-stone-900/60 p-4 rounded-2xl max-w-xs space-y-2.5">
              <div className="text-xs font-bold text-stone-200 tracking-tight flex items-center gap-1.5">
                IdeaSprout Technologies
                <span className="flex h-2 w-2 relative ml-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>

              <div className="text-[11px] font-medium text-stone-500 space-y-1">
                <div className="flex items-center gap-1.5">
                  <MapPin className="size-3 text-stone-600 shrink-0" />
                  <span>Pune, Maharashtra, India</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="size-3 text-stone-600 shrink-0" />
                  <a
                    href="mailto:hello@ideasprout.in"
                    className="text-amber-500/90 hover:text-amber-400 underline decoration-amber-500/20 underline-offset-2 transition-colors font-mono"
                  >
                    hello@ideasprout.in
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Map iteration over category columns */}
          {columnData.map((col) => (
            <div key={col.title} className="col-span-1 md:col-span-2 space-y-4">
              <div className="text-white font-bold text-xs sm:text-sm tracking-wide uppercase">
                {col.title}
              </div>

              <ul className="space-y-2.5 text-xs sm:text-sm font-medium">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("/") ? (
                      <Link
                        href={link.href}
                        className="text-stone-400 hover:text-amber-400 transition-colors duration-200 flex items-center gap-0.5 group"
                      >
                        <span>{link.label}</span>
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-stone-400 hover:text-amber-400 transition-colors duration-200 inline-flex items-center gap-0.5 group"
                        target={
                          link.href.startsWith("http") ? "_blank" : undefined
                        }
                        rel={
                          link.href.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                      >
                        <span>{link.label}</span>
                        {link.href.startsWith("http") && (
                          <ArrowUpRight className="size-3 text-stone-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Lower Row: Copyright Statement & Attribution */}
        <div className="border-t border-stone-900/80 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] sm:text-xs text-stone-600 font-medium tracking-normal">
          <div className="text-center sm:text-left">
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span>{" "}
            Regulars Club by IdeaSprout Technologies. All rights reserved.
          </div>

          <div className="flex items-center gap-1 text-stone-500 bg-stone-900/30 px-3 py-1 rounded-full border border-stone-900">
            <span>Made with</span>
            <Heart className="size-3 text-red-500 fill-red-500 animate-pulse" />
            <span>in India</span>
            <span className="ml-1" role="img" aria-label="India Flag">
              🇮🇳
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
