import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2, Target } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AIGenerateDialogProps {
  type: "summary" | "bullets" | "improve";
  context: Record<string, unknown>;
  onGenerated: (content: string) => void;
  triggerText?: string;
  triggerVariant?: "ghost" | "outline" | "default";
  triggerSize?: "sm" | "default" | "lg";
  className?: string;
}

const AIGenerateDialog = ({
  type,
  context,
  onGenerated,
  triggerText = "Generate with AI",
  triggerVariant = "ghost",
  triggerSize = "sm",
  className,
}: AIGenerateDialogProps) => {
  const [open, setOpen] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke("generate-content", {
        body: {
          type,
          context,
          jobDescription: jobDescription.trim() || null,
        },
      });

      if (error) throw error;

      if (data?.content) {
        onGenerated(data.content);
        toast.success("Content generated successfully!");
        setOpen(false);
        setJobDescription("");
      } else {
        throw new Error("No content received");
      }
    } catch (error: unknown) {
      console.error("Generation error:", error);
      const message = error instanceof Error ? error.message : "Failed to generate content";
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const getDescription = () => {
    switch (type) {
      case "summary":
        return "Generate a compelling professional summary tailored to your target role.";
      case "bullets":
        return "Generate impactful achievement bullet points for this experience.";
      case "improve":
        return "Improve your existing content to be more impactful and ATS-friendly.";
      default:
        return "Generate AI-powered content for your resume.";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant={triggerVariant}
          size={triggerSize}
          className={className || "text-accent hover:text-accent/80 hover:bg-accent/10"}
        >
          <Sparkles className="h-4 w-4 mr-1" />
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Content Generator
          </DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="job-description" className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              Target Job Description
              <span className="text-xs text-muted-foreground">(Optional but recommended)</span>
            </Label>
            <Textarea
              id="job-description"
              placeholder="Paste the job description you're applying for to get tailored content with relevant keywords..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[150px] resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Adding a job description helps generate content with relevant keywords for better ATS matching.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isGenerating}>
            Cancel
          </Button>
          <Button onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AIGenerateDialog;
