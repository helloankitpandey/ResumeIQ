import { Star, Users, Briefcase, TrendingUp } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

const stats = [
  { value: "50K+", label: "Resumes Created", icon: Users },
  { value: "92%", label: "Interview Rate", icon: TrendingUp },
  { value: "500+", label: "Companies Hiring", icon: Briefcase },
  { value: "4.9", label: "User Rating", icon: Star, isStar: true }
];

const StatsSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="py-16 px-6 border-y border-border/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/[0.02]" />
      
      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              className={cn(
                "text-center transition-all duration-700 ease-out",
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground">
                  {stat.value}
                </span>
                {stat.isStar && (
                  <Star className="h-6 w-6 fill-primary text-primary" />
                )}
              </div>
              <div className="flex items-center justify-center gap-2">
                <stat.icon className="h-4 w-4 text-primary" />
                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
