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

const CreativeTemplate = ({ resumeData, sectionOrder }: Props) => {
  const { personalInfo, experience, education, skills } = resumeData;

  return (
    <div className="flex min-h-full" style={{ fontFamily: "'Poppins', 'Helvetica Neue', sans-serif", fontSize: "10pt", lineHeight: "1.4" }}>
      {/* Sidebar */}
      <div style={{ width: "35%", background: "#6d28d9", color: "white", padding: "24pt 16pt" }}>
        <div style={{ marginBottom: "20pt" }}>
          <div style={{
            width: "48pt", height: "48pt", borderRadius: "50%",
            background: "rgba(255,255,255,0.2)", display: "flex",
            alignItems: "center", justifyContent: "center", marginBottom: "10pt"
          }}>
            <span style={{ fontSize: "20pt", fontWeight: 700 }}>{personalInfo.name?.charAt(0) || "?"}</span>
          </div>
          <h1 style={{ fontSize: "16pt", fontWeight: 700, marginBottom: "4pt" }}>
            {personalInfo.name || "Your Name"}
          </h1>
        </div>

        {/* Contact */}
        <div style={{ marginBottom: "20pt" }}>
          <h2 style={{ fontSize: "8pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "#c4b5fd", marginBottom: "6pt" }}>Contact</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "3pt", color: "#e9d5ff", fontSize: "8.5pt" }}>
            {personalInfo.email && <p>{personalInfo.email}</p>}
            {personalInfo.phone && <p>{personalInfo.phone}</p>}
            {personalInfo.location && <p>{personalInfo.location}</p>}
            {personalInfo.linkedin && <p>{personalInfo.linkedin}</p>}
            {personalInfo.github && <p>{personalInfo.github}</p>}
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <h2 style={{ fontSize: "8pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "#c4b5fd", marginBottom: "6pt" }}>Skills</h2>
            <div className="flex flex-wrap" style={{ gap: "3pt" }}>
              {skills.map((skill) => (
                <span key={skill} style={{
                  fontSize: "8pt", background: "rgba(255,255,255,0.2)",
                  padding: "2pt 6pt", borderRadius: "3pt"
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ width: "65%", background: "white", padding: "24pt 20pt", color: "#111" }}>
        {personalInfo.summary && (
          <div style={{ marginBottom: "16pt" }}>
            <SectionHeader>About Me</SectionHeader>
            <p style={{ color: "#555" }}>{personalInfo.summary}</p>
          </div>
        )}

        {experience.length > 0 && (
          <div style={{ marginBottom: "16pt" }}>
            <SectionHeader>Experience</SectionHeader>
            <div style={{ display: "flex", flexDirection: "column", gap: "10pt" }}>
              {experience.map((exp) => (
                <div key={exp.id} style={{ borderLeft: "2px solid #ddd6fe", paddingLeft: "10pt" }}>
                  <span className="font-semibold" style={{ fontSize: "10.5pt" }}>{exp.title}</span>
                  <p style={{ color: "#6d28d9", fontSize: "9pt", fontWeight: 500 }}>{exp.company}</p>
                  <p style={{ color: "#999", fontSize: "8pt", marginBottom: "3pt" }}>
                    {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                  </p>
                  {exp.description.filter((d) => d.trim()).length > 0 && (
                    <ul style={{ paddingLeft: "0" }}>
                      {exp.description.filter((d) => d.trim()).map((bullet, idx) => (
                        <li key={idx} className="flex" style={{ marginBottom: "1pt", color: "#555" }}>
                          <span style={{ marginRight: "4pt", color: "#a78bfa" }}>›</span><span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {education.length > 0 && (
          <div>
            <SectionHeader>Education</SectionHeader>
            <div style={{ display: "flex", flexDirection: "column", gap: "6pt" }}>
              {education.map((edu) => (
                <div key={edu.id} style={{ borderLeft: "2px solid #ddd6fe", paddingLeft: "10pt" }}>
                  <span className="font-semibold">{edu.degree}</span>
                  <p style={{ color: "#6d28d9", fontSize: "9pt" }}>{edu.institution}</p>
                  <p style={{ color: "#999", fontSize: "8pt" }}>
                    {formatDate(edu.graduationDate)}{edu.gpa && ` • GPA: ${edu.gpa}`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SectionHeader = ({ children }: { children: React.ReactNode }) => (
  <h2
    className="font-bold"
    style={{
      fontSize: "11pt",
      color: "#6d28d9",
      marginBottom: "6pt",
    }}
  >
    {children}
  </h2>
);

export default CreativeTemplate;
