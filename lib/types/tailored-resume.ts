import { CareerCategory, ContactInfo, TargetCountry } from "./profile";

export type ResumeTemplateId =
  | "modern_professional"
  | "minimal_ats"
  | "corporate_executive"
  | "technical_specialist"
  | "data_analytics";

export interface TailoredSummary {
  originalText: string;
  tailoredText: string;
  alignmentRationale: string;
}

export interface TailoredBullet {
  id: string;
  originalText: string;
  tailoredText: string;
  actionVerb: string;
  quantifiedResult?: string;
  keywordsIncluded: string[];
  isRecommended: boolean;
  status: "accepted" | "rejected" | "modified";
}

export interface TailoredExperience {
  id: string;
  company: string;
  jobTitle: string;
  location: string;
  startDate: string;
  endDate: string;
  relevanceScore: number; // 0 - 100 for ranking
  bullets: TailoredBullet[];
}

export interface TailoredProject {
  id: string;
  title: string;
  role: string;
  dates: string;
  bullets: string[];
  technologies: string[];
  relevanceScore: number;
  isIncluded: boolean;
}

export interface ContentReviewQuadrant {
  recommendedContent: {
    id: string;
    section: string;
    item: string;
    reason: string;
  }[];
  lessRelevantContent: {
    id: string;
    section: string;
    item: string;
    reason: string;
    includedByDefault: boolean;
  }[];
  missingInformation: {
    id: string;
    field: string;
    promptToUser: string;
    importance: "critical" | "recommended" | "optional";
  }[];
  suggestedImprovements: {
    id: string;
    target: string;
    suggestion: string;
    suggestedAction: string;
  }[];
}

export interface TailoredResumeDocument {
  id: string;
  createdAt: string;
  updatedAt: string;
  versionNumber: number;
  label: string; // e.g. "Senior Data Analyst @ Monzo"
  targetRole: CareerCategory;
  targetCountry: TargetCountry;
  templateId: ResumeTemplateId;
  jobTitleTarget: string;
  companyTarget: string;
  
  contact: ContactInfo;
  summary: TailoredSummary;
  prioritizedSkills: {
    categoryName: string;
    skills: string[];
  }[];
  experience: TailoredExperience[];
  projects: TailoredProject[];
  education: {
    institution: string;
    degree: string;
    dates: string;
    location: string;
    details: string[];
  }[];
  certifications: string[];
  achievements: string[];
  
  reviewQuadrant: ContentReviewQuadrant;
  formatting: {
    fontSize: "small" | "medium" | "large";
    lineSpacing: "compact" | "normal" | "relaxed";
    sectionOrder: string[];
    margins: "narrow" | "normal" | "wide";
  };
}
