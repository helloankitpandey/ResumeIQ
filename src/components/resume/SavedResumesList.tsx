import { useState } from "react";
import { Link } from "react-router-dom";
import { SavedResume, useSavedResumes } from "@/hooks/useSavedResumes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FileText, MoreVertical, Pencil, Copy, Trash2, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface SavedResumesListProps {
  resumes: SavedResume[];
  loading: boolean;
  onDelete: (id: string) => Promise<boolean>;
  onDuplicate: (resume: SavedResume) => Promise<SavedResume | null>;
}

const templateColors: Record<string, string> = {
  modern: "bg-gray-700",
  classic: "bg-amber-700",
  minimal: "bg-slate-500",
  creative: "bg-purple-600",
  executive: "bg-slate-900",
  technical: "bg-cyan-700",
};

const SavedResumesList = ({ resumes, loading, onDelete, onDuplicate }: SavedResumesListProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState<string | null>(null);
  const [duplicating, setDuplicating] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setResumeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (resumeToDelete) {
      await onDelete(resumeToDelete);
    }
    setDeleteDialogOpen(false);
    setResumeToDelete(null);
  };

  const handleDuplicate = async (resume: SavedResume) => {
    setDuplicating(resume.id);
    await onDuplicate(resume);
    setDuplicating(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (resumes.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg mb-2">No saved resumes yet</h3>
          <p className="text-muted-foreground text-center mb-4">
            Create your first resume and save it to access it anytime
          </p>
          <Link to="/builder">
            <Button>Create Resume</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {resumes.map((resume) => (
          <Card key={resume.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">{resume.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Badge 
                      variant="secondary" 
                      className={`text-xs text-white ${templateColors[resume.template] || "bg-gray-600"}`}
                    >
                      {resume.template}
                    </Badge>
                    <span className="text-xs">
                      Updated {formatDistanceToNow(new Date(resume.updated_at), { addSuffix: true })}
                    </span>
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-popover border shadow-lg">
                    <DropdownMenuItem asChild>
                      <Link to={`/builder?resume=${resume.id}`} className="flex items-center">
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDuplicate(resume)}
                      disabled={duplicating === resume.id}
                    >
                      {duplicating === resume.id ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Copy className="h-4 w-4 mr-2" />
                      )}
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDeleteClick(resume.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-3">
                {resume.resume_data.personalInfo?.name || "No name set"}
                {resume.resume_data.personalInfo?.email && (
                  <span className="block truncate">{resume.resume_data.personalInfo.email}</span>
                )}
              </div>
              <Link to={`/builder?resume=${resume.id}`}>
                <Button variant="outline" size="sm" className="w-full">
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Resume
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Resume</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this resume? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SavedResumesList;