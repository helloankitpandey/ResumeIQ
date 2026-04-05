import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

const testimonials = [
  { 
    name: "Priya Sharma", 
    role: "Software Engineer at Google", 
    content: "The Google template was exactly what I needed. Got interviews at 3 FAANG companies within a week!",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    initials: "PS"
  },
  { 
    name: "Rahul Verma", 
    role: "Product Manager at Microsoft", 
    content: "As a tier-3 college student, this tool helped me present my projects professionally. Landed my dream job!",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    initials: "RV"
  },
  { 
    name: "Ananya Patel", 
    role: "Data Scientist at Amazon", 
    content: "The AI suggestions were spot-on! Got shortlisted in 8 out of 10 applications. Absolutely game-changing.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    initials: "AP"
  },
  { 
    name: "Vikram Singh", 
    role: "Frontend Developer at Meta", 
    content: "Finally a resume builder that understands what tech recruiters want. Clean, professional, and ATS-friendly.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    initials: "VS"
  },
  { 
    name: "Sneha Reddy", 
    role: "ML Engineer at OpenAI", 
    content: "The Harvard template gave my resume a professional edge. Highly recommend for anyone in tech!",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    initials: "SR"
  },
  { 
    name: "Arjun Nair", 
    role: "SDE at Adobe", 
    content: "Simple, fast, and the output looks incredibly professional. Got my offer in just 3 weeks of applying!",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
    initials: "AN"
  }
];

const TestimonialsSection = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { ref: gridRef, isVisible: gridVisible } = useScrollReveal({ rootMargin: "0px 0px -40px 0px" });

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div
          ref={headerRef}
          className={cn(
            "text-center mb-16 transition-all duration-700 ease-out",
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 border border-primary/20">
            Success Stories
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
            Trusted by Job Seekers
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands who landed their dream jobs
          </p>
        </div>

        <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div 
              key={i} 
              className={cn(
                "group p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 hover:bg-card transition-all duration-700 ease-out hover:-translate-y-1",
                gridVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-primary/80 text-primary/80" />
                ))}
              </div>
              
              {/* Content */}
              <p className="text-foreground/90 mb-6 leading-relaxed text-sm">"{t.content}"</p>
              
              {/* Author */}
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-primary/20">
                  <AvatarImage src={t.avatar} alt={t.name} loading="lazy" />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs">
                    {t.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
