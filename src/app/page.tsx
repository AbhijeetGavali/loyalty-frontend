import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

// All High-Performance Layout Block Modules
import HeroSection from "@/components/HeroSection";
import ProblemAgitation from "@/components/ProblemAgitation";
import FeaturesBento from "@/components/FeaturesBento";
import BenefitsGrid from "@/components/BenefitsGrid";
import ProcessSteps from "@/components/ProcessSteps";
import TrustStats from "@/components/TrustStats";
import TestimonialSection from "@/components/TestimonialSection";
import PricingSection from "@/components/PricingSection";
import Faq from "@/components/Faq";
import CtaSection from "@/components/CtaSection";

export const metadata: Metadata = {
  title: "App-Free Digital Loyalty Cards | Regulars Club",
  description:
    "Launch your modern digital punch cards in 5 minutes. Perfect for local cafés, bakeries, and retail storefronts to securely retain customers.",
};

export default function HomePage() {
  return (
    // Implemented .bg-grain globally to wrap the components in a tactile texture layer
    <div className="min-h-screen dark:bg-zinc-950 selection:bg-amber-200 selection:text-amber-950 bg-grain antialiased transition-colors duration-200 bg-[#0F0C0A]">
      <Navbar />

      <main>
        <HeroSection />
        <ProblemAgitation />

        {/* We can inject standalone floaters dynamically between segments safely */}
        <FeaturesBento />
        <BenefitsGrid />
        <ProcessSteps />
        <TrustStats />
        <TestimonialSection />
        <PricingSection />
        <Faq />
        <CtaSection />
      </main>

      <Footer />
    </div>
  );
}
