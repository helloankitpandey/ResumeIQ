import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Crown, Star } from "lucide-react";
import { ResumeData, ResumeTemplate } from "@/types/resume";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/useScrollReveal";

// Import full template components
import JakesTemplate from "@/components/resume/templates/JakesTemplate";
import GoogleTemplate from "@/components/resume/templates/GoogleTemplate";
import MicrosoftTemplate from "@/components/resume/templates/MicrosoftTemplate";
import HarvardTemplate from "@/components/resume/templates/HarvardTemplate";
import ATSTemplate from "@/components/resume/templates/ATSTemplate";
import ModernTemplate from "@/components/resume/templates/ModernTemplate";
import ClassicTemplate from "@/components/resume/templates/ClassicTemplate";
import MinimalTemplate from "@/components/resume/templates/MinimalTemplate";
import CreativeTemplate from "@/components/resume/templates/CreativeTemplate";
import ExecutiveTemplate from "@/components/resume/templates/ExecutiveTemplate";
import TechnicalTemplate from "@/components/resume/templates/TechnicalTemplate";

const sampleData: ResumeData = {
  personalInfo: {
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexjohnson",
    github: "github.com/alexj",
    website: "alexjohnson.dev",
    summary:
      "Full-stack engineer with 5+ years of experience building scalable web applications and leading cross-functional teams. Passionate about clean architecture and delivering impactful products.",
  },
  experience: [
    {
      id: "1",
      title: "Senior Software Engineer",
      company: "Google",
      location: "Mountain View, CA",
      startDate: "2022-01",
      endDate: "",
      current: true,
      description: [
        "Led a team of 5 engineers to build a microservices platform serving 2M+ daily requests",
        "Improved system performance by 40% through caching strategies and query optimization",
        "Mentored 3 junior engineers and conducted 50+ technical interviews",
      ],
    },
    {
      id: "2",
      title: "Software Engineer",
      company: "Meta",
      location: "Menlo Park, CA",
      startDate: "2019-06",
      endDate: "2021-12",
      current: false,
      description: [
        "Developed React components used by 10M+ users across the platform",
        "Reduced page load time by 35% through code splitting and lazy loading",
      ],
    },
  ],
  education: [
    {
      id: "1",
      degree: "B.S. Computer Science",
      institution: "Stanford University",
      location: "Stanford, CA",
      graduationDate: "2019-06",
      gpa: "3.9",
    },
  ],
  skills: ["React", "TypeScript", "Node.js", "Python", "AWS", "GraphQL", "Docker", "PostgreSQL"],
};

const defaultSectionOrder = ["summary", "experience", "education", "skills"] as const;

type FilterTab = "all" | "ats" | "creative";

interface TemplateInfo {
  id: ResumeTemplate;
  name: string;
  badge?: string;
  isFeatured?: boolean;
  tab: FilterTab[];
  Component: React.ComponentType<{ resumeData: ResumeData; sectionOrder: typeof defaultSectionOrder extends readonly (infer T)[] ? T[] : never }>;
}

const templates: TemplateInfo[] = [
  { id: "jakes", name: "Jake's Resume", badge: "🔥 Most Used", isFeatured: true, tab: ["all", "ats"], Component: JakesTemplate },
  { id: "google", name: "Google Style", badge: "Popular", tab: ["all", "ats"], Component: GoogleTemplate },
  { id: "microsoft", name: "Microsoft Style", badge: "Recommended", tab: ["all", "ats"], Component: MicrosoftTemplate },
  { id: "harvard", name: "Harvard", badge: "ATS Optimized", tab: ["all", "ats"], Component: HarvardTemplate },
  { id: "ats-friendly", name: "ATS Friendly", badge: "Best for Freshers", tab: ["all", "ats"], Component: ATSTemplate },
  { id: "modern", name: "Modern", tab: ["all", "creative"], Component: ModernTemplate },
  { id: "classic", name: "Classic", tab: ["all", "creative"], Component: ClassicTemplate },
  { id: "minimal", name: "Minimal", tab: ["all", "creative"], Component: MinimalTemplate },
  { id: "creative", name: "Creative", tab: ["all", "creative"], Component: CreativeTemplate },
  { id: "executive", name: "Executive", tab: ["all", "creative"], Component: ExecutiveTemplate },
  { id: "technical", name: "Technical", tab: ["all", "ats"], Component: TechnicalTemplate },
];

const filterTabs: { id: FilterTab; label: string }[] = [
  { id: "all", label: "All Templates" },
  { id: "ats", label: "ATS" },
  { id: "creative", label: "Non ATS" },
];

const TemplatesShowcase = () => {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();

  const filteredTemplates = templates.filter((t) => t.tab.includes(activeTab));

  // Auto-scroll effect
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animationId: number;
    const scrollSpeed = 0.5;

    const scroll = () => {
      if (!isPaused && container) {
        container.scrollLeft += scrollSpeed;

        // Reset scroll position when reaching the end
        if (container.scrollLeft >= container.scrollWidth - container.clientWidth - 1) {
          container.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused, activeTab]);

  // Reset scroll on tab change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
    }
  }, [activeTab]);

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute inset-0 bg-primary/[0.02]" />

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <div
          ref={headerRef}
          className={cn(
            "text-center mb-12 transition-all duration-700 ease-out",
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 border border-primary/20">
            Templates
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
            Download our{" "}
            <span className="text-gradient">ATS and Non ATS Friendly</span>{" "}
            Resume Templates
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Build your resume within minutes with professionally designed templates
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex justify-center gap-2 mb-10">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-medium transition-all duration-300",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-card/50 border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide mb-12"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {/* Duplicate templates for seamless looping */}
          {[...filteredTemplates, ...filteredTemplates].map((template, idx) => (
            <div
              key={`${template.id}-${idx}`}
              className={cn(
                "group relative flex-shrink-0 rounded-2xl border overflow-hidden transition-all duration-500 hover:-translate-y-2",
                template.isFeatured
                  ? "border-primary/50 shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20"
                  : "border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/40"
              )}
              style={{ width: "280px" }}
            >
              {/* Badge */}
              {template.badge && (
                <div
                  className={cn(
                    "absolute top-3 left-3 z-20 px-2.5 py-1 text-[11px] font-semibold rounded-full flex items-center gap-1 shadow-lg",
                    template.isFeatured
                      ? "bg-primary text-primary-foreground shadow-primary/30"
                      : "bg-card border border-border/50 text-foreground"
                  )}
                >
                  {template.isFeatured && <Crown className="h-3 w-3" />}
                  {template.badge}
                </div>
              )}

              {/* Full template preview — scaled down */}
              <div className="relative bg-white overflow-hidden" style={{ height: "360px" }}>
                <div
                  className="absolute top-0 left-0 origin-top-left"
                  style={{
                    width: "8.5in",
                    minHeight: "11in",
                    transform: "scale(0.32)",
                    transformOrigin: "top left",
                  }}
                >
                  <template.Component
                    resumeData={sampleData}
                    sectionOrder={[...defaultSectionOrder]}
                  />
                </div>
              </div>

              {/* Template info */}
              <Link to="/builder">
                <div className="p-4 border-t border-border/30 bg-card/80 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                        {template.name}
                      </p>
                      {template.isFeatured && (
                        <div className="flex items-center gap-1 mt-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-primary/70 text-primary/70" />
                          ))}
                          <span className="text-[10px] text-muted-foreground ml-1">50K+ users</span>
                        </div>
                      )}
                    </div>
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/builder" className="inline-block group">
            <Button
              size="lg"
              className="rounded-full px-8 h-12 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 hover:scale-105 transition-all duration-300"
            >
              Use a Template
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Hide scrollbar globally for this component */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
};

export default TemplatesShowcase;
