import { useResume } from "@/contexts/ResumeContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, GraduationCap } from "lucide-react";

const EducationForm = () => {
  const { resumeData, addEducation, updateEducation, removeEducation } = useResume();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-display font-semibold text-foreground">Education</h2>
        <p className="text-muted-foreground">Add your educational background</p>
      </div>

      {resumeData.education.length === 0 ? (
        <Card className="border-dashed border-2 bg-muted/30">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <GraduationCap className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground mb-4">No education added yet</p>
            <Button onClick={addEducation} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Education
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {resumeData.education.map((edu, index) => (
            <Card key={edu.id} className="relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-accent" />
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-muted-foreground">
                    Education {index + 1}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEducation(edu.id)}
                    className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Degree</Label>
                    <Input
                      placeholder="Bachelor of Science in Computer Science"
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Institution</Label>
                    <Input
                      placeholder="Stanford University"
                      value={edu.institution}
                      onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      placeholder="Stanford, CA"
                      value={edu.location}
                      onChange={(e) => updateEducation(edu.id, "location", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Graduation Date</Label>
                    <Input
                      type="month"
                      value={edu.graduationDate}
                      onChange={(e) => updateEducation(edu.id, "graduationDate", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>GPA (Optional)</Label>
                    <Input
                      placeholder="3.8/4.0"
                      value={edu.gpa || ""}
                      onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button onClick={addEducation} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Another Education
          </Button>
        </div>
      )}
    </div>
  );
};

export default EducationForm;
