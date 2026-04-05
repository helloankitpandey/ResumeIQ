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

const HarvardTemplate = ({ resumeData, sectionOrder }: Props) => {
  const { personalInfo, experience, education, skills } = resumeData;

  return (
    <div
      className="bg-white text-gray-900 min-h-full"
      style={{
        fontFamily: "'Garamond', 'Georgia', 'Times New Roman', serif",
        padding: "0.6in 0.7in",
        fontSize: "10.5pt",
        lineHeight: "1.35",
      }}
    >
      {/* Header */}
      <div className="text-center" style={{ borderBottom: "2px solid #8b1a1a", paddingBottom: "10pt", marginBottom: "14pt" }}>
        <h1 className="font-bold" style={{ fontSize: "22pt", marginBottom: "4pt", color: "#1a1a1a" }}>
          {personalInfo.name || "Your Name"}
        </h1>
        <div className="flex flex-wrap justify-center" style={{ fontSize: "9pt", color: "#555", gap: "6pt" }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <><span>•</span><span>{personalInfo.phone}</span></>}
          {personalInfo.location && <><span>•</span><span>{personalInfo.location}</span></>}
        </div>
        {(personalInfo.linkedin || personalInfo.github) && (
          <div className="flex flex-wrap justify-center" style={{ fontSize: "9pt", color: "#666", gap: "6pt", marginTop: "2pt" }}>
            {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
            {personalInfo.github && <span>{personalInfo.github}</span>}
          </div>
        )}
      </div>

      {sectionOrder.map((section) => {
        if (section === "summary" && personalInfo.summary) {
          return (
            <div key="summary" style={{ marginBottom: "12pt" }}>
              <SectionHeader>SUMMARY</SectionHeader>
              <p style={{ color: "#333" }}>{personalInfo.summary}</p>
            </div>
          );
        }
        if (section === "education" && education.length > 0) {
          return (
            <div key="education" style={{ marginBottom: "12pt" }}>
              <SectionHeader>EDUCATION</SectionHeader>
              <div style={{ display: "flex", flexDirection: "column", gap: "8pt" }}>
                {education.map((edu) => (
                  <div key={edu.id} className="flex justify-between items-start">
                    <div>
                      <span className="font-bold" style={{ fontSize: "10.5pt" }}>{edu.institution}</span>
                      <p className="italic" style={{ color: "#444" }}>{edu.degree}</p>
                      {edu.gpa && <p style={{ fontSize: "9pt", color: "#666" }}>GPA: {edu.gpa}</p>}
                    </div>
                    <span style={{ fontSize: "9pt", color: "#666" }}>{formatDate(edu.graduationDate)}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        }
        if (section === "experience" && experience.length > 0) {
          return (
            <div key="experience" style={{ marginBottom: "12pt" }}>
              <SectionHeader>EXPERIENCE</SectionHeader>
              <div style={{ display: "flex", flexDirection: "column", gap: "10pt" }}>
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold" style={{ fontSize: "10.5pt" }}>{exp.company}</span>
                        <p className="italic" style={{ color: "#444" }}>
                          {exp.title}{exp.location && `, ${exp.location}`}
                        </p>
                      </div>
                      <span style={{ fontSize: "9pt", color: "#666" }}>
                        {formatDate(exp.startDate)} – {exp.current ? "Present" : formatDate(exp.endDate)}
                      </span>
                    </div>
                    {exp.description.filter((d) => d.trim()).length > 0 && (
                      <ul style={{ marginTop: "3pt", paddingLeft: "16pt", listStyleType: "disc" }}>
                        {exp.description.filter((d) => d.trim()).map((bullet, idx) => (
                          <li key={idx} style={{ marginBottom: "1pt", color: "#333" }}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        }
        if (section === "skills" && skills.length > 0) {
          return (
            <div key="skills" style={{ marginBottom: "12pt" }}>
              <SectionHeader>SKILLS</SectionHeader>
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
    className="font-bold uppercase"
    style={{
      fontSize: "10.5pt",
      color: "#8b1a1a",
      letterSpacing: "1px",
      marginBottom: "6pt",
    }}
  >
    {children}
  </h2>
);

export default HarvardTemplate;
