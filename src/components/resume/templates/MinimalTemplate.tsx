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

const MinimalTemplate = ({ resumeData, sectionOrder }: Props) => {
  const { personalInfo, experience, education, skills } = resumeData;

  return (
    <div
      className="bg-white text-gray-900 min-h-full"
      style={{
        fontFamily: "'Helvetica Neue', 'Arial', sans-serif",
        padding: "0.7in 0.8in",
        fontSize: "10pt",
        lineHeight: "1.5",
      }}
    >
      {/* Header — minimal */}
      <div style={{ marginBottom: "20pt" }}>
        <h1 style={{ fontSize: "26pt", fontWeight: 300, marginBottom: "4pt", color: "#111" }}>
          {personalInfo.name || "Your Name"}
        </h1>
        <div className="flex flex-wrap" style={{ gap: "6pt", fontSize: "9pt", color: "#888" }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <><span>|</span><span>{personalInfo.phone}</span></>}
          {personalInfo.location && <><span>|</span><span>{personalInfo.location}</span></>}
        </div>
      </div>

      {sectionOrder.map((section) => {
        if (section === "summary" && personalInfo.summary) {
          return (
            <div key="summary" style={{ marginBottom: "20pt" }}>
              <p style={{ color: "#666" }}>{personalInfo.summary}</p>
            </div>
          );
        }
        if (section === "experience" && experience.length > 0) {
          return (
            <div key="experience" style={{ marginBottom: "20pt" }}>
              <SectionHeader>Experience</SectionHeader>
              <div style={{ display: "flex", flexDirection: "column", gap: "14pt" }}>
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline" style={{ marginBottom: "2pt" }}>
                      <span style={{ fontWeight: 500, color: "#111" }}>{exp.title}</span>
                      <span style={{ fontSize: "8.5pt", color: "#aaa" }}>
                        {formatDate(exp.startDate)} — {exp.current ? "Present" : formatDate(exp.endDate)}
                      </span>
                    </div>
                    <p style={{ fontSize: "9pt", color: "#888", marginBottom: "4pt" }}>
                      {exp.company}{exp.location && ` · ${exp.location}`}
                    </p>
                    {exp.description.filter((d) => d.trim()).length > 0 && (
                      <ul style={{ paddingLeft: "0" }}>
                        {exp.description.filter((d) => d.trim()).map((bullet, idx) => (
                          <li key={idx} className="flex" style={{ marginBottom: "2pt", color: "#555" }}>
                            <span style={{ marginRight: "8pt", color: "#ccc" }}>—</span><span>{bullet}</span>
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
            <div key="education" style={{ marginBottom: "20pt" }}>
              <SectionHeader>Education</SectionHeader>
              <div style={{ display: "flex", flexDirection: "column", gap: "6pt" }}>
                {education.map((edu) => (
                  <div key={edu.id} className="flex justify-between items-baseline">
                    <div>
                      <span style={{ fontWeight: 500, color: "#111" }}>{edu.degree}</span>
                      <span style={{ fontSize: "9pt", color: "#888", marginLeft: "6pt" }}>{edu.institution}</span>
                    </div>
                    <span style={{ fontSize: "8.5pt", color: "#aaa" }}>{formatDate(edu.graduationDate)}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        }
        if (section === "skills" && skills.length > 0) {
          return (
            <div key="skills" style={{ marginBottom: "20pt" }}>
              <SectionHeader>Skills</SectionHeader>
              <div className="flex flex-wrap" style={{ gap: "4pt" }}>
                {skills.map((skill) => (
                  <span key={skill} style={{
                    fontSize: "8.5pt", color: "#666",
                    background: "#f5f5f5", padding: "2pt 8pt", borderRadius: "3pt"
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
    className="uppercase"
    style={{
      fontSize: "8.5pt",
      fontWeight: 600,
      color: "#aaa",
      letterSpacing: "2px",
      marginBottom: "8pt",
    }}
  >
    {children}
  </h2>
);

export default MinimalTemplate;
