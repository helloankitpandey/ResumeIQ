import { useState } from "react";
import { useSavedResumes, SavedResume } from "@/hooks/useSavedResumes";
import { useResume } from "@/contexts/ResumeContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Save, Loader2 } from "lucide-react";

interface SaveResumeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentResumeId: string | null;
  onSaved: (resume: SavedResume) => void;
}

const SaveResumeDialog = ({
  open,
  onOpenChange,
  currentResumeId,
  onSaved,
}: SaveResumeDialogProps) => {
  const { user } = useAuth();
  const { resumeData, selectedTemplate, sectionOrder } = useResume();
  const { saveResume } = useSavedResumes();
  const [title, setTitle] = useState(
    resumeData.personalInfo.name
      ? `${resumeData.personalInfo.name}'s Resume`
      : "My Resume"
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const result = await saveResume(
        resumeData,
        selectedTemplate,
        sectionOrder,
        title,
        currentResumeId || undefined
      );

      if (result) {
        onSaved(result);
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {currentResumeId ? "Update Resume" : "Save Resume"}
          </DialogTitle>
          <DialogDescription>
            {currentResumeId
              ? "Update your saved resume with the latest changes"
              : "Save your resume to access it later from your dashboard"}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <label className="text-sm font-medium mb-2 block">Resume Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for your resume"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving || !title.trim()}>
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {currentResumeId ? "Update" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveResumeDialog;