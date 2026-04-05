/**
 * Resume Data Types
 *
 * Defines the shape of every resume and its constituent sections.
 * These interfaces are consumed by the ResumeContext, form components,
 * template renderers, and the save/load hooks.
 */

/** Contact details and professional summary entered in Step 1 */
export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
  summary: string;
}

/** A single work-experience entry */
export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  /** If true, "endDate" is ignored and "Present" is shown */
  current: boolean;
  /** Bullet-point descriptions — one string per bullet */
  description: string[];
}

/** A single education entry */
export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  graduationDate: string;
  gpa?: string;
}

/** Complete resume payload persisted to the database */
export interface ResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string[];
}

/** Blank slate used when creating a brand-new resume */
export const defaultResumeData: ResumeData = {
  personalInfo: {
    name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    website: "",
    summary: "",
  },
  experience: [],
  education: [],
  skills: [],
};

/**
 * All available template identifiers.
 * Each maps to a matching component under `components/resume/templates/`.
 */
export type ResumeTemplate =
  | "modern"
  | "classic"
  | "minimal"
  | "creative"
  | "executive"
  | "technical"
  | "google"
  | "microsoft"
  | "harvard"
  | "ats-friendly"
  | "jakes";
