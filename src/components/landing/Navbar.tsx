/**
 * Navbar – Fixed top navigation bar
 *
 * Desktop: horizontal links + CTA button
 * Mobile:  hamburger icon → Sheet drawer with navigation links
 *
 * Conditionally shows "Dashboard" or "Get Started" based on auth state.
 */

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ArrowRight, FileText, Menu, Home, LayoutDashboard, PenTool, FileSearch, DollarSign } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-2xl border-b border-border/30">
      <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25 group-hover:scale-105 transition-transform duration-300">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">ResumeIQ</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          {[
            { to: "/", label: "Home" },
            { to: "/dashboard", label: "Dashboard" },
            { to: "/builder", label: "Builder" },
            { to: "/analyzer", label: "Check Your ATS" },
            { to: "/pricing", label: "Pricing" },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <div className="flex flex-col gap-2 mt-8">
                <Link to="/" className="flex items-center gap-3 px-3 py-3 rounded-xl bg-primary/10 text-primary">
                  <Home className="h-5 w-5" />
                  <span className="font-medium">Home</span>
                </Link>
                <Link to="/dashboard" className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-muted transition-colors">
                  <LayoutDashboard className="h-5 w-5" />
                  <span className="font-medium">Dashboard</span>
                </Link>
                <Link to="/builder" className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-muted transition-colors">
                  <PenTool className="h-5 w-5" />
                  <span className="font-medium">Builder</span>
                </Link>
                <Link to="/analyzer" className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-muted transition-colors">
                  <FileSearch className="h-5 w-5" />
                  <span className="font-medium">Check Your ATS</span>
                </Link>
                <Link to="/pricing" className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-muted transition-colors">
                  <DollarSign className="h-5 w-5" />
                  <span className="font-medium">Pricing</span>
                </Link>
                <div className="mt-4 pt-4 border-t">
                  {user ? (
                    <Link to="/dashboard">
                      <Button className="w-full rounded-xl h-12">
                        Dashboard
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/auth">
                      <Button className="w-full rounded-xl h-12">
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          <ThemeToggle />
          
          {user ? (
            <Link to="/dashboard" className="hidden md:block">
              <Button variant="outline" size="sm" className="rounded-full px-5 text-sm border-primary/30 hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/auth" className="hidden md:block">
              <Button size="sm" className="rounded-full px-5 text-sm shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300">
                Get Started 🎉
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
