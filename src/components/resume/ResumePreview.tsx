import { useResume } from "@/contexts/ResumeContext";
import JakesTemplate from "./templates/JakesTemplate";
import GoogleTemplate from "./templates/GoogleTemplate";
import MicrosoftTemplate from "./templates/MicrosoftTemplate";
import HarvardTemplate from "./templates/HarvardTemplate";
import ATSTemplate from "./templates/ATSTemplate";
import ModernTemplate from "./templates/ModernTemplate";
import ClassicTemplate from "./templates/ClassicTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";
import CreativeTemplate from "./templates/CreativeTemplate";
import ExecutiveTemplate from "./templates/ExecutiveTemplate";
import TechnicalTemplate from "./templates/TechnicalTemplate";

const ResumePreview = () => {
  const { resumeData, selectedTemplate, sectionOrder } = useResume();
  const { personalInfo, experience, education, skills } = resumeData;

  const hasContent =
    personalInfo.name ||
    personalInfo.email ||
    experience.length > 0 ||
    education.length > 0 ||
    skills.length > 0;

  if (!hasContent) {
    return (
      <div className="h-full flex items-center justify-center text-center p-8">
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
            <span className="text-2xl">📄</span>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Your Resume Preview</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Start filling in your details to see your resume come to life
            </p>
          </div>
        </div>
      </div>
    );
  }

  const templateProps = { resumeData, sectionOrder };

  switch (selectedTemplate) {
    case "jakes":
      return <JakesTemplate {...templateProps} />;
    case "google":
      return <GoogleTemplate {...templateProps} />;
    case "microsoft":
      return <MicrosoftTemplate {...templateProps} />;
    case "harvard":
      return <HarvardTemplate {...templateProps} />;
    case "ats-friendly":
      return <ATSTemplate {...templateProps} />;
    case "classic":
      return <ClassicTemplate {...templateProps} />;
    case "minimal":
      return <MinimalTemplate {...templateProps} />;
    case "creative":
      return <CreativeTemplate {...templateProps} />;
    case "executive":
      return <ExecutiveTemplate {...templateProps} />;
    case "technical":
      return <TechnicalTemplate {...templateProps} />;
    case "modern":
    default:
      return <ModernTemplate {...templateProps} />;
  }
};

export default ResumePreview;
