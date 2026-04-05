import { ResumeData } from "@/types/resume";
import { ResumeSection } from "@/contexts/ResumeContext";
import { Github, Linkedin, Globe } from "lucide-react";

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

interface Props {
  resumeData: ResumeData;
  sectionOrder: ResumeSection[];
}

const TechnicalTemplate = ({ resumeData, sectionOrder }: Props) => {
  const { personalInfo, experience, education, skills } = resumeData;

  return (
    <div className="flex min-h-full" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace", fontSize: "9.5pt", lineHeight: "1.4" }}>
      {/* Main Content - 2/3 */}
      <div style={{ width: "65%", background: "white", padding: "20pt 18pt", color: "#111", borderRight: "1px solid #e5e7eb" }}>
        <div style={{ marginBottom: "14pt" }}>
          <h1 className="font-bold" style={{ fontSize: "20pt", marginBottom: "4pt", fontFamily: "'Inter', sans-serif" }}>
            {personalInfo.name || "Your Name"}
          </h1>
          <div className="flex flex-wrap" style={{ gap: "6pt", fontSize: "8.5pt", color: "#666" }}>
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>• {personalInfo.phone}</span>}
            {personalInfo.location && <span>• {personalInfo.location}</span>}
          </div>
        </div>

        {sectionOrder.filter(s => s !== "skills").map((section) => {
          if (section === "summary" && personalInfo.summary) {
            return (
              <div key="summary" style={{ marginBottom: "14pt" }}>
                <p style={{ color: "#555", fontFamily: "'Inter', sans-serif", fontSize: "9.5pt" }}>{personalInfo.summary}</p>
              </div>
            );
          }
          if (section === "experience" && experience.length > 0) {
            return (
              <div key="experience" style={{ marginBottom: "14pt" }}>
                <SectionHeader>Work Experience</SectionHeader>
                <div style={{ display: "flex", flexDirection: "column", gap: "10pt" }}>
                  {experience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-semibold" style={{ fontSize: "10pt", fontFamily: "'Inter', sans-serif" }}>{exp.title}</span>
                          <p style={{ color: "#0891b2", fontSize: "9pt", fontWeight: 500 }}>{exp.company}</p>
                        </div>
                        <span style={{ fontSize: "8pt", color: "#999" }}>
                          {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                        </span>
                      </div>
                      {exp.description.filter((d) => d.trim()).length > 0 && (
                        <ul style={{ marginTop: "4pt", paddingLeft: "0" }}>
                          {exp.description.filter((d) => d.trim()).map((bullet, idx) => (
                            <li key={idx} className="flex" style={{ marginBottom: "2pt", color: "#555", fontFamily: "'Inter', sans-serif", fontSize: "9.5pt" }}>
                              <span style={{ marginRight: "6pt", color: "#06b6d4" }}>→</span><span>{bullet}</span>
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
              <div key="education">
                <SectionHeader>Education</SectionHeader>
                <div style={{ display: "flex", flexDirection: "column", gap: "6pt" }}>
                  {education.map((edu) => (
                    <div key={edu.id} className="flex justify-between items-start">
                      <div>
                        <span className="font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>{edu.degree}</span>
                        <p style={{ color: "#0891b2", fontSize: "9pt" }}>{edu.institution}</p>
                      </div>
                      <span style={{ fontSize: "8pt", color: "#999" }}>{formatDate(edu.graduationDate)}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>

      {/* Sidebar - 1/3 */}
      <div style={{ width: "35%", background: "#ecfeff", padding: "20pt 16pt" }}>
        {skills.length > 0 && (
          <div style={{ marginBottom: "16pt" }}>
            <h2 className="font-bold uppercase" style={{ fontSize: "8.5pt", color: "#155e75", letterSpacing: "1.5px", marginBottom: "8pt" }}>
              Technical Skills
            </h2>
            <div className="flex flex-wrap" style={{ gap: "3pt" }}>
              {skills.map((skill) => (
                <span key={skill} style={{
                  fontSize: "8pt", background: "#cffafe", color: "#155e75",
                  padding: "2pt 6pt", borderRadius: "3pt", fontWeight: 500
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {(personalInfo.github || personalInfo.linkedin || personalInfo.website) && (
          <div>
            <h2 className="font-bold uppercase" style={{ fontSize: "8.5pt", color: "#155e75", letterSpacing: "1.5px", marginBottom: "8pt" }}>
              Links
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "4pt" }}>
              {personalInfo.github && (
                <p className="flex items-center gap-1" style={{ fontSize: "8.5pt", color: "#0891b2" }}>
                  <Github className="h-3 w-3" /> {personalInfo.github}
                </p>
              )}
              {personalInfo.linkedin && (
                <p className="flex items-center gap-1" style={{ fontSize: "8.5pt", color: "#0891b2" }}>
                  <Linkedin className="h-3 w-3" /> {personalInfo.linkedin}
                </p>
              )}
              {personalInfo.website && (
                <p className="flex items-center gap-1" style={{ fontSize: "8.5pt", color: "#0891b2" }}>
                  <Globe className="h-3 w-3" /> {personalInfo.website}
                </p>
              )}
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
      fontSize: "10pt",
      color: "#111",
      marginBottom: "6pt",
      display: "flex",
      alignItems: "center",
      gap: "6pt",
      fontFamily: "'Inter', sans-serif",
    }}
  >
    <span style={{ width: "6pt", height: "6pt", background: "#06b6d4", borderRadius: "50%", display: "inline-block" }} />
    {children}
  </h2>
);

export default TechnicalTemplate;
