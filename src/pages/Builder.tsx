/**
 * Resume Builder Page
 *
 * Multi-step form with a live preview panel:
 *   Step 0 – Personal Info
 *   Step 1 – Work Experience
 *   Step 2 – Education
 *   Step 3 – Skills
 *   Step 4 – Template Selection
 *
 * Desktop: side-by-side form + preview
 * Mobile:  form only, with a Sheet drawer for the preview
 *
 * Supports loading an existing resume via the `?resume=<id>` query param,
 * saving / updating to the database, and exporting to PDF via react-to-print.
 */

import { useRef, useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { ResumeProvider, useResume, ResumeSection } from "@/contexts/ResumeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useSavedResumes, SavedResume } from "@/hooks/useSavedResumes";
import PersonalInfoForm from "@/components/resume/PersonalInfoForm";
import ExperienceForm from "@/components/resume/ExperienceForm";
import EducationForm from "@/components/resume/EducationForm";
import SkillsForm from "@/components/resume/SkillsForm";
import TemplateSelector from "@/components/resume/TemplateSelector";
import ResumePreview from "@/components/resume/ResumePreview";
import StepIndicator from "@/components/resume/StepIndicator";
import SaveResumeDialog from "@/components/resume/SaveResumeDialog";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Download, FileText, Eye, Save, Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { defaultResumeData } from "@/types/resume";
import ProjectForm from "@/components/resume/ProjectForm";

const steps = ["Personal", "Experience", "Projects", "Education", "Skills", "Template"];

const BuilderContent = () => {
  const { user } = useAuth();
  const { 
    currentStep, 
    setCurrentStep, 
    resumeData, 
    setResumeData, 
    selectedTemplate, 
    setSelectedTemplate,
    sectionOrder,
    setSectionOrder
  } = useResume();
  const { getResumeById } = useSavedResumes();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [showPreview, setShowPreview] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [currentResumeId, setCurrentResumeId] = useState<string | null>(null);
  const [loadingResume, setLoadingResume] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  // Load resume from URL param
  useEffect(() => {
    const resumeId = searchParams.get("resume");
    if (resumeId && user) {
      setLoadingResume(true);
      getResumeById(resumeId).then((resume) => {
        if (resume) {
          setCurrentResumeId(resume.id);
          setResumeData({
            personalInfo: resume.resume_data.personalInfo || defaultResumeData.personalInfo,
            experience: resume.resume_data.experience || [],
            projects: resume.resume_data.projects || [],
            education: resume.resume_data.education || [],
            skills: resume.resume_data.skills || [],
          });
          setSelectedTemplate(resume.template);
          if (resume.resume_data.sectionOrder) {
            setSectionOrder(resume.resume_data.sectionOrder);
          }
        }
        setLoadingResume(false);
      });
    }
  }, [searchParams, user, getResumeById, setResumeData, setSelectedTemplate, setSectionOrder]);

  const getDocumentTitle = () => {
    const name = resumeData.personalInfo.name?.trim();
    if (name) {
      return `${name.replace(/\s+/g, "_")}_Resume`;
    }
    return "Resume";
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: getDocumentTitle(),
    pageStyle: `
      @page {
        size: letter;
        margin: 0;
      }
      @media print {
        html, body {
          width: 8.5in;
          height: 11in;
          margin: 0;
          padding: 0;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      }
    `,
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaved = (resume: SavedResume) => {
    setCurrentResumeId(resume.id);
    // Update URL without reloading
    setSearchParams({ resume: resume.id });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <PersonalInfoForm />;
      case 1:
        return <ExperienceForm />;
      case 2:
        return <ProjectForm />;
      case 3:
        return <EducationForm />;
      case 4:
        return <SkillsForm />;
      case 5:
        return <TemplateSelector />;
      default:
        return <PersonalInfoForm />;
    }
  };

  if (loadingResume) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b px-3 md:px-4 py-3 no-print">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-accent flex items-center justify-center">
                <FileText className="h-4 w-4 text-accent-foreground" />
              </div>
              <span className="font-display text-lg md:text-xl font-semibold hidden sm:inline">ResumeIQ</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link to="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <Link to="/analyzer" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Analyzer
              </Link>
              <Link to="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <ThemeToggle />
            {/* Mobile Preview Button */}
            <Sheet open={showPreview} onOpenChange={setShowPreview}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                  <Eye className="h-4 w-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Preview</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[85vh] p-0">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle>Resume Preview</SheetTitle>
                </SheetHeader>
                <div className="overflow-auto h-full pb-20">
                  <div className="p-4">
                    <div className="bg-white rounded-lg shadow-lg border">
                      <ResumePreview />
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            {/* Save Button - only show if user is logged in */}
            {user && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSaveDialogOpen(true)}
                className="text-xs md:text-sm"
              >
                <Save className="h-4 w-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">{currentResumeId ? "Update" : "Save"}</span>
              </Button>
            )}
            
            <Button variant="accent" size="sm" onClick={() => handlePrint()} className="text-xs md:text-sm">
              <Download className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Download</span> PDF
            </Button>
          </div>
        </div>
      </header>

      {/* Step Indicator */}
      <div className="bg-card border-b px-2 md:px-4 py-3 md:py-4 overflow-x-auto no-print">
        <StepIndicator
          steps={steps}
          currentStep={currentStep}
          onStepClick={setCurrentStep}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Form Panel */}
        <div className="flex-1 lg:w-1/2 overflow-y-auto p-4 md:p-6 lg:p-8 no-print">
          <div className="max-w-2xl mx-auto">
            {renderStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6 md:mt-8 pt-4 md:pt-6 border-t gap-3">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentStep === 0}
                size="sm"
                className="md:h-10"
              >
                <ArrowLeft className="h-4 w-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Previous</span>
                <span className="sm:hidden">Prev</span>
              </Button>
              {currentStep < steps.length - 1 ? (
                <Button variant="default" onClick={handleNext} size="sm" className="md:h-10">
                  Next
                  <ArrowRight className="h-4 w-4 ml-1 md:ml-2" />
                </Button>
              ) : (
                <Button variant="hero" onClick={() => handlePrint()} size="sm" className="md:h-10">
                  <Download className="h-4 w-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Download Resume</span>
                  <span className="sm:hidden">Download</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Preview Panel - Desktop Only */}
        <div className="hidden lg:block w-1/2 bg-muted/50 border-l overflow-y-auto">
          <div className="p-6">
            <div className="sticky top-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Preview</h3>
                <span className="text-sm text-muted-foreground">Live preview of your resume</span>
              </div>
              <div className="bg-white rounded-lg shadow-lg border overflow-auto" style={{ maxHeight: "calc(100vh - 200px)" }}>
                <div ref={printRef}>
                  <ResumePreview />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print-only content */}
      <div className="hidden print:block print-resume">
        <ResumePreview />
      </div>

      {/* Save Dialog */}
      <SaveResumeDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        currentResumeId={currentResumeId}
        onSaved={handleSaved}
      />
    </div>
  );
};

const Builder = () => {
  return (
    <ResumeProvider>
      <BuilderContent />
    </ResumeProvider>
  );
};

export default Builder;