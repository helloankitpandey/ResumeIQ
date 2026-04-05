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

const JakesTemplate = ({ resumeData, sectionOrder }: Props) => {
  const { personalInfo, experience, education, skills } = resumeData;

  return (
    <div
      className="bg-white text-black min-h-full"
      style={{
        fontFamily: "'CMU Serif', 'Computer Modern', 'Latin Modern Roman', Georgia, 'Times New Roman', serif",
        padding: "0.5in 0.5in 0.5in 0.5in",
        fontSize: "10pt",
        lineHeight: "1.3",
      }}
    >
      {/* Header — centered, bold name, contact inline */}
      <div className="text-center" style={{ marginBottom: "6pt" }}>
        <h1
          className="font-extrabold uppercase tracking-wide text-black"
          style={{ fontSize: "22pt", marginBottom: "4pt", letterSpacing: "1.5px" }}
        >
          {personalInfo.name || "Your Name"}
        </h1>
        <div className="flex flex-wrap justify-center items-center gap-0" style={{ fontSize: "9pt", color: "#333" }}>
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.phone && personalInfo.email && <span className="mx-1">|</span>}
          {personalInfo.email && (
            <a className="underline" style={{ color: "#0000EE" }}>{personalInfo.email}</a>
          )}
          {personalInfo.linkedin && (
            <>
              <span className="mx-1">|</span>
              <a className="underline" style={{ color: "#0000EE" }}>{personalInfo.linkedin}</a>
            </>
          )}
          {personalInfo.github && (
            <>
              <span className="mx-1">|</span>
              <a className="underline" style={{ color: "#0000EE" }}>{personalInfo.github}</a>
            </>
          )}
          {personalInfo.website && personalInfo.website.trim() !== "NA" && (
            <>
              <span className="mx-1">|</span>
              <a className="underline" style={{ color: "#0000EE" }}>{personalInfo.website}</a>
            </>
          )}
        </div>
      </div>

      {/* Thick horizontal rule */}
      <hr style={{ borderTop: "2px solid black", margin: "2pt 0 8pt 0" }} />

      {sectionOrder.map((section) => {
        if (section === "summary" && personalInfo.summary) {
          return (
            <div key="summary" style={{ marginBottom: "8pt" }}>
              <SectionHeader>Summary</SectionHeader>
              <p style={{ fontSize: "10pt", color: "#222" }}>{personalInfo.summary}</p>
            </div>
          );
        }
        if (section === "education" && education.length > 0) {
          return (
            <div key="education" style={{ marginBottom: "8pt" }}>
              <SectionHeader>Education</SectionHeader>
              <div style={{ display: "flex", flexDirection: "column", gap: "4pt" }}>
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold" style={{ fontSize: "10.5pt" }}>{edu.institution || "Institution"}</span>
                      <span style={{ fontSize: "9pt", color: "#444" }}>{edu.location}</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="italic" style={{ fontSize: "10pt" }}>
                        {edu.degree || "Degree"}{edu.gpa ? `, GPA: ${edu.gpa}` : ""}
                      </span>
                      <span style={{ fontSize: "9pt", color: "#444" }}>{formatDate(edu.graduationDate)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }
        if (section === "experience" && experience.length > 0) {
          return (
            <div key="experience" style={{ marginBottom: "8pt" }}>
              <SectionHeader>Experience</SectionHeader>
              <div style={{ display: "flex", flexDirection: "column", gap: "6pt" }}>
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold" style={{ fontSize: "10.5pt" }}>{exp.title || "Title"}</span>
                      <span style={{ fontSize: "9pt", color: "#444" }}>
                        {formatDate(exp.startDate)} -- {exp.current ? "Present" : formatDate(exp.endDate)}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="italic" style={{ fontSize: "10pt" }}>{exp.company || "Company"}</span>
                      <span style={{ fontSize: "9pt", color: "#444" }}>{exp.location}</span>
                    </div>
                    {exp.description.filter((d) => d.trim()).length > 0 && (
                      <ul style={{ marginTop: "3pt", paddingLeft: "16pt", listStyleType: "disc" }}>
                        {exp.description.filter((d) => d.trim()).map((bullet, idx) => (
                          <li key={idx} style={{ fontSize: "10pt", marginBottom: "1pt", color: "#222" }}>
                            {bullet}
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
        if (section === "skills" && skills.length > 0) {
          return (
            <div key="skills" style={{ marginBottom: "8pt" }}>
              <SectionHeader>Technical Skills</SectionHeader>
              <p style={{ fontSize: "10pt", color: "#222" }}>
                <span className="font-bold">Skills: </span>
                {skills.join(", ")}
              </p>
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
    className="font-extrabold uppercase tracking-wider text-black"
    style={{
      fontSize: "11pt",
      borderBottom: "1.5px solid black",
      paddingBottom: "1pt",
      marginBottom: "4pt",
      letterSpacing: "1px",
    }}
  >
    {children}
  </h2>
);

export default JakesTemplate;
