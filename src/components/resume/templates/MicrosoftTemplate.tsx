import { ResumeData } from "@/types/resume";
import { ResumeSection } from "@/contexts/ResumeContext";
import { Mail, Phone, MapPin, Linkedin, Github } from "lucide-react";

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

interface Props {
  resumeData: ResumeData;
  sectionOrder: ResumeSection[];
}

const MicrosoftTemplate = ({ resumeData, sectionOrder }: Props) => {
  const { personalInfo, experience, education, skills } = resumeData;

  return (
    <div
      className="bg-white text-gray-900 min-h-full"
      style={{
        fontFamily: "'Segoe UI', 'Calibri', 'Arial', sans-serif",
        padding: "0.6in 0.7in",
        fontSize: "10pt",
        lineHeight: "1.4",
      }}
    >
      {/* Header with left accent bar */}
      <div style={{ borderLeft: "4px solid #107c41", paddingLeft: "12pt", marginBottom: "16pt" }}>
        <h1 className="font-bold text-gray-900" style={{ fontSize: "22pt", marginBottom: "4pt" }}>
          {personalInfo.name || "Your Name"}
        </h1>
        <div className="flex flex-wrap" style={{ gap: "10pt", fontSize: "9pt", color: "#555" }}>
          {personalInfo.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{personalInfo.email}</span>}
          {personalInfo.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{personalInfo.phone}</span>}
          {personalInfo.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{personalInfo.location}</span>}
        </div>
        <div className="flex flex-wrap" style={{ gap: "10pt", fontSize: "9pt", color: "#107c41", marginTop: "2pt" }}>
          {personalInfo.linkedin && <span className="flex items-center gap-1"><Linkedin className="h-3 w-3" />{personalInfo.linkedin}</span>}
          {personalInfo.github && <span className="flex items-center gap-1"><Github className="h-3 w-3" />{personalInfo.github}</span>}
        </div>
      </div>

      {sectionOrder.map((section) => {
        if (section === "summary" && personalInfo.summary) {
          return (
            <div key="summary" style={{ marginBottom: "14pt" }}>
              <SectionHeader>Professional Summary</SectionHeader>
              <p style={{ color: "#333" }}>{personalInfo.summary}</p>
            </div>
          );
        }
        if (section === "experience" && experience.length > 0) {
          return (
            <div key="experience" style={{ marginBottom: "14pt" }}>
              <SectionHeader>Professional Experience</SectionHeader>
              <div style={{ display: "flex", flexDirection: "column", gap: "10pt" }}>
                {experience.map((exp) => (
                  <div key={exp.id} style={{ borderLeft: "2px solid #c8e6c9", paddingLeft: "10pt" }}>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold" style={{ fontSize: "10.5pt" }}>{exp.title}</span>
                        <p style={{ color: "#107c41", fontWeight: 500, fontSize: "9.5pt" }}>{exp.company}</p>
                      </div>
                      <span style={{
                        fontSize: "8.5pt", color: "#666",
                        background: "#f0fdf4", padding: "1pt 6pt", borderRadius: "3pt"
                      }}>
                        {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                      </span>
                    </div>
                    {exp.description.filter((d) => d.trim()).length > 0 && (
                      <ul style={{ marginTop: "4pt", paddingLeft: "0" }}>
                        {exp.description.filter((d) => d.trim()).map((bullet, idx) => (
                          <li key={idx} className="flex" style={{ marginBottom: "2pt", color: "#333" }}>
                            <span style={{ color: "#107c41", marginRight: "6pt" }}>▸</span>
                            <span>{bullet}</span>
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
                  <div key={edu.id} style={{ borderLeft: "2px solid #c8e6c9", paddingLeft: "10pt" }}>
                    <span className="font-bold" style={{ fontSize: "10.5pt" }}>{edu.degree}</span>
                    <p style={{ color: "#107c41", fontSize: "9.5pt" }}>{edu.institution}</p>
                    <p style={{ fontSize: "8.5pt", color: "#666" }}>
                      {formatDate(edu.graduationDate)}{edu.gpa && ` • GPA: ${edu.gpa}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        }
        if (section === "skills" && skills.length > 0) {
          return (
            <div key="skills" style={{ marginBottom: "14pt" }}>
              <SectionHeader>Technical Skills</SectionHeader>
              <div className="flex flex-wrap" style={{ gap: "4pt" }}>
                {skills.map((skill) => (
                  <span key={skill} style={{
                    fontSize: "9pt", background: "#e8f5e9", color: "#1b5e20",
                    padding: "2pt 8pt", borderRadius: "3pt", fontWeight: 500
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
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
    className="font-bold"
    style={{
      fontSize: "11pt",
      color: "#107c41",
      marginBottom: "6pt",
    }}
  >
    {children}
  </h2>
);

export default MicrosoftTemplate;
