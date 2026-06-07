"use client";
import React, { useState, useEffect } from "react";
import {
  HelpCircle,
  Coffee,
  ArrowRight,
  MessageSquare,
  HelpCircleIcon,
  CheckCircle2,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Faq() {
  // Live help desk chat clip loops
  const [chatCycle, setChatCycle] = useState(0);
  const conversations = [
    {
      q: "Do customers need an app?",
      a: "No app storefront friction! Just scan the QR code to open a browser card.",
    },
    {
      q: "How are stamps secure?",
      a: "Invoice-level matching ensures every stamp locks to a verified order bill number.",
    },
    {
      q: "What's the pricing?",
      a: "Plans start transparently at just ₹999/year. 3-day full access pass included.",
    },
  ];

  useEffect(() => {
    const chatTimer = setInterval(() => {
      setChatCycle((prev) => (prev + 1) % conversations.length);
    }, 4500);
    return () => clearInterval(chatTimer);
  }, []);

  const faqs = [
    {
      question: "What exactly is Regulars Club?",
      answer:
        "Regulars Club is a modern digital loyalty matrix built to help small business owners boost customer return velocity using browser-native stamp cards. Customers scan your custom counter code on checkout and earn rewards — zero App Store installs or storage needed.",
    },
    {
      question: "How does the onboarding look for my storefront?",
      answer:
        "Sign up in 60 seconds, type in your brand logo info, define your rewards milestone target (e.g., Buy 8 teas, get the 9th free), and display your custom QR layout. Customers scan it with their phone camera on each checkout visit to collect stamps. You track live metrics straight from your merchant dashboard.",
    },
    {
      question: "What are the core pricing plans?",
      answer:
        "We keep it crystal clear with zero transaction takes. Choose between three straightforward yearly packages: Basic (₹999/yr, 1 branch), Growth (₹2499/yr, up to 3 locations with active background GPS geofence recognition), and Pro (₹4499/yr, up to 6 locations). Every single setup includes an instant 3-day test trial with no advance deposits required.",
    },
    {
      question: "Can I manage a single QR across separate multi-branches?",
      answer:
        "Absolutely. If you run our Growth or Pro tier systems, you can print out the exact same visual QR template sheet for every location. The customer's native phone browser automatically confirms the correct outlet storefront coordinates behind the scenes via lightweight GPS location matching.",
    },
    {
      question: "Is it completely free for our customers?",
      answer:
        "Yes, 100%. Regulars Club costs your regulars nothing. They simply point their phone camera at your acrylic block stand and stack loyalty points instantly. No membership payments, no hidden fees, no onboarding blocks.",
    },
    {
      question: "What types of industries fit best?",
      answer:
        "If you depend on repeat storefront traffic, this is built for you. We actively secure retention loops for premium cafés, bakery counters, food trucks, hair salons, health gyms, auto details, boutique spas, and corner shops.",
    },
    {
      question: "Are there any hidden transaction processing costs?",
      answer:
        "None at all. Your set subscription fee covers everything. No extra implementation setup tariffs, no hidden micro-fees on individual customer checkouts, and absolutely no premium surprise payouts.",
    },
    {
      question: "How secure is the anti-fraud card validation?",
      answer:
        "We lock your profits down tightly via single-use invoice-number referencing. To issue a digital loyalty stamp, the registration terminal expects a unique receipt sequence matching your register records, completely blocking duplicate user loops or employee card stuffing.",
    },
  ];

  return (
    <section className="py-24 px-6  text-stone-100 relative overflow-hidden bg-grain" id="faq">
      {/* Warm Ambient Underglow Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-amber-500/[0.02] blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Layout Grid Separating FAQ Headers from Content Blocks */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* LEFT INTERACTIVE COLUMN: Sticky Callouts and Live Chat Ticker Clip */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-bold uppercase tracking-wider mb-4">
                <HelpCircle className="size-3.5" />
                <span>Got Questions? We Have Answers</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-4 leading-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-stone-400 text-xs sm:text-sm max-w-sm leading-relaxed mb-6">
                Everything you need to know about setting up rewards thresholds,
                geofenced branches, and fraud controls.
              </p>

              {/* Premium Direct Line Badge */}
              <a
                href="tel:7517990047"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-stone-900/40 border border-stone-800 hover:border-amber-500/30 text-xs text-stone-300 font-mono transition-all group"
              >
                <span>Direct Support Line:</span>
                <span className="text-amber-400 font-bold group-hover:underline">
                  7517990047
                </span>
                <ArrowRight className="size-3 text-stone-600 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>

            {/* LIVE DESK INTERACTIVE CLIP: Live Ticker Simulator */}
            <div className="bg-[#110E0C] border border-stone-950 p-4 rounded-3xl relative overflow-hidden flex flex-col justify-between min-h-[140px] max-w-sm shadow-inner">
              <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wider text-stone-600 mb-3">
                <span className="flex items-center gap-1">
                  <MessageSquare className="size-2.5 text-amber-500" />{" "}
                  Interactive Desk Preview
                </span>
                <span className="text-emerald-500 flex items-center gap-0.5">
                  <span className="size-1 bg-emerald-500 rounded-full animate-ping" />{" "}
                  Online
                </span>
              </div>

              <div
                className="space-y-2.5 transition-all duration-500 animate-fade-in"
                key={chatCycle}
              >
                <div className="bg-stone-900 border border-stone-800 rounded-xl p-2.5 max-w-[85%] text-[11px] text-stone-200 ml-0 mr-auto font-medium">
                  <span className="text-[9px] block text-stone-500 font-bold mb-0.5">
                    Merchant Question:
                  </span>
                  {conversations[chatCycle].q}
                </div>
                <div className="bg-amber-950/40 border border-amber-900/30 rounded-xl p-2.5 max-w-[85%] text-[11px] text-amber-300 ml-auto mr-0 font-medium">
                  <span className="text-[9px] block text-amber-500 font-bold mb-0.5 flex items-center gap-0.5">
                    <CheckCircle2 className="size-2.5 text-emerald-400" /> Core
                    Answer:
                  </span>
                  {conversations[chatCycle].a}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: The Refined Responsive Accordion Matrix */}
          <div className="lg:col-span-7 w-full">
            <Accordion className="w-full space-y-3">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index + 1}`}
                  className="bg-stone-900/20 border border-stone-900 rounded-2xl overflow-hidden transition-all duration-300 hover:border-stone-800/80 hover:bg-stone-900/30"
                >
                  <AccordionTrigger className="px-5 py-4 text-left text-sm sm:text-base font-bold text-stone-200 hover:text-amber-400 focus:text-amber-400 hover:no-underline transition-colors group">
                    <span className="pr-4 tracking-tight">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-5 text-xs sm:text-sm text-stone-400 leading-relaxed font-medium border-t border-stone-950/40 pt-3">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
