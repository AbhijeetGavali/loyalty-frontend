import { QrCode, ShieldCheck, BarChart3, MapPin, Sparkles } from "lucide-react";

export default function FeaturesBento() {
  return (
    <section
      className="py-24 px-6 dark:bg-[#0C0A09] bg-stone-50 relative overflow-hidden bg-grain transition-colors duration-500"
      id="features"
    >
      {/* Immersive background radial glow anchors */}
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-amber-500/[0.04] dark:bg-amber-500/[0.02] blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[600px] h-[600px] bg-orange-500/[0.04] dark:bg-orange-500/[0.02] blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 dark:border-amber-400/20 text-amber-800 dark:text-amber-400 text-xs font-bold uppercase tracking-wider animate-fade-in">
            <Sparkles className="size-3.5 text-amber-500 dark:text-amber-400 animate-pulse" />
            <span>Engineered for Brick-and-Mortar Hospitality</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-stone-900 dark:text-stone-100 leading-tight transition-colors">
            Built for modern storefronts, specialty cafés, and local brands
          </h2>
        </div>

        {/* Bento Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(280px,_auto)]">
          {/* Feature 1: Seamless QR */}
          <div className="md:col-span-2 relative overflow-hidden rounded-3xl p-8 lg:p-10 bg-gradient-to-br from-[#1E1713] via-[#140F0D] to-[#0A0807] text-white shadow-xl shadow-stone-950/20 flex flex-col justify-between group transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-amber-950/30 border border-stone-800/60 hover:border-amber-500/30">
            {/* Animated internal warmth overlay */}
            <div className="absolute -right-16 -bottom-16 size-80 bg-amber-500/[0.12] rounded-full blur-3xl pointer-events-none transition-all duration-500 group-hover:scale-110 group-hover:bg-amber-500/[0.18]" />

            <div>
              <div className="size-12 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center mb-8 transition-all duration-300 group-hover:scale-110 group-hover:bg-amber-500/10 group-hover:border-amber-500/40 shadow-inner">
                <QrCode className="w-5 h-5 text-amber-400 transition-transform duration-300 group-hover:rotate-3" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight mb-4 text-stone-50 transition-colors group-hover:text-amber-300">
                Frictionless App-Free Onboarding
              </h3>
              <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-xl transition-colors group-hover:text-stone-200">
                Remove the barrier to entry entirely. Customers simply scan your
                countertop&apos;s unique QR code to instantly launch their digital
                stamp card right inside their default browser. No App Store
                downloads, no forgotten passwords, and zero setup fatigue.
              </p>
            </div>
          </div>

          {/* Feature 2: Invoice-Verified Stamps */}
          <div className="rounded-3xl p-8 bg-white dark:bg-[#161210] border border-stone-200 dark:border-stone-800/80 shadow-md shadow-stone-200/40 dark:shadow-none flex flex-col justify-between group transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) hover:-translate-y-1.5 hover:shadow-xl hover:shadow-emerald-500/5 dark:hover:border-emerald-500/30">
            <div>
              <div className="size-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center mb-8 transition-all duration-500 group-hover:[transform:rotateY(180deg)] group-hover:bg-emerald-500/10 shadow-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-3 tracking-tight transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                Anti-Fraud Verification
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                Trust, but protect your margins. Our system enforces
                invoice-level authentication. Every single stamp request
                requires a unique receipt number verification, completely wiping
                out false employee claims and duplicate stamp leaks.
              </p>
            </div>
          </div>

          {/* Feature 3: Actionable Analytics */}
          <div className="rounded-3xl p-8 bg-white dark:bg-[#161210] border border-stone-200 dark:border-stone-800/80 shadow-md shadow-stone-200/40 dark:shadow-none flex flex-col justify-between group transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) hover:-translate-y-1.5 hover:shadow-xl hover:shadow-amber-500/5 dark:hover:border-amber-500/30">
            <div>
              <div className="size-12 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 flex items-center justify-center mb-8 transition-all duration-300 group-hover:scale-110 group-hover:bg-amber-500/10 shadow-sm">
                <BarChart3 className="w-5 h-5 text-amber-700 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-3 tracking-tight transition-colors group-hover:text-amber-700 dark:group-hover:text-amber-400">
                Retention Analytics
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                Go way beyond a blind list of phone numbers. Track real-time
                visitor frequencies, map active reward loops, analyze peak
                morning rush-hour return trends, and instantly discover exactly
                who your top 10% most profitable regulars are.
              </p>
            </div>
          </div>

          {/* Feature 4: GPS Tracking */}
          <div className="md:col-span-2 rounded-3xl p-8 bg-white dark:bg-[#161210] border border-stone-200 dark:border-stone-800/80 shadow-md shadow-stone-200/40 dark:shadow-none flex flex-col sm:flex-row sm:items-center justify-between gap-8 group transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) hover:-translate-y-1.5 hover:shadow-xl hover:shadow-orange-500/5 dark:hover:border-orange-500/30">
            <div className="max-w-xl">
              <div className="size-12 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/40 flex items-center justify-center mb-8 transition-all duration-300 group-hover:translate-x-1.5 group-hover:bg-orange-500/10 shadow-sm">
                <MapPin className="w-5 h-5 text-orange-700 dark:text-orange-400 animate-bounce-[duration:2s]" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-3 tracking-tight transition-colors group-hover:text-orange-600 dark:group-hover:text-orange-400">
                Multi-Branch GPS Fencing
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                Scale your rewards seamlessly as your brand grows across the
                city. If you run multiple cafes or roasteries, you can use a
                single universal QR code across all outlets. The system uses
                secure background GPS positioning to automatically register
                stamps to the correct shop location.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
