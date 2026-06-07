import Link from "next/link";
import { Check, HelpCircle, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PricingSection() {
  const plans = [
    {
      name: "Basic",
      code: "BASIC",
      price: "499",
      originalPrice: "699",
      period: "/mo",
      description: "Everything a single-location shop needs to run a loyalty program from day one.",
      popular: false,
      features: [
        "1 store location",
        "Digital stamp cards via QR code",
        "Invoice-verified stamp approval",
        "Customer loyalty dashboard",
        "Counter display for in-store use",
        "Email support",
      ],
      cta: "Start 3-Day Free Trial",
    },
    {
      name: "Growth",
      code: "GROWTH",
      price: "999",
      originalPrice: "1,499",
      period: "/mo",
      description: "For businesses with multiple branches ready to scale their regulars program.",
      popular: true,
      features: [
        "Up to 3 store locations",
        "GPS-based branch auto-detection",
        "Staff accounts & role access",
        "Customer analytics & visit trends",
        "SMS marketing campaigns",
        "Priority support via WhatsApp",
      ],
      cta: "Start 3-Day Free Trial",
    },
    {
      name: "Pro",
      code: "PRO",
      price: "1,999",
      originalPrice: "2,999",
      period: "/mo",
      description: "Built for established brands running loyalty across multiple locations with a team.",
      popular: false,
      features: [
        "Up to 6 store locations",
        "Multi-manager team access",
        "ROI analytics & revenue insights",
        "Anti-fraud stamp protection",
        "Custom reward milestones",
        "Dedicated account manager",
      ],
      cta: "Start 3-Day Free Trial",
    },
  ];

  return (
    <section className="py-24 px-6  text-stone-100 relative overflow-hidden bg-grain" id="pricing">
      {/* Warm ambient background accents matching the brand */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-amber-500/[0.04] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Content */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Percent className="size-3.5" />
            <span>Special Foundation Pricing Active</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 bg-gradient-to-b from-white to-stone-300 bg-clip-text text-transparent">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-stone-400">
            No setup fees, no transaction cuts, no hidden surprises. All plans
            include a risk-free 3-day trial.
          </p>
        </div>

        {/* Pricing Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-300 group ${
                plan.popular
                  ? "border-amber-600 bg-amber-950/20 shadow-2xl shadow-amber-950/50 ring-1 ring-amber-500/30 md:scale-105 md:translate-y-[-8px]"
                  : "border-stone-800/80 bg-stone-900/40 hover:border-stone-700"
              }`}
            >
              {/* Special Limited Offer Sticker Tag */}
              <div className="absolute -top-3 left-6 bg-emerald-600 text-white text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-md shadow-sm">
                Save ~30%
              </div>

              {/* "Most Popular" Accent Badge */}
              {plan.popular && (
                <div className="absolute top-0 right-8 -translate-y-1/2 bg-amber-600 text-white text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                  Most Popular
                </div>
              )}

              {/* Card Meta details */}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-xs sm:text-sm text-stone-400 leading-relaxed min-h-[40px]">
                  {plan.description}
                </p>
              </div>

              {/* Enhanced Pricing Stack with Original Strikethrough Price */}
              <div className="flex flex-col mb-8 border-b border-stone-800/80 pb-6">
                <span className="text-xs font-bold uppercase tracking-wide text-stone-500 line-through mb-1">
                  Original: ₹{plan.originalPrice}
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-5xl font-black text-white tracking-tight">
                    ₹{plan.price}
                  </span>
                  <span className="text-stone-400 text-xs font-semibold uppercase tracking-wider">
                    {plan.period}
                  </span>
                </div>
              </div>

              {/* Dynamic Features List */}
              <ul className="text-stone-300 text-sm space-y-4 mb-8 flex-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check
                      className={`w-4 h-4 shrink-0 mt-0.5 ${plan.popular ? "text-amber-500" : "text-stone-500"}`}
                    />
                    <span className={idx === 0 ? "text-white font-semibold" : "text-stone-300"}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Primary Call to Action Button */}
              <Link href={`/register-business?plan=${plan.code}`} className="mt-auto block w-full">
                <Button
                  className={`w-full py-6.5 rounded-2xl font-bold text-sm transition-all duration-300 ${
                    plan.popular
                      ? "bg-amber-600 text-white hover:bg-amber-500 shadow-xl shadow-amber-600/10 hover:-translate-y-0.5 active:translate-y-0"
                      : "bg-stone-800 text-stone-200 hover:bg-stone-700"
                  }`}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Custom Footer Context Row */}
        <div className="mt-16 text-center border-t border-stone-800/60 pt-8">
          <p className="text-xs sm:text-sm text-stone-400">
            Have more than 6 locations?{" "}
            <Link
              href="/contact"
              className="text-amber-400 hover:underline font-bold inline-flex items-center gap-1 group"
            >
              Contact us for Enterprise custom rates{" "}
              <HelpCircle className="size-3.5 text-stone-500 group-hover:text-amber-400 transition-colors" />
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
