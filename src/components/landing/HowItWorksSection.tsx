/**
 * How It Works Section
 *
 * Three-step visual guide: Choose Template → Add Details → Download.
 * Steps animate into view using the useScrollReveal hook and are
 * connected by arrow indicators on desktop.
 */

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Edit3, Download } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

const steps = [
  { 
    step: "1", 
    icon: FileText,
    title: "Choose a Template", 
    desc: "Pick from our collection of ATS-friendly professional designs crafted by experts" 
  },
  { 
    step: "2", 
    icon: Edit3,
    title: "Add Your Details", 
    desc: "Fill in your information with AI-powered suggestions that highlight your strengths" 
  },
  { 
    step: "3", 
    icon: Download,
    title: "Download & Apply", 
    desc: "Export as a polished PDF and start applying to your dream jobs today" 
  }
];

const HowItWorksSection = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { ref: stepsRef, isVisible: stepsVisible } = useScrollReveal({ rootMargin: "0px 0px -40px 0px" });

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/[0.02]" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="container mx-auto max-w-5xl relative z-10">
        <div
          ref={headerRef}
          className={cn(
            "text-center mb-16 transition-all duration-700 ease-out",
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 border border-primary/20">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
            Create Your Resume in 3 Steps
          </h2>
          <p className="text-lg text-muted-foreground">
            Simple process, professional results
          </p>
        </div>

        <div ref={stepsRef} className="grid md:grid-cols-3 gap-8 mb-12">
          {steps.map((item, i) => (
            <div 
              key={i} 
              className={cn(
                "relative group transition-all duration-700 ease-out",
                stepsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="text-center">
                <div className="relative mx-auto mb-6">
                  <div className="h-20 w-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-primary flex items-center justify-center font-bold text-primary-foreground text-sm shadow-lg shadow-primary/30">
                    {item.step}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{item.desc}</p>
              </div>
              
              {i < 2 && (
                <div className="hidden md:block absolute top-10 -right-4 w-8">
                  <div className="w-full h-0.5 bg-gradient-to-r from-primary/50 to-primary/20" />
                  <ArrowRight className="absolute -right-2 -top-2 h-5 w-5 text-primary/50" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div
          className={cn(
            "text-center transition-all duration-700 ease-out delay-500",
            stepsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <Link to="/builder" className="inline-block group">
            <Button size="lg" className="rounded-full px-8 h-12 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 hover:scale-105 transition-all duration-300">
              Start Building Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
