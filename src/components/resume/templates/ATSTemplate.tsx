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

const ATSTemplate = ({ resumeData, sectionOrder }: Props) => {
  const { personalInfo, experience, education, skills } = resumeData;

  return (
    <div
      className="bg-white text-black min-h-full"
      style={{
        fontFamily: "'Arial', 'Helvetica', sans-serif",
        padding: "0.5in 0.6in",
        fontSize: "10pt",
        lineHeight: "1.4",
      }}
    >
      {/* Header — simple, ATS-friendly */}
      <div style={{ marginBottom: "12pt" }}>
        <h1 className="font-bold" style={{ fontSize: "20pt", marginBottom: "4pt" }}>
          {personalInfo.name || "Your Name"}
        </h1>
        <div style={{ fontSize: "9pt", color: "#444" }}>
          {[personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.linkedin, personalInfo.github]
            .filter(Boolean)
            .join(" | ")}
        </div>
      </div>

      {sectionOrder.map((section) => {
        if (section === "summary" && personalInfo.summary) {
          return (
            <div key="summary" style={{ marginBottom: "10pt" }}>
              <SectionHeader>PROFESSIONAL SUMMARY</SectionHeader>
              <p style={{ color: "#222" }}>{personalInfo.summary}</p>
            </div>
          );
        }
        if (section === "experience" && experience.length > 0) {
          return (
            <div key="experience" style={{ marginBottom: "10pt" }}>
              <SectionHeader>WORK EXPERIENCE</SectionHeader>
              <div style={{ display: "flex", flexDirection: "column", gap: "8pt" }}>
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <p className="font-bold" style={{ fontSize: "10.5pt" }}>{exp.title}</p>
                    <p style={{ color: "#444" }}>{exp.company}{exp.location && ` | ${exp.location}`}</p>
                    <p style={{ fontSize: "9pt", color: "#666" }}>
                      {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                    </p>
                    {exp.description.filter((d) => d.trim()).length > 0 && (
                      <ul style={{ marginTop: "3pt", paddingLeft: "0" }}>
                        {exp.description.filter((d) => d.trim()).map((bullet, idx) => (
                          <li key={idx} style={{ marginBottom: "1pt", color: "#222" }}>• {bullet}</li>
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
            <div key="education" style={{ marginBottom: "10pt" }}>
              <SectionHeader>EDUCATION</SectionHeader>
              <div style={{ display: "flex", flexDirection: "column", gap: "6pt" }}>
                {education.map((edu) => (
                  <div key={edu.id}>
                    <p className="font-bold" style={{ fontSize: "10.5pt" }}>{edu.degree}</p>
                    <p style={{ color: "#444" }}>{edu.institution}{edu.gpa && ` | GPA: ${edu.gpa}`}</p>
                    <p style={{ fontSize: "9pt", color: "#666" }}>{formatDate(edu.graduationDate)}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        }
        if (section === "skills" && skills.length > 0) {
          return (
            <div key="skills" style={{ marginBottom: "10pt" }}>
              <SectionHeader>SKILLS</SectionHeader>
              <p style={{ color: "#222" }}>{skills.join(", ")}</p>
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
      color: "#000",
      borderBottom: "1px solid #999",
      paddingBottom: "2pt",
      marginBottom: "6pt",
    }}
  >
    {children}
  </h2>
);

export default ATSTemplate;
