import { useResume } from "@/contexts/ResumeContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AIGenerateDialog from "./AIGenerateDialog";
import { User, Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";

const PersonalInfoForm = () => {
  const { resumeData, updatePersonalInfo } = useResume();
  const { personalInfo } = resumeData;

  const handleSummaryGenerated = (content: string) => {
    updatePersonalInfo("summary", content);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-display font-semibold text-foreground">Personal Information</h2>
        <p className="text-muted-foreground">Let's start with your basic details</p>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-accent" />
            Full Name
          </Label>
          <Input
            id="name"
            placeholder="John Doe"
            value={personalInfo.name}
            onChange={(e) => updatePersonalInfo("name", e.target.value)}
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-accent" />
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            value={personalInfo.email}
            onChange={(e) => updatePersonalInfo("email", e.target.value)}
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-accent" />
            Phone
          </Label>
          <Input
            id="phone"
            placeholder="+1 (555) 123-4567"
            value={personalInfo.phone}
            onChange={(e) => updatePersonalInfo("phone", e.target.value)}
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-accent" />
            Location
          </Label>
          <Input
            id="location"
            placeholder="San Francisco, CA"
            value={personalInfo.location}
            onChange={(e) => updatePersonalInfo("location", e.target.value)}
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedin" className="flex items-center gap-2">
            <Linkedin className="h-4 w-4 text-accent" />
            LinkedIn
          </Label>
          <Input
            id="linkedin"
            placeholder="linkedin.com/in/johndoe"
            value={personalInfo.linkedin}
            onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="github" className="flex items-center gap-2">
            <Github className="h-4 w-4 text-accent" />
            GitHub
          </Label>
          <Input
            id="github"
            placeholder="github.com/johndoe"
            value={personalInfo.github}
            onChange={(e) => updatePersonalInfo("github", e.target.value)}
            className="h-11"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="website" className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-accent" />
            Website
          </Label>
          <Input
            id="website"
            placeholder="johndoe.com"
            value={personalInfo.website}
            onChange={(e) => updatePersonalInfo("website", e.target.value)}
            className="h-11"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="summary">Professional Summary</Label>
          <AIGenerateDialog
            type="summary"
            context={{
              name: personalInfo.name,
              title: resumeData.experience[0]?.title || "",
              skills: resumeData.skills,
              experience: resumeData.experience.map(e => `${e.title} at ${e.company}`).join(", "),
            }}
            onGenerated={handleSummaryGenerated}
          />
        </div>
        <Textarea
          id="summary"
          placeholder="Write a brief summary of your professional background..."
          value={personalInfo.summary}
          onChange={(e) => updatePersonalInfo("summary", e.target.value)}
          className="min-h-[120px] resize-none"
        />
      </div>
    </div>
  );
};

export default PersonalInfoForm;
