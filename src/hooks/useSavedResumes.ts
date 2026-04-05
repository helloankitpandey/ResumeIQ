/**
 * useSavedResumes Hook
 *
 * Provides CRUD operations for the `saved_resumes` table:
 *   • fetchResumes   – load all resumes for the current user
 *   • saveResume     – create or update a resume
 *   • deleteResume   – remove a resume by ID
 *   • duplicateResume – clone an existing resume
 *   • getResumeById  – fetch a single resume (used when editing from URL)
 *
 * All queries are scoped to the authenticated user via RLS.
 */

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ResumeData, ResumeTemplate } from "@/types/resume";
import { ResumeSection } from "@/contexts/ResumeContext";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";

/** Client-side representation of a saved resume */
export interface SavedResume {
  id: string;
  user_id: string;
  title: string;
  template: ResumeTemplate;
  resume_data: ResumeData & { sectionOrder?: ResumeSection[] };
  created_at: string;
  updated_at: string;
}

/**
 * Maps a raw database row to the typed SavedResume interface.
 * The `resume_data` column is stored as JSONB and needs a cast.
 */
const mapDbRowToSavedResume = (row: {
  id: string;
  user_id: string;
  title: string;
  template: string;
  resume_data: Json;
  created_at: string;
  updated_at: string;
}): SavedResume => ({
  id: row.id,
  user_id: row.user_id,
  title: row.title,
  template: row.template as ResumeTemplate,
  resume_data: row.resume_data as unknown as ResumeData & { sectionOrder?: ResumeSection[] },
  created_at: row.created_at,
  updated_at: row.updated_at,
});

export const useSavedResumes = () => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState<SavedResume[]>([]);
  const [loading, setLoading] = useState(true);

  /** Fetch every resume belonging to the current user, newest first */
  const fetchResumes = useCallback(async () => {
    if (!user) {
      setResumes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from("saved_resumes")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching resumes:", error);
      toast.error("Failed to load resumes");
    } else {
      setResumes((data || []).map(mapDbRowToSavedResume));
    }
    setLoading(false);
  }, [user]);

  // Re-fetch whenever the user changes (login / logout)
  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  /**
   * Create or update a resume.
   * If `existingId` is provided, update that row; otherwise insert a new one.
   */
  const saveResume = async (
    resumeData: ResumeData,
    template: ResumeTemplate,
    sectionOrder: ResumeSection[],
    title: string,
    existingId?: string
  ): Promise<SavedResume | null> => {
    if (!user) {
      toast.error("Please sign in to save resumes");
      return null;
    }

    // Merge section order into the JSONB payload
    const dataToSave = { ...resumeData, sectionOrder } as unknown as Json;

    if (existingId) {
      /* ---- Update existing resume ---- */
      const { data, error } = await supabase
        .from("saved_resumes")
        .update({
          title,
          template,
          resume_data: dataToSave,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingId)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating resume:", error);
        toast.error("Failed to update resume");
        return null;
      }

      toast.success("Resume updated!");
      await fetchResumes();
      return mapDbRowToSavedResume(data);
    } else {
      /* ---- Create new resume ---- */
      const { data, error } = await supabase
        .from("saved_resumes")
        .insert({
          user_id: user.id,
          title,
          template,
          resume_data: dataToSave,
        })
        .select()
        .single();

      if (error) {
        console.error("Error saving resume:", error);
        toast.error("Failed to save resume");
        return null;
      }

      toast.success("Resume saved!");
      await fetchResumes();
      return mapDbRowToSavedResume(data);
    }
  };

  /** Permanently delete a resume by its ID */
  const deleteResume = async (id: string): Promise<boolean> => {
    if (!user) return false;

    const { error } = await supabase
      .from("saved_resumes")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting resume:", error);
      toast.error("Failed to delete resume");
      return false;
    }

    toast.success("Resume deleted");
    await fetchResumes();
    return true;
  };

  /** Duplicate an existing resume with " (Copy)" appended to its title */
  const duplicateResume = async (resume: SavedResume): Promise<SavedResume | null> => {
    if (!user) return null;

    const { data, error } = await supabase
      .from("saved_resumes")
      .insert({
        user_id: user.id,
        title: `${resume.title} (Copy)`,
        template: resume.template,
        resume_data: resume.resume_data as unknown as Json,
      })
      .select()
      .single();

    if (error) {
      console.error("Error duplicating resume:", error);
      toast.error("Failed to duplicate resume");
      return null;
    }

    toast.success("Resume duplicated!");
    await fetchResumes();
    return mapDbRowToSavedResume(data);
  };

  /** Fetch a single resume by ID (used when opening the builder with ?resume=<id>) */
  const getResumeById = useCallback(async (id: string): Promise<SavedResume | null> => {
    if (!user) return null;

    const { data, error } = await supabase
      .from("saved_resumes")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching resume:", error);
      return null;
    }

    return data ? mapDbRowToSavedResume(data) : null;
  }, [user]);

  return {
    resumes,
    loading,
    fetchResumes,
    saveResume,
    deleteResume,
    duplicateResume,
    getResumeById,
  };
};
