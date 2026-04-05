/**
 * Landing Page (Index)
 *
 * Entry point for unauthenticated visitors. Composed of lazy-loaded
 * sections to keep the initial bundle small and the first paint fast.
 *
 * Section load order:
 *   Navbar & Hero (eager) → Stats → Templates → Features → How It Works
 *   → Testimonials → FAQ → CTA → Footer (all lazy)
 */

import { lazy, Suspense } from "react";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";

/* Lazy-load every section below the fold for faster initial render */
const StatsSection = lazy(() => import("@/components/landing/StatsSection"));
const TemplatesShowcase = lazy(() => import("@/components/landing/TemplatesShowcase"));
const FeaturesSection = lazy(() => import("@/components/landing/FeaturesSection"));
const HowItWorksSection = lazy(() => import("@/components/landing/HowItWorksSection"));
const TestimonialsSection = lazy(() => import("@/components/landing/TestimonialsSection"));
const FAQSection = lazy(() => import("@/components/landing/FAQSection"));
const CTASection = lazy(() => import("@/components/landing/CTASection"));
const Footer = lazy(() => import("@/components/landing/Footer"));

/** Spinner shown while a lazy section is loading */
const SectionFallback = () => (
  <div className="py-24 flex items-center justify-center">
    <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />

      {/* Each section is wrapped in its own Suspense boundary so
          they can load independently without blocking one another. */}
      <Suspense fallback={<SectionFallback />}>
        <StatsSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <TemplatesShowcase />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <FeaturesSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <HowItWorksSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <TestimonialsSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <FAQSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <CTASection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
