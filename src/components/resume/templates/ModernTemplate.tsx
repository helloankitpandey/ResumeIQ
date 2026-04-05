import { ResumeData } from "@/types/resume";
import { ResumeSection } from "@/contexts/ResumeContext";
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

interface Props {
  resumeData: ResumeData;
  sectionOrder: ResumeSection[];
}

const ModernTemplate = ({ resumeData, sectionOrder }: Props) => {
  const { personalInfo, experience, education, skills } = resumeData;

  return (
    <div
      className="bg-white text-gray-900 min-h-full"
      style={{
        fontFamily: "'Inter', 'Helvetica Neue', 'Arial', sans-serif",
        padding: "0.6in 0.7in",
        fontSize: "10pt",
        lineHeight: "1.4",
      }}
    >
      {/* Header */}
      <div style={{ borderBottom: "2px solid #e5e7eb", paddingBottom: "12pt", marginBottom: "14pt" }}>
        <h1 className="font-bold" style={{ fontSize: "22pt", marginBottom: "6pt", color: "#111" }}>
          {personalInfo.name || "Your Name"}
        </h1>
        <div className="flex flex-wrap" style={{ gap: "10pt", fontSize: "9pt", color: "#666" }}>
          {personalInfo.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{personalInfo.email}</span>}
          {personalInfo.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{personalInfo.phone}</span>}
          {personalInfo.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{personalInfo.location}</span>}
        </div>
        <div className="flex flex-wrap" style={{ gap: "10pt", fontSize: "9pt", color: "#2563eb", marginTop: "2pt" }}>
          {personalInfo.linkedin && <span className="flex items-center gap-1"><Linkedin className="h-3 w-3" />{personalInfo.linkedin}</span>}
          {personalInfo.github && <span className="flex items-center gap-1"><Github className="h-3 w-3" />{personalInfo.github}</span>}
          {personalInfo.website && <span className="flex items-center gap-1"><Globe className="h-3 w-3" />{personalInfo.website}</span>}
        </div>
      </div>

      {sectionOrder.map((section) => {
        if (section === "summary" && personalInfo.summary) {
          return (
            <div key="summary" style={{ marginBottom: "14pt" }}>
              <SectionHeader>Professional Summary</SectionHeader>
              <p style={{ color: "#444" }}>{personalInfo.summary}</p>
            </div>
          );
        }
        if (section === "experience" && experience.length > 0) {
          return (
            <div key="experience" style={{ marginBottom: "14pt" }}>
              <SectionHeader>Experience</SectionHeader>
              <div style={{ display: "flex", flexDirection: "column", gap: "10pt" }}>
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-semibold" style={{ fontSize: "10.5pt" }}>{exp.title || "Job Title"}</span>
                        <p style={{ color: "#666", fontSize: "9.5pt" }}>{exp.company}{exp.location && ` • ${exp.location}`}</p>
                      </div>
                      <span style={{ fontSize: "8.5pt", color: "#888", whiteSpace: "nowrap" }}>
                        {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                      </span>
                    </div>
                    {exp.description.filter((d) => d.trim()).length > 0 && (
                      <ul style={{ marginTop: "3pt", paddingLeft: "0" }}>
                        {exp.description.filter((d) => d.trim()).map((bullet, idx) => (
                          <li key={idx} className="flex" style={{ marginBottom: "1pt", color: "#444" }}>
                            <span style={{ marginRight: "6pt" }}>•</span><span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        }
        if (section === "education" && education.length > 0) {
          return (
            <div key="education" style={{ marginBottom: "14pt" }}>
              <SectionHeader>Education</SectionHeader>
              <div style={{ display: "flex", flexDirection: "column", gap: "6pt" }}>
                {education.map((edu) => (
                  <div key={edu.id} className="flex justify-between items-start">
                    <div>
                      <span className="font-semibold" style={{ fontSize: "10.5pt" }}>{edu.degree || "Degree"}</span>
                      <p style={{ color: "#666", fontSize: "9.5pt" }}>
                        {edu.institution}{edu.location && ` • ${edu.location}`}{edu.gpa && ` • GPA: ${edu.gpa}`}
                      </p>
                    </div>
                    <span style={{ fontSize: "8.5pt", color: "#888" }}>{formatDate(edu.graduationDate)}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        }
        if (section === "skills" && skills.length > 0) {
          return (
            <div key="skills" style={{ marginBottom: "14pt" }}>
              <SectionHeader>Skills</SectionHeader>
              <p style={{ color: "#444" }}>{skills.join(" • ")}</p>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

const SectionHeader = ({ children }: { children: React.ReactNode }) => (
  <h2
    className="font-bold uppercase"
    style={{
      fontSize: "9.5pt",
      color: "#111",
      letterSpacing: "1px",
      marginBottom: "6pt",
    }}
  >
    {children}
  </h2>
);

export default ModernTemplate;
