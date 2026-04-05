/**
 * Hero Section
 *
 * Full-width above-the-fold section with:
 *   - Animated headline & sub-headline
 *   - Two primary CTA buttons (Score / Build)
 *   - Social-proof avatars strip
 *   - Resume preview image with glow effect
 */

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileSearch } from "lucide-react";
import resumePreview from "@/assets/resume-hero-preview.png";

const HeroSection = () => {
  return (
    <section className="pt-28 pb-16 md:pt-36 md:pb-24 px-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[120px] animate-pulse-soft" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] animate-pulse-soft" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Text content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span>Free ATS Resume Checker & Builder</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-display font-bold text-foreground leading-[1.08] mb-6 animate-fade-in-up">
              Build a Resume That{" "}
              <span className="text-gradient">
                Gets You Hired
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              Create ATS-optimized, professional resumes in minutes. Trusted by job seekers at top companies worldwide.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start mb-10 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <Link to="/analyzer" className="relative group">
                <div className="absolute -inset-[1px] rounded-full bg-gradient-to-r from-primary via-primary/60 to-primary opacity-75 blur-[3px] group-hover:opacity-100 group-hover:blur-[6px] transition-all duration-500" />
                <Button size="xl" className="relative rounded-full px-10 text-lg font-semibold shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:scale-105 transition-all duration-300 w-full sm:w-auto">
                  Get My Resume Score
                </Button>
              </Link>
              <Link to="/builder" className="relative group">
                <div className="absolute -inset-[1px] rounded-full bg-gradient-to-r from-primary/50 via-primary/30 to-primary/50 opacity-60 blur-[3px] group-hover:opacity-100 group-hover:blur-[6px] transition-all duration-500" />
                <Button size="xl" variant="outline" className="relative rounded-full px-10 text-lg font-semibold border-primary/40 bg-background hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 w-full sm:w-auto">
                  <FileSearch className="mr-2 h-5 w-5" />
                  Create my Resume
                </Button>
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-4 justify-center lg:justify-start animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <div className="flex -space-x-3">
                {[
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face",
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="User"
                    className="h-9 w-9 rounded-full border-2 border-background object-cover"
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Scored by over <span className="text-foreground font-semibold">50K+</span> Professionals
              </p>
            </div>
          </div>

          {/* Right — Resume preview */}
          <div className="relative flex justify-center lg:justify-end animate-fade-in-up mt-8 lg:mt-0" style={{ animationDelay: "0.2s" }}>
            <div className="relative max-w-[360px] lg:max-w-[400px]">
              {/* Glow behind */}
              <div className="absolute -inset-6 bg-primary/20 rounded-3xl blur-3xl" />
              <img
                src={resumePreview}
                alt="Resume preview showing a professional ATS-optimized layout"
                loading="lazy"
                decoding="async"
                className="relative w-full rounded-2xl shadow-2xl shadow-primary/20"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
