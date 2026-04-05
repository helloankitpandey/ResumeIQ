import { useResume } from "@/contexts/ResumeContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Briefcase } from "lucide-react";
import AIGenerateDialog from "./AIGenerateDialog";

const ExperienceForm = () => {
  const { resumeData, addExperience, updateExperience, removeExperience } = useResume();

  const handleBulletsGenerated = (id: string, content: string) => {
    // Parse the generated bullets (each line starting with •)
    const bullets = content
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => line.replace(/^[•\-*]\s*/, "")); // Remove bullet characters
    updateExperience(id, "description", bullets);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-display font-semibold text-foreground">Work Experience</h2>
        <p className="text-muted-foreground">Add your professional experience</p>
      </div>

      {resumeData.experience.length === 0 ? (
        <Card className="border-dashed border-2 bg-muted/30">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Briefcase className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground mb-4">No experience added yet</p>
            <Button onClick={addExperience} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Experience
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {resumeData.experience.map((exp, index) => (
            <Card key={exp.id} className="relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-accent" />
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-muted-foreground">
                    Experience {index + 1}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExperience(exp.id)}
                    className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Job Title</Label>
                    <Input
                      placeholder="Software Engineer"
                      value={exp.title}
                      onChange={(e) => updateExperience(exp.id, "title", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Company</Label>
                    <Input
                      placeholder="Tech Company Inc."
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      placeholder="San Francisco, CA"
                      value={exp.location}
                      onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-1 space-y-2">
                      <Label>Start Date</Label>
                      <Input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label>End Date</Label>
                      <Input
                        type="month"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                        disabled={exp.current}
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 flex items-center space-x-2">
                    <Checkbox
                      id={`current-${exp.id}`}
                      checked={exp.current}
                      onCheckedChange={(checked) => updateExperience(exp.id, "current", checked)}
                    />
                    <Label htmlFor={`current-${exp.id}`} className="text-sm font-normal cursor-pointer">
                      I currently work here
                    </Label>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Description / Achievements</Label>
                      <AIGenerateDialog
                        type="bullets"
                        context={{
                          title: exp.title,
                          company: exp.company,
                          currentDescription: exp.description.join("\n"),
                        }}
                        onGenerated={(content) => handleBulletsGenerated(exp.id, content)}
                      />
                    </div>
                    <Textarea
                      placeholder="• Led a team of engineers...&#10;• Increased revenue by 25%...&#10;• Implemented new features..."
                      value={exp.description.join("\n")}
                      onChange={(e) =>
                        updateExperience(exp.id, "description", e.target.value.split("\n"))
                      }
                      className="min-h-[120px]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button onClick={addExperience} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Another Experience
          </Button>
        </div>
      )}
    </div>
  );
};

export default ExperienceForm;
