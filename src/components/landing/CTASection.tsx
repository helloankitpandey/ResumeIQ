/**
 * CTA (Call-to-Action) Section
 *
 * Bottom-of-page motivational block encouraging visitors to start
 * building their resume. Features a glowing background and a
 * scroll-reveal animation.
 */

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

const CTASection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="py-24 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-primary/10" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/10" />
      
      {/* Glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/15 rounded-full blur-[100px]" />
      
      <div
        className={cn(
          "container mx-auto max-w-3xl text-center relative z-10 transition-all duration-700 ease-out",
          isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
        )}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
          <Sparkles className="h-4 w-4" />
          <span>Start for free today</span>
        </div>
        
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
          Ready to Land Your Dream Job?
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
          Join 50,000+ professionals who have created winning resumes with ResumeIQ.
        </p>
        
        <Link to="/builder" className="inline-block group">
          <Button 
            size="lg" 
            className="rounded-full px-10 h-14 font-semibold text-lg shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 group-hover:scale-105"
          >
            Create Your Resume Free
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
        
        <p className="mt-6 text-muted-foreground text-sm">
          No credit card required • Free forever plan available
        </p>
      </div>
    </section>
  );
};

export default CTASection;
