import { useState } from "react";
import { useResume } from "@/contexts/ResumeContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Sparkles, Code2 } from "lucide-react";

const suggestedSkills = [
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "Python",
  "SQL",
  "Git",
  "AWS",
  "Docker",
  "Agile",
  "Communication",
  "Leadership",
];

const SkillsForm = () => {
  const { resumeData, addSkill, removeSkill } = useResume();
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      addSkill(newSkill);
      setNewSkill("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleSuggestSkills = () => {
    // Placeholder for AI suggestion
    const aiSuggested = ["Problem Solving", "Team Collaboration", "Project Management"];
    aiSuggested.forEach((skill) => addSkill(skill));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-display font-semibold text-foreground">Skills</h2>
        <p className="text-muted-foreground">Add your technical and soft skills</p>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 space-y-2">
            <Label htmlFor="skill">Add a Skill</Label>
            <Input
              id="skill"
              placeholder="Type a skill and press Enter..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={handleKeyPress}
              className="h-11"
            />
          </div>
          <div className="flex items-end">
            <Button onClick={handleAddSkill} variant="default" className="h-11">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleSuggestSkills}
          className="text-accent hover:text-accent/80 hover:bg-accent/10"
        >
          <Sparkles className="h-4 w-4 mr-1" />
          Suggest Skills with AI
        </Button>
      </div>

      {resumeData.skills.length > 0 && (
        <div className="space-y-3">
          <Label>Your Skills</Label>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="px-3 py-1.5 text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 cursor-default group"
              >
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="ml-2 opacity-50 hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {resumeData.skills.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed rounded-lg bg-muted/30">
          <Code2 className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground mb-2">No skills added yet</p>
          <p className="text-sm text-muted-foreground">
            Add skills manually or try the suggested ones below
          </p>
        </div>
      )}

      <div className="space-y-3">
        <Label className="text-muted-foreground">Popular Skills</Label>
        <div className="flex flex-wrap gap-2">
          {suggestedSkills
            .filter((skill) => !resumeData.skills.includes(skill))
            .map((skill) => (
              <Badge
                key={skill}
                variant="outline"
                className="px-3 py-1.5 text-sm cursor-pointer hover:bg-secondary transition-colors"
                onClick={() => addSkill(skill)}
              >
                <Plus className="h-3 w-3 mr-1" />
                {skill}
              </Badge>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsForm;
