import { Sparkles, FileText, Download, Zap, Shield, Users } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Content",
    description: "Generate professional bullet points and summaries optimized for ATS systems"
  },
  {
    icon: FileText,
    title: "Pro Templates",
    description: "11+ recruiter-approved templates including Jake's Resume, Google, Microsoft, and Harvard styles"
  },
  {
    icon: Download,
    title: "Instant Export",
    description: "Download polished, print-ready PDFs that look great on any device"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Create a complete resume in under 10 minutes with our intuitive builder"
  },
  {
    icon: Shield,
    title: "ATS Optimized",
    description: "Every template is tested against major ATS systems for maximum compatibility"
  },
  {
    icon: Users,
    title: "Expert Reviewed",
    description: "Templates designed with input from professional recruiters and HR managers"
  }
];

const FeaturesSection = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { ref: gridRef, isVisible: gridVisible } = useScrollReveal({ rootMargin: "0px 0px -40px 0px" });

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div
          ref={headerRef}
          className={cn(
            "text-center mb-16 transition-all duration-700 ease-out",
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 border border-primary/20">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
            Everything You Need to Get Hired
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional tools designed to help you create standout resumes
          </p>
        </div>

        <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <div 
              key={i}
              className={cn(
                "group p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 hover:bg-card transition-all duration-700 ease-out hover:-translate-y-1",
                gridVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
