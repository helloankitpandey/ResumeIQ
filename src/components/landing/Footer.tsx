/**
 * Footer Component
 *
 * Site-wide footer containing:
 *   - Brand logo & tagline
 *   - Social media icon links
 *   - Product / Resources / Company link columns
 *   - Copyright notice
 *
 * Uses useScrollReveal for a fade-in entrance animation.
 */

import { Link } from "react-router-dom";
import { FileText, Twitter, Linkedin, Github, Mail } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

const Footer = () => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <footer
      ref={ref}
      className={cn(
        "py-16 px-6 border-t border-border/30 transition-all duration-700 ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      )}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25 group-hover:scale-105 transition-transform duration-300">
                <FileText className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold text-foreground">ResumeIQ</span>
            </Link>
            <p className="text-muted-foreground mb-6 leading-relaxed text-sm">
              Build ATS-optimized resumes that get you shortlisted at top companies.
            </p>
            <div className="flex gap-2">
              {[
                { Icon: Linkedin, href: "https://www.linkedin.com/in/helloankit-pandey-/" },
                { Icon: Github, href: "https://github.com/helloankitpandey/" },
                { Icon: Twitter, href: "https://x.com/heloankitpandey" },
                { Icon: Mail, href: "mailto:ankit221601@gmail.com" },
              ].map(({ Icon, href }, i) => (
                <a key={i} href={href} target={href.startsWith("mailto") ? undefined : "_blank"} rel="noopener noreferrer" className="h-9 w-9 rounded-lg border border-border/50 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm">Product</h4>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li><Link to="/builder" className="hover:text-primary transition-colors">Resume Builder</Link></li>
              <li><Link to="/analyzer" className="hover:text-primary transition-colors">ATS Analyzer</Link></li>
              <li><Link to="/builder" className="hover:text-primary transition-colors">Templates</Link></li>
              <li><Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm">Resources</h4>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Resume Examples</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Career Blog</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Interview Tips</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm">Company</h4>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ResumeIQ. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Made with ❤️ by <a href="https://www.linkedin.com/in/helloankit-pandey-/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Ankit Pandey</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
