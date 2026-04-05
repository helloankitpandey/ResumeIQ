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

const ClassicTemplate = ({ resumeData, sectionOrder }: Props) => {
  const { personalInfo, experience, education, skills } = resumeData;

  return (
    <div
      className="bg-white text-gray-900 min-h-full"
      style={{
        fontFamily: "'Georgia', 'Times New Roman', 'Garamond', serif",
        padding: "0.6in 0.7in",
        fontSize: "10.5pt",
        lineHeight: "1.4",
      }}
    >
      {/* Header */}
      <div className="text-center" style={{ borderBottom: "1px solid #ccc", paddingBottom: "12pt", marginBottom: "14pt" }}>
        <h1 className="font-bold" style={{ fontSize: "24pt", marginBottom: "4pt", color: "#111" }}>
          {personalInfo.name || "Your Name"}
        </h1>
        <div className="flex justify-center flex-wrap" style={{ gap: "12pt", fontSize: "9.5pt", color: "#555" }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
      </div>

      {sectionOrder.map((section) => {
        if (section === "summary" && personalInfo.summary) {
          return (
            <div key="summary" style={{ marginBottom: "14pt" }}>
              <SectionHeader>Professional Summary</SectionHeader>
              <p className="italic" style={{ color: "#444" }}>{personalInfo.summary}</p>
            </div>
          );
        }
        if (section === "experience" && experience.length > 0) {
          return (
            <div key="experience" style={{ marginBottom: "14pt" }}>
              <SectionHeader>Professional Experience</SectionHeader>
              <div style={{ display: "flex", flexDirection: "column", gap: "12pt" }}>
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold" style={{ fontSize: "10.5pt" }}>{exp.title || "Job Title"}</span>
                      <span style={{ fontSize: "9pt", color: "#666" }}>
                        {formatDate(exp.startDate)} – {exp.current ? "Present" : formatDate(exp.endDate)}
                      </span>
                    </div>
                    <p className="italic" style={{ color: "#555", fontSize: "10pt" }}>
                      {exp.company}{exp.location && `, ${exp.location}`}
                    </p>
                    {exp.description.filter((d) => d.trim()).length > 0 && (
                      <ul style={{ marginTop: "4pt", paddingLeft: "16pt", listStyleType: "disc" }}>
                        {exp.description.filter((d) => d.trim()).map((bullet, idx) => (
                          <li key={idx} style={{ marginBottom: "2pt", color: "#333" }}>{bullet}</li>
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
              <div style={{ display: "flex", flexDirection: "column", gap: "8pt" }}>
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold" style={{ fontSize: "10.5pt" }}>{edu.degree || "Degree"}</span>
                      <span style={{ fontSize: "9pt", color: "#666" }}>{formatDate(edu.graduationDate)}</span>
                    </div>
                    <p className="italic" style={{ color: "#555" }}>
                      {edu.institution}{edu.location && `, ${edu.location}`}{edu.gpa && ` — GPA: ${edu.gpa}`}
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
              <SectionHeader>Skills</SectionHeader>
              <p style={{ color: "#333" }}>{skills.join(", ")}</p>
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
      fontSize: "12pt",
      color: "#111",
      borderBottom: "1px solid #ddd",
      paddingBottom: "3pt",
      marginBottom: "8pt",
    }}
  >
    {children}
  </h2>
);

export default ClassicTemplate;
