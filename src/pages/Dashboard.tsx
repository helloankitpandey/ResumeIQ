/**
 * Dashboard Page
 *
 * Authenticated landing page showing:
 *   - Current plan & remaining AI analysis credits
 *   - Quick-action cards (Build / Analyze)
 *   - List of saved resumes with edit, duplicate, and delete actions
 *
 * Redirects unauthenticated users to /auth.
 */

import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSavedResumes } from "@/hooks/useSavedResumes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  Plus,
  Sparkles,
  Crown,
  FileSearch,
  LogOut,
  User,
  Loader2,
  Menu,
  Home,
  PenTool,
  DollarSign,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SavedResumesList from "@/components/resume/SavedResumesList";
import { ThemeToggle } from "@/components/ThemeToggle";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile, loading, signOut } = useAuth();
  const { resumes, loading: resumesLoading, deleteResume, duplicateResume } = useSavedResumes();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const isPremium = profile.subscription_tier === "premium";
  const creditsUsed = 5 - profile.credits_remaining;
  const creditsPercentage = isPremium ? 100 : (creditsUsed / 5) * 100;

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b px-3 sm:px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-accent flex items-center justify-center">
                <FileText className="h-4 w-4 text-accent-foreground" />
              </div>
              <span className="font-display text-lg sm:text-xl font-semibold hidden xs:inline">ResumeIQ</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link to="/builder" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Builder
              </Link>
              <Link to="/analyzer" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Analyzer
              </Link>
              <Link to="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="flex flex-col gap-4 mt-8">
                  <Link to="/" className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-muted transition-colors">
                    <Home className="h-5 w-5" />
                    <span className="font-medium">Home</span>
                  </Link>
                  <Link to="/dashboard" className="flex items-center gap-3 px-2 py-2 rounded-lg bg-muted">
                    <FileText className="h-5 w-5" />
                    <span className="font-medium">Dashboard</span>
                  </Link>
                  <Link to="/builder" className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-muted transition-colors">
                    <PenTool className="h-5 w-5" />
                    <span className="font-medium">Builder</span>
                  </Link>
                  <Link to="/analyzer" className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-muted transition-colors">
                    <FileSearch className="h-5 w-5" />
                    <span className="font-medium">Analyzer</span>
                  </Link>
                  <Link to="/pricing" className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-muted transition-colors">
                    <DollarSign className="h-5 w-5" />
                    <span className="font-medium">Pricing</span>
                  </Link>
                  {!isPremium && (
                    <Link to="/pricing" className="mt-4">
                      <Button className="w-full">
                        <Crown className="h-4 w-4 mr-2" />
                        Upgrade to Premium
                      </Button>
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
            
            <ThemeToggle />
            {!isPremium && (
              <Link to="/pricing">
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <Crown className="h-4 w-4 mr-2 text-yellow-500" />
                  Upgrade
                </Button>
              </Link>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {profile.full_name?.charAt(0) || profile.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-popover border shadow-lg">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="truncate">{profile.full_name || "User"}</span>
                    <span className="text-xs font-normal text-muted-foreground truncate">
                      {profile.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/pricing" className="flex items-center">
                    <Crown className="h-4 w-4 mr-2" />
                    {isPremium ? "Manage Subscription" : "Upgrade to Premium"}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-bold mb-1 sm:mb-2">
            Welcome back, {profile.full_name?.split(" ")[0] || "there"}! 👋
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Ready to build your perfect resume?
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          {/* Plan Status */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Current Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {isPremium ? (
                  <>
                    <Crown className="h-5 w-5 text-yellow-500" />
                    <span className="text-2xl font-bold">Premium</span>
                  </>
                ) : (
                  <>
                    <User className="h-5 w-5 text-muted-foreground" />
                    <span className="text-2xl font-bold">Free</span>
                  </>
                )}
              </div>
              {!isPremium && (
                <Link to="/pricing">
                  <Button variant="link" className="p-0 h-auto mt-1 text-primary">
                    Upgrade for unlimited access →
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          {/* Credits */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                AI Analyses
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isPremium ? (
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">Unlimited</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-bold">
                      {profile.credits_remaining}
                    </span>
                    <span className="text-muted-foreground">/ 5 remaining</span>
                  </div>
                  <Progress value={100 - creditsPercentage} className="h-2" />
                </>
              )}
            </CardContent>
          </Card>

          {/* Saved Resumes Count */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Saved Resumes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">{resumes.length}</span>
                <span className="text-muted-foreground">resumes</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Cards */}
        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          {/* Create Resume */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <Link to="/builder">
              <CardHeader className="p-4 sm:p-6">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
                  <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <CardTitle className="text-base sm:text-lg">Build New Resume</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Create a professional, ATS-optimized resume using our builder
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                <Button variant="outline" className="w-full text-sm">
                  Start Building
                </Button>
              </CardContent>
            </Link>
          </Card>

          {/* Analyze Resume */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <Link to="/analyzer">
              <CardHeader className="p-4 sm:p-6">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-2 group-hover:bg-accent/20 transition-colors">
                  <FileSearch className="h-5 w-5 sm:h-6 sm:w-6 text-accent-foreground" />
                </div>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  Analyze Your Resume
                  <Badge variant="secondary" className="text-xs">
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI
                  </Badge>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Get AI-powered feedback on your existing resume with ATS scoring
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                <Button variant="outline" className="w-full text-sm">
                  Analyze Now
                </Button>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Saved Resumes Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-display font-semibold">Your Resumes</h2>
            <Link to="/builder">
              <Button size="sm" className="text-xs sm:text-sm">
                <Plus className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden xs:inline">New Resume</span>
                <span className="xs:hidden">New</span>
              </Button>
            </Link>
          </div>
          <SavedResumesList
            resumes={resumes}
            loading={resumesLoading}
            onDelete={deleteResume}
            onDuplicate={duplicateResume}
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;