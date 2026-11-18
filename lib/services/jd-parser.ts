import { ParsedJobDescription, JobRequirement } from "../types/job";

// Known technology dictionaries for high-precision extraction
const TECH_DICTIONARY = [
  { name: "SQL", category: "database" as const },
  { name: "Python", category: "technical_skill" as const },
  { name: "Power BI", category: "technical_skill" as const },
  { name: "Tableau", category: "technical_skill" as const },
  { name: "DAX", category: "technical_skill" as const },
  { name: "Power Query", category: "technical_skill" as const },
  { name: "Pandas", category: "technical_skill" as const },
  { name: "NumPy", category: "technical_skill" as const },
  { name: "C#", category: "technical_skill" as const },
  { name: ".NET Core", category: "framework" as const },
  { name: ".NET 8", category: "framework" as const },
  { name: "ASP.NET Core", category: "framework" as const },
  { name: "Angular", category: "framework" as const },
  { name: "React", category: "framework" as const },
  { name: "Next.js", category: "framework" as const },
  { name: "TypeScript", category: "technical_skill" as const },
  { name: "JavaScript", category: "technical_skill" as const },
  { name: "SQL Server", category: "database" as const },
  { name: "PostgreSQL", category: "database" as const },
  { name: "MySQL", category: "database" as const },
  { name: "Azure", category: "cloud" as const },
  { name: "AWS", category: "cloud" as const },
  { name: "GCP", category: "cloud" as const },
  { name: "Docker", category: "cloud" as const },
  { name: "Git", category: "methodology" as const },
  { name: "Agile", category: "methodology" as const },
  { name: "Scrum", category: "methodology" as const },
  { name: "Machine Learning", category: "technical_skill" as const },
  { name: "Scikit-Learn", category: "framework" as const },
  { name: "PyTorch", category: "framework" as const },
  { name: "TensorFlow", category: "framework" as const },
  { name: "REST API", category: "framework" as const },
  { name: "ETL", category: "methodology" as const },
  { name: "Data Warehousing", category: "methodology" as const },
  { name: "Excel", category: "technical_skill" as const },
  { name: "Statistics", category: "technical_skill" as const },
  { name: "Stakeholder Management", category: "soft_skill" as const },
  { name: "Communication", category: "soft_skill" as const },
  { name: "Problem Solving", category: "soft_skill" as const },
];

export function parseJobDescriptionText(
  text: string,
  overrides?: {
    jobTitle?: string;
    companyName?: string;
    location?: string;
    jobUrl?: string;
    referenceNumber?: string;
  }
): ParsedJobDescription {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  // 1. Detect Job Title if not provided
  let detectedTitle = overrides?.jobTitle || "";
  if (!detectedTitle) {
    const titleMatch = text.match(/(?:Job Title|Role|Position|Title)\s*:\s*([^\n\r]+)/i);
    if (titleMatch) {
      detectedTitle = titleMatch[1].trim();
    } else if (lines.length > 0 && lines[0].length < 80) {
      detectedTitle = lines[0];
    } else {
      detectedTitle = "Target Professional Role";
    }
  }

  // 2. Detect Company
  let detectedCompany = overrides?.companyName || "";
  if (!detectedCompany) {
    const compMatch = text.match(/(?:Company|Employer|Organisation|Organization)\s*:\s*([^\n\r]+)/i);
    if (compMatch) {
      detectedCompany = compMatch[1].trim();
    } else {
      detectedCompany = "Target Enterprise";
    }
  }

  // 3. Detect Location
  let detectedLocation = overrides?.location || "";
  if (!detectedLocation) {
    const locMatch = text.match(/(?:Location|Based in|Workplace)\s*:\s*([^\n\r]+)/i);
    if (locMatch) {
      detectedLocation = locMatch[1].trim();
    } else if (/London|UK|United Kingdom/i.test(text)) {
      detectedLocation = "London, United Kingdom";
    } else if (/United States|USA|New York|San Francisco|Remote/i.test(text)) {
      detectedLocation = "United States (or Remote)";
    } else if (/India|Bangalore|Hyderabad/i.test(text)) {
      detectedLocation = "India";
    } else {
      detectedLocation = "Hybrid / On-site";
    }
  }

  // 4. Seniority Detection
  let seniority: ParsedJobDescription["seniorityLevel"] = "Mid";
  if (/\b(lead|principal|architect|head of|director)\b/i.test(text)) {
    seniority = "Lead";
  } else if (/\b(senior|sr\.|experienced)\b/i.test(text)) {
    seniority = "Senior";
  } else if (/\b(junior|jr\.|graduate|entry[- ]level|associate)\b/i.test(text)) {
    seniority = "Junior";
  }

  // 5. Experience Years
  let expYears = 2;
  const expMatch = text.match(/(\d+)\+?\s*(?:-\s*(\d+)\s*)?years?(?:\s*of)?\s*(?:relevant|experience|commercial)/i);
  if (expMatch) {
    expYears = parseInt(expMatch[1], 10);
  }

  // 6. Section Partitioning (Mandatory vs Desirable)
  const lowerText = text.toLowerCase();
  const mandatoryKeywords = [
    "requirements",
    "required",
    "must have",
    "essential",
    "what you'll need",
    "what you will need",
    "qualifications",
    "key skills",
  ];
  const desirableKeywords = [
    "nice to have",
    "desirable",
    "preferred",
    "bonus",
    "good to have",
    "advantageous",
    "plus",
  ];

  const mandatoryReqs: JobRequirement[] = [];
  const desirableReqs: JobRequirement[] = [];
  const extractedKeywordsSet = new Set<string>();

  // Extract from tech dictionary
  TECH_DICTIONARY.forEach((tech) => {
    // Regex boundary check for exact tech keyword
    const regex = new RegExp(`\\b${tech.name.replace(".", "\\.")}\\b`, "i");
    if (regex.test(text)) {
      extractedKeywordsSet.add(tech.name);

      // Check context in text
      const index = lowerText.indexOf(tech.name.toLowerCase());
      const windowStart = Math.max(0, index - 120);
      const windowEnd = Math.min(text.length, index + 120);
      const context = text.slice(windowStart, windowEnd).replace(/\s+/g, " ");

      const isDesirable = desirableKeywords.some((dk) =>
        lowerText.slice(Math.max(0, index - 300), index).includes(dk)
      );

      const req: JobRequirement = {
        id: `req-${Math.random().toString(36).substring(2, 9)}`,
        category: tech.category,
        name: tech.name,
        isMandatory: !isDesirable,
        importance: !isDesirable ? "high" : "medium",
        contextExcerpt: context,
      };

      if (!isDesirable) {
        mandatoryReqs.push(req);
      } else {
        desirableReqs.push(req);
      }
    }
  });

  // Extract Responsibilities
  const responsibilities: string[] = [];
  lines.forEach((line) => {
    if (line.startsWith("•") || line.startsWith("-") || line.startsWith("*")) {
      const clean = line.replace(/^[•\-*]\s*/, "");
      if (clean.length > 20 && clean.length < 250) {
        responsibilities.push(clean);
      }
    }
  });

  return {
    id: `job-${Date.now()}`,
    rawText: text,
    parsedAt: new Date().toISOString(),
    jobTitle: detectedTitle,
    companyName: detectedCompany,
    location: detectedLocation,
    jobUrl: overrides?.jobUrl,
    referenceNumber: overrides?.referenceNumber,
    seniorityLevel: seniority,
    requiredExperienceYears: expYears,
    industryDomain: "Technology / Data / Software",
    overviewSummary: lines.slice(0, 3).join(" ").substring(0, 300) + "...",
    mandatoryRequirements: mandatoryReqs,
    desirableRequirements: desirableReqs,
    responsibilities: responsibilities.slice(0, 8),
    extractedKeywords: Array.from(extractedKeywordsSet),
  };
}
