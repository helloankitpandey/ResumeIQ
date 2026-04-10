import { useResume } from "@/contexts/ResumeContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Folder } from "lucide-react";
import AIGenerateDialog from "./AIGenerateDialog";

const ProjectForm = () => {
  const { resumeData, addProject, updateProject, removeProject } = useResume();

  const handleBulletsGenerated = (id: string, content: string) => {
    const bullets = content
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => line.replace(/^[•\-*]\s*/, ""));

    updateProject(id, "description", bullets);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-display font-semibold text-foreground">
          Projects
        </h2>
        <p className="text-muted-foreground">
          Add your personal or academic projects
        </p>
      </div>

      {resumeData.projects.length === 0 ? (
        <Card className="border-dashed border-2 bg-muted/30">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Folder className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground mb-4">
              No projects added yet
            </p>
            <Button onClick={addProject} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {resumeData.projects.map((proj, index) => (
            <Card key={proj.id} className="relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-accent" />
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-muted-foreground">
                    Project {index + 1}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeProject(proj.id)}
                    className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Project Title</Label>
                    <Input
                      placeholder="ResumeIQ"
                      value={proj.title}
                      onChange={(e) =>
                        updateProject(proj.id, "title", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Tech Stack</Label>
                    <Input
                      placeholder="React, TypeScript, Supabase"
                      value={proj.techStack}
                      onChange={(e) =>
                        updateProject(proj.id, "techStack", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Project Link</Label>
                    <Input
                      placeholder="https://your-project-link.com"
                      value={proj.link}
                      onChange={(e) =>
                        updateProject(proj.id, "link", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>GitHub Repo</Label>
                    <Input
                      placeholder="https://github.com/your-repo"
                      value={proj.github}
                      onChange={(e) =>
                        updateProject(proj.id, "github", e.target.value)
                      }
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Description / Highlights</Label>
                      <AIGenerateDialog
                        type="bullets"
                        context={{
                          title: proj.title,
                          techStack: proj.techStack,
                          currentDescription: proj.description.join("\n"),
                        }}
                        onGenerated={(content) =>
                          handleBulletsGenerated(proj.id, content)
                        }
                      />
                    </div>

                    <Textarea
                      placeholder="• Built an AI-powered resume analyzer...&#10;• Integrated Gemini API...&#10;• Improved ATS score..."
                      value={proj.description.join("\n")}
                      onChange={(e) =>
                        updateProject(
                          proj.id,
                          "description",
                          e.target.value.split("\n")
                        )
                      }
                      className="min-h-[120px]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button onClick={addProject} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Another Project
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProjectForm;