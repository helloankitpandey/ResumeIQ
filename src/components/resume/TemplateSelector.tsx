import { useResume } from "@/contexts/ResumeContext";
import { ResumeTemplate } from "@/types/resume";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import SectionOrderer from "./SectionOrderer";
import TemplateMiniPreview from "./TemplateMiniPreview";

const templates: { id: ResumeTemplate; name: string; description: string; color: string; badge?: string }[] = [
  {
    id: "jakes",
    name: "Jake's Resume",
    description: "Top Overleaf template — clean, dense, loved by tech recruiters",
    color: "bg-gray-900",
    badge: "🔥 #1 on Overleaf",
  },
  {
    id: "google",
    name: "Google Style",
    description: "Clean, minimal format preferred by Google recruiters",
    color: "bg-blue-600",
    badge: "Most Popular",
  },
  {
    id: "microsoft",
    name: "Microsoft Style",
    description: "Professional format aligned with Microsoft standards",
    color: "bg-emerald-600",
    badge: "Recommended",
  },
  {
    id: "harvard",
    name: "Harvard",
    description: "Classic academic format used by top universities",
    color: "bg-red-800",
    badge: "ATS Optimized",
  },
  {
    id: "ats-friendly",
    name: "ATS Friendly",
    description: "Maximum compatibility with all tracking systems",
    color: "bg-gray-900",
    badge: "Best for Freshers",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Clean and professional with a contemporary feel",
    color: "bg-gray-800",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional and elegant, perfect for formal industries",
    color: "bg-gray-700",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple and refined, lets your content shine",
    color: "bg-gray-400",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Bold colors and unique layout for creative roles",
    color: "bg-purple-600",
  },
  {
    id: "executive",
    name: "Executive",
    description: "Sophisticated design for senior leadership positions",
    color: "bg-slate-900",
  },
  {
    id: "technical",
    name: "Technical",
    description: "Structured layout highlighting technical skills",
    color: "bg-cyan-700",
  },
];
const TemplateSelector = () => {
  const { selectedTemplate, setSelectedTemplate, resumeData } = useResume();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-display font-semibold text-foreground">Choose a Template</h2>
        <p className="text-muted-foreground">Select a design that matches your style</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => setSelectedTemplate(template.id)}
            className={cn(
              "relative flex flex-col items-start p-4 rounded-xl border-2 transition-all text-left",
              "hover:border-primary/50 hover:shadow-md",
              selectedTemplate === template.id
                ? "border-primary bg-primary/5 shadow-md"
                : "border-border bg-card"
            )}
          >
            {template.badge && (
              <div className="absolute -top-2 left-3 px-2 py-0.5 bg-accent text-accent-foreground text-[10px] font-semibold rounded-full">
                {template.badge}
              </div>
            )}
            {selectedTemplate === template.id && (
              <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                <Check className="h-3 w-3 text-primary-foreground" />
              </div>
            )}
            
            {/* Template preview - now shows live data */}
            <div className="w-full aspect-[8.5/11] mb-4 rounded-md bg-white border overflow-hidden mt-2">
              <TemplateMiniPreview template={template.id} resumeData={resumeData} />
            </div>

            <h3 className="font-semibold text-foreground">{template.name}</h3>
            <p className="text-sm text-muted-foreground">{template.description}</p>
          </button>
        ))}
      </div>

      {/* Section Order */}
      <div className="pt-6 border-t">
        <SectionOrderer />
      </div>
    </div>
  );
};

export default TemplateSelector;