import { ResumeData, ResumeTemplate } from "@/types/resume";

interface TemplateMiniPreviewProps {
  template: ResumeTemplate;
  resumeData: ResumeData;
}

const TemplateMiniPreview = ({ template, resumeData }: TemplateMiniPreviewProps) => {
  const { personalInfo, experience, education, skills } = resumeData;
  const hasData = personalInfo.name || experience.length > 0 || education.length > 0 || skills.length > 0;

  // Show placeholder if no data
  if (!hasData) {
    return <PlaceholderPreview template={template} />;
  }

  // Render actual data based on template
  switch (template) {
    case "jakes":
      return <JakesMini data={resumeData} />;
    case "google":
      return <GoogleMini data={resumeData} />;
    case "microsoft":
      return <MicrosoftMini data={resumeData} />;
    case "harvard":
      return <HarvardMini data={resumeData} />;
    case "ats-friendly":
      return <ATSMini data={resumeData} />;
    default:
      return <ModernMini data={resumeData} />;
  }
};

// Placeholder when no data
const PlaceholderPreview = ({ template }: { template: ResumeTemplate }) => {
  const colors: Record<string, string> = {
    jakes: "bg-gray-900",
    google: "bg-blue-600",
    microsoft: "bg-emerald-600",
    harvard: "bg-red-800",
    "ats-friendly": "bg-gray-900",
    modern: "bg-gray-800",
    classic: "bg-gray-700",
    minimal: "bg-gray-400",
    creative: "bg-purple-600",
    executive: "bg-slate-900",
    technical: "bg-cyan-700",
  };

  return (
    <div className="p-3">
      <div className="text-center mb-3">
        <div className={`h-4 w-24 ${colors[template] || "bg-gray-800"} rounded mx-auto mb-2`} />
        <div className="flex justify-center gap-1">
          <div className="h-1.5 w-14 bg-gray-300 rounded" />
          <div className="h-1.5 w-10 bg-gray-300 rounded" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-2 w-16 bg-gray-400 rounded" />
        <div className="h-1.5 w-full bg-gray-200 rounded" />
        <div className="h-1.5 w-3/4 bg-gray-200 rounded" />
      </div>
    </div>
  );
};

// Jake's Resume Style Mini Preview  
const JakesMini = ({ data }: { data: ResumeData }) => (
  <div className="p-3 font-sans text-[6px] leading-tight">
    <div className="text-center mb-1.5">
      <div className="font-extrabold text-[9px] text-gray-900 uppercase tracking-wide truncate">
        {data.personalInfo.name || "Your Name"}
      </div>
      <div className="text-gray-600 truncate text-[5px]">
        {data.personalInfo.email || "email@example.com"} {data.personalInfo.phone && `· ${data.personalInfo.phone}`}
      </div>
    </div>
    <div className="border-b border-gray-900 mb-1" />
    {data.experience[0] && (
      <div className="mb-1.5">
        <div className="font-bold text-gray-900 uppercase text-[5px] border-b border-gray-400 mb-0.5">Experience</div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-900 truncate">{data.experience[0].title}</span>
        </div>
        <div className="text-gray-600 italic truncate">{data.experience[0].company}</div>
      </div>
    )}
    {data.education[0] && (
      <div>
        <div className="font-bold text-gray-900 uppercase text-[5px] border-b border-gray-400 mb-0.5">Education</div>
        <div className="text-gray-800 font-semibold truncate">{data.education[0].degree}</div>
        <div className="text-gray-600 italic truncate">{data.education[0].institution}</div>
      </div>
    )}
  </div>
);

// Google Style Mini Preview
const GoogleMini = ({ data }: { data: ResumeData }) => (
  <div className="p-3 font-sans text-[6px] leading-tight">
    <div className="text-center mb-2">
      <div className="font-bold text-[8px] text-gray-900 truncate">
        {data.personalInfo.name || "Your Name"}
      </div>
      <div className="text-gray-500 truncate">
        {data.personalInfo.email || "email@example.com"}
      </div>
    </div>
    {data.personalInfo.summary && (
      <div className="mb-2">
        <div className="font-semibold text-gray-800 mb-0.5">Summary</div>
        <div className="text-gray-600 line-clamp-2">{data.personalInfo.summary}</div>
      </div>
    )}
    {data.experience[0] && (
      <div className="mb-2">
        <div className="font-semibold text-gray-800 mb-0.5">Experience</div>
        <div className="text-gray-700 font-medium truncate">{data.experience[0].title}</div>
        <div className="text-gray-500 truncate">{data.experience[0].company}</div>
      </div>
    )}
    {data.skills.length > 0 && (
      <div className="flex flex-wrap gap-0.5">
        {data.skills.slice(0, 3).map((skill) => (
          <span key={skill} className="px-1 py-0.5 bg-blue-100 text-blue-700 rounded text-[5px]">
            {skill}
          </span>
        ))}
      </div>
    )}
  </div>
);

// Microsoft Style Mini Preview
const MicrosoftMini = ({ data }: { data: ResumeData }) => (
  <div className="p-3 font-sans text-[6px] leading-tight">
    <div className="border-l-2 border-emerald-600 pl-2 mb-2">
      <div className="font-bold text-[8px] text-gray-900 truncate">
        {data.personalInfo.name || "Your Name"}
      </div>
      <div className="text-emerald-600 truncate">
        {data.personalInfo.email || "email@example.com"}
      </div>
    </div>
    {data.experience[0] && (
      <div className="mb-2">
        <div className="font-semibold text-emerald-700 mb-0.5">Experience</div>
        <div className="text-gray-700 font-medium truncate">{data.experience[0].title}</div>
        <div className="text-gray-500 truncate">{data.experience[0].company}</div>
      </div>
    )}
    {data.skills.length > 0 && (
      <div className="flex flex-wrap gap-0.5">
        {data.skills.slice(0, 3).map((skill) => (
          <span key={skill} className="px-1 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[5px]">
            {skill}
          </span>
        ))}
      </div>
    )}
  </div>
);

// Harvard Style Mini Preview
const HarvardMini = ({ data }: { data: ResumeData }) => (
  <div className="p-3 font-serif text-[6px] leading-tight">
    <div className="text-center border-b border-red-800 pb-1.5 mb-2">
      <div className="font-bold text-[8px] text-red-900 truncate">
        {data.personalInfo.name || "Your Name"}
      </div>
      <div className="text-gray-600 truncate">
        {data.personalInfo.email || "email@example.com"}
      </div>
    </div>
    {data.education[0] && (
      <div className="mb-2">
        <div className="font-semibold text-red-800 mb-0.5">Education</div>
        <div className="text-gray-700 font-medium truncate">{data.education[0].degree}</div>
        <div className="text-gray-500 truncate">{data.education[0].institution}</div>
      </div>
    )}
    {data.experience[0] && (
      <div>
        <div className="font-semibold text-red-800 mb-0.5">Experience</div>
        <div className="text-gray-700 truncate">{data.experience[0].title}</div>
      </div>
    )}
  </div>
);

// ATS-Friendly Mini Preview
const ATSMini = ({ data }: { data: ResumeData }) => (
  <div className="p-3 font-sans text-[6px] leading-tight">
    <div className="mb-2">
      <div className="font-bold text-[8px] text-gray-900 truncate">
        {data.personalInfo.name || "Your Name"}
      </div>
      <div className="text-gray-600 truncate">
        {data.personalInfo.email} {data.personalInfo.phone && `• ${data.personalInfo.phone}`}
      </div>
    </div>
    <div className="border-t border-gray-300 pt-1.5">
      {data.experience[0] && (
        <div className="mb-1.5">
          <div className="font-semibold text-gray-700">EXPERIENCE</div>
          <div className="text-gray-800 font-medium truncate">{data.experience[0].title}</div>
          <div className="text-gray-600 truncate">{data.experience[0].company}</div>
        </div>
      )}
      {data.skills.length > 0 && (
        <div>
          <div className="font-semibold text-gray-700">SKILLS</div>
          <div className="text-gray-600 truncate">{data.skills.slice(0, 4).join(", ")}</div>
        </div>
      )}
    </div>
  </div>
);

// Modern Style Mini Preview (default)
const ModernMini = ({ data }: { data: ResumeData }) => (
  <div className="p-3 font-sans text-[6px] leading-tight">
    <div className="border-b-2 border-gray-200 pb-1.5 mb-2">
      <div className="font-bold text-[8px] text-gray-900 truncate">
        {data.personalInfo.name || "Your Name"}
      </div>
      <div className="text-gray-500 truncate">
        {data.personalInfo.email || "email@example.com"}
      </div>
    </div>
    {data.experience[0] && (
      <div className="mb-2">
        <div className="font-semibold text-gray-700 mb-0.5">Experience</div>
        <div className="text-gray-800 font-medium truncate">{data.experience[0].title}</div>
        <div className="text-gray-500 truncate">{data.experience[0].company}</div>
      </div>
    )}
    {data.skills.length > 0 && (
      <div className="flex flex-wrap gap-0.5">
        {data.skills.slice(0, 3).map((skill) => (
          <span key={skill} className="px-1 py-0.5 bg-gray-100 text-gray-700 rounded text-[5px]">
            {skill}
          </span>
        ))}
      </div>
    )}
  </div>
);

export default TemplateMiniPreview;
