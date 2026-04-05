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

const GoogleTemplate = ({ resumeData, sectionOrder }: Props) => {
  const { personalInfo, experience, education, skills } = resumeData;

  return (
    <div
      className="bg-white text-gray-900 min-h-full"
      style={{
        fontFamily: "'Roboto', 'Arial', sans-serif",
        padding: "0.6in 0.7in",
        fontSize: "10pt",
        lineHeight: "1.4",
      }}
    >
      {/* Header */}
      <div className="text-center" style={{ marginBottom: "16pt" }}>
        <h1 className="font-bold text-gray-900" style={{ fontSize: "20pt", marginBottom: "4pt" }}>
          {personalInfo.name || "Your Name"}
        </h1>
        <div className="flex flex-wrap justify-center" style={{ fontSize: "9pt", color: "#555", gap: "4pt" }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <><span style={{ color: "#bbb" }}>|</span><span>{personalInfo.phone}</span></>}
          {personalInfo.location && <><span style={{ color: "#bbb" }}>|</span><span>{personalInfo.location}</span></>}
        </div>
        <div className="flex flex-wrap justify-center" style={{ fontSize: "9pt", color: "#1a73e8", gap: "4pt", marginTop: "2pt" }}>
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          {personalInfo.github && <><span style={{ color: "#bbb" }}>|</span><span>{personalInfo.github}</span></>}
        </div>
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
        if (section === "experience" && experience.length > 0) {
          return (
            <div key="experience" style={{ marginBottom: "12pt" }}>
              <SectionHeader>EXPERIENCE</SectionHeader>
              <div style={{ display: "flex", flexDirection: "column", gap: "10pt" }}>
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold" style={{ fontSize: "10.5pt" }}>{exp.title}</span>
                      <span style={{ fontSize: "9pt", color: "#666" }}>
                        {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                      </span>
                    </div>
                    <p style={{ color: "#555", fontSize: "9.5pt" }}>
                      {exp.company}{exp.location && `, ${exp.location}`}
                    </p>
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
        if (section === "education" && education.length > 0) {
          return (
            <div key="education" style={{ marginBottom: "12pt" }}>
              <SectionHeader>EDUCATION</SectionHeader>
              <div style={{ display: "flex", flexDirection: "column", gap: "6pt" }}>
                {education.map((edu) => (
                  <div key={edu.id} className="flex justify-between items-start">
                    <div>
                      <span className="font-bold" style={{ fontSize: "10.5pt" }}>{edu.degree}</span>
                      <p style={{ color: "#555", fontSize: "9.5pt" }}>
                        {edu.institution}{edu.gpa && ` — GPA: ${edu.gpa}`}
                      </p>
                    </div>
                    <span style={{ fontSize: "9pt", color: "#666" }}>{formatDate(edu.graduationDate)}</span>
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
              <p style={{ color: "#333" }}>{skills.join(" • ")}</p>
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
    className="font-bold text-gray-900"
    style={{
      fontSize: "10.5pt",
      borderBottom: "1px solid #dadce0",
      paddingBottom: "3pt",
      marginBottom: "6pt",
      letterSpacing: "0.5px",
    }}
  >
    {children}
  </h2>
);

export default GoogleTemplate;
