import { ResumeData } from "@/types/resume";
import { ResumeSection } from "@/contexts/ResumeContext";

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

interface Props {
  resumeData: ResumeData;
  sectionOrder: ResumeSection[];
}

const ExecutiveTemplate = ({ resumeData, sectionOrder }: Props) => {
  const { personalInfo, experience, education, skills } = resumeData;

  return (
    <div className="bg-white min-h-full" style={{ fontFamily: "'Georgia', 'Palatino', serif", fontSize: "10.5pt", lineHeight: "1.4" }}>
      {/* Dark header banner */}
      <div style={{ background: "#1e293b", color: "white", padding: "20pt 24pt" }}>
        <h1 style={{ fontSize: "22pt", fontWeight: 700, letterSpacing: "0.5px", marginBottom: "6pt" }}>
          {personalInfo.name || "Your Name"}
        </h1>
        <div className="flex flex-wrap" style={{ gap: "12pt", fontSize: "9pt", color: "#94a3b8" }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "20pt 24pt", color: "#111" }}>
        {sectionOrder.map((section) => {
          if (section === "summary" && personalInfo.summary) {
            return (
              <div key="summary" style={{ marginBottom: "16pt", borderLeft: "3px solid #1e293b", paddingLeft: "12pt" }}>
                <SectionHeader>Executive Summary</SectionHeader>
                <p style={{ color: "#444" }}>{personalInfo.summary}</p>
              </div>
            );
          }
          if (section === "experience" && experience.length > 0) {
            return (
              <div key="experience" style={{ marginBottom: "16pt" }}>
                <SectionHeader>Professional Experience</SectionHeader>
                <div style={{ display: "flex", flexDirection: "column", gap: "12pt" }}>
                  {experience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-bold" style={{ fontSize: "10.5pt" }}>{exp.title}</span>
                          <p style={{ color: "#475569", fontWeight: 500, fontSize: "9.5pt" }}>{exp.company}</p>
                        </div>
                        <span style={{
                          fontSize: "8pt", color: "#64748b",
                          background: "#f1f5f9", padding: "2pt 8pt", borderRadius: "3pt"
                        }}>
                          {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                        </span>
                      </div>
                      {exp.description.filter((d) => d.trim()).length > 0 && (
                        <ul style={{ marginTop: "4pt", paddingLeft: "0" }}>
                          {exp.description.filter((d) => d.trim()).map((bullet, idx) => (
                            <li key={idx} className="flex" style={{ marginBottom: "2pt", color: "#444" }}>
                              <span style={{ marginRight: "6pt", color: "#94a3b8" }}>■</span><span>{bullet}</span>
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
              <div key="education" style={{ marginBottom: "16pt" }}>
                <SectionHeader>Education</SectionHeader>
                <div style={{ display: "flex", flexDirection: "column", gap: "6pt" }}>
                  {education.map((edu) => (
                    <div key={edu.id}>
                      <span className="font-semibold">{edu.degree}</span>
                      <p style={{ color: "#64748b", fontSize: "9pt" }}>{edu.institution}</p>
                      <p style={{ color: "#94a3b8", fontSize: "8.5pt" }}>
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
              <div key="skills" style={{ marginBottom: "16pt" }}>
                <SectionHeader>Core Competencies</SectionHeader>
                <div className="flex flex-wrap" style={{ gap: "4pt" }}>
                  {skills.map((skill) => (
                    <span key={skill} style={{
                      fontSize: "9pt", background: "#f1f5f9", color: "#475569",
                      padding: "2pt 8pt", borderRadius: "3pt"
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
    </div>
  );
};

const SectionHeader = ({ children }: { children: React.ReactNode }) => (
  <h2
    className="font-bold uppercase"
    style={{
      fontSize: "9.5pt",
      color: "#1e293b",
      letterSpacing: "1px",
      borderBottom: "2px solid #1e293b",
      paddingBottom: "3pt",
      marginBottom: "8pt",
    }}
  >
    {children}
  </h2>
);

export default ExecutiveTemplate;
