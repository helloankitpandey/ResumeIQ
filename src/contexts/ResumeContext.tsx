/**
 * Resume Context
 *
 * Centralises the resume-editing state so every form step and
 * the live preview share the same data without prop-drilling.
 *
 * State managed here:
 *  - resumeData        – the full resume payload
 *  - selectedTemplate   – which visual template to render
 *  - currentStep        – active builder step index
 *  - sectionOrder       – drag-and-drop ordering of resume sections
 *
 * Usage:
 *   const { resumeData, updatePersonalInfo, addExperience } = useResume();
 */

import React, { createContext, useContext, useState, ReactNode } from "react";
import { ResumeData, defaultResumeData, ResumeTemplate } from "@/types/resume";

/** Identifiers for the four re-orderable resume sections */
export type ResumeSection = "summary" | "experience" | "education" | "skills";

interface ResumeContextType {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
  updatePersonalInfo: (field: keyof ResumeData["personalInfo"], value: string) => void;
  addExperience: () => void;
  updateExperience: (id: string, field: string, value: string | string[] | boolean) => void;
  removeExperience: (id: string) => void;
  addEducation: () => void;
  updateEducation: (id: string, field: string, value: string | string[]) => void;
  removeEducation: (id: string) => void;
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
  selectedTemplate: ResumeTemplate;
  setSelectedTemplate: (template: ResumeTemplate) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  sectionOrder: ResumeSection[];
  setSectionOrder: (order: ResumeSection[]) => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

/** Default ordering of resume body sections */
const defaultSectionOrder: ResumeSection[] = ["summary", "experience", "education", "skills"];

export const ResumeProvider = ({ children }: { children: ReactNode }) => {
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate>("modern");
  const [currentStep, setCurrentStep] = useState(0);
  const [sectionOrder, setSectionOrder] = useState<ResumeSection[]>(defaultSectionOrder);

  /* ---------- Personal Info ---------- */

  /** Update a single field in personalInfo by key */
  const updatePersonalInfo = (field: keyof ResumeData["personalInfo"], value: string) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  /* ---------- Experience ---------- */

  /** Append a blank experience entry */
  const addExperience = () => {
    const newExperience = {
      id: crypto.randomUUID(),
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: [""],
    };
    setResumeData((prev) => ({
      ...prev,
      experience: [...prev.experience, newExperience],
    }));
  };

  /** Update a single field on a specific experience entry */
  const updateExperience = (id: string, field: string, value: string | string[] | boolean) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  /** Remove an experience entry by its ID */
  const removeExperience = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }));
  };

  /* ---------- Education ---------- */

  /** Append a blank education entry */
  const addEducation = () => {
    const newEducation = {
      id: crypto.randomUUID(),
      degree: "",
      institution: "",
      location: "",
      graduationDate: "",
      gpa: "",
    };
    setResumeData((prev) => ({
      ...prev,
      education: [...prev.education, newEducation],
    }));
  };

  /** Update a single field on a specific education entry */
  const updateEducation = (id: string, field: string, value: string | string[]) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  /** Remove an education entry by its ID */
  const removeEducation = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  /* ---------- Skills ---------- */

  /** Add a skill if it's non-empty and not already present */
  const addSkill = (skill: string) => {
    if (skill.trim() && !resumeData.skills.includes(skill.trim())) {
      setResumeData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill.trim()],
      }));
    }
  };

  /** Remove a skill by its exact string value */
  const removeSkill = (skill: string) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  return (
    <ResumeContext.Provider
      value={{
        resumeData,
        setResumeData,
        updatePersonalInfo,
        addExperience,
        updateExperience,
        removeExperience,
        addEducation,
        updateEducation,
        removeEducation,
        addSkill,
        removeSkill,
        selectedTemplate,
        setSelectedTemplate,
        currentStep,
        setCurrentStep,
        sectionOrder,
        setSectionOrder,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

/**
 * Hook to consume the ResumeContext.
 * Throws if used outside of a `<ResumeProvider>`.
 */
export const useResume = () => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error("useResume must be used within a ResumeProvider");
  }
  return context;
};
