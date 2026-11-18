export interface JobRequirement {
  id: string;
  category: "technical_skill" | "framework" | "database" | "cloud" | "methodology" | "soft_skill" | "experience" | "education";
  name: string;
  isMandatory: boolean; // Mandatory vs Desirable
  importance: "high" | "medium" | "low";
  contextExcerpt?: string;
}

export interface ParsedJobDescription {
  id: string;
  rawText: string;
  parsedAt: string;
  jobTitle: string;
  companyName: string;
  location: string;
  jobUrl?: string;
  referenceNumber?: string;
  seniorityLevel: "Junior" | "Mid" | "Senior" | "Lead" | "Principal" | "Not specified";
  requiredExperienceYears?: number;
  industryDomain?: string;
  overviewSummary: string;
  mandatoryRequirements: JobRequirement[];
  desirableRequirements: JobRequirement[];
  responsibilities: string[];
  extractedKeywords: string[];
}
