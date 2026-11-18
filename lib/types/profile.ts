export type EvidenceLevel =
  | "professional"
  | "academic"
  | "personal_project"
  | "coursework"
  | "theoretical"
  | "learning";

export type CareerCategory =
  | "data_analyst"
  | "data_scientist"
  | "ai_ml_engineer"
  | "software_engineer";

export type TargetCountry = "uk" | "usa" | "india";

export interface ContactInfo {
  fullName: string;
  professionalTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedInUrl: string;
  gitHubUrl: string;
  portfolioUrl: string;
  additionalLinks?: { label: string; url: string }[];
}

export interface EmploymentItem {
  id: string;
  company: string;
  jobTitle: string;
  employmentType: "Full-time" | "Part-time" | "Contract" | "Internship" | "Freelance";
  location: string;
  startDate: string; // YYYY-MM
  endDate: string; // YYYY-MM or 'Present'
  isCurrent: boolean;
  overview: string;
  responsibilities: {
    id: string;
    text: string;
    evidenceLevel: EvidenceLevel;
    impactMetric?: string;
  }[];
  technologiesUsed: string[];
}

export interface SkillItem {
  id: string;
  name: string;
  category:
    | "programming_language"
    | "framework"
    | "database"
    | "cloud"
    | "data_analytics"
    | "general_technical"
    | "soft_skill";
  proficiency: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  evidenceLevel: EvidenceLevel;
  yearsOfExperience?: number;
  notes?: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  grade?: string;
  startDate: string;
  endDate: string;
  location: string;
  keyModules: string[];
  dissertationTitle?: string;
  achievements?: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  skillsCovered: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  type: "professional" | "academic" | "personal";
  role: string;
  startDate: string;
  endDate?: string;
  overview: string;
  responsibilities: string[];
  measurableOutcomes: string[];
  technologies: string[];
  projectUrl?: string;
  githubUrl?: string;
  evidenceLevel: EvidenceLevel;
}

export interface AchievementItem {
  id: string;
  title: string;
  context: string;
  date: string;
  quantifiedResult?: string;
  category: "workplace" | "academic" | "competition" | "open_source";
  evidenceLevel: EvidenceLevel;
}

export interface TrainingItem {
  id: string;
  title: string;
  provider: string;
  completionDate: string;
  hoursOrDuration?: string;
  skillsGained: string[];
}

export interface AdditionalExperienceItem {
  id: string;
  title: string;
  organization: string;
  role: string;
  dateRange: string;
  description: string;
  evidenceLevel: EvidenceLevel;
}

export interface MasterProfile {
  version: string;
  updatedAt: string;
  contact: ContactInfo;
  professionalSummary: {
    baseText: string;
    highlights: string[];
  };
  employmentHistory: EmploymentItem[];
  skills: SkillItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
  projects: ProjectItem[];
  achievements: AchievementItem[];
  trainings: TrainingItem[];
  additionalExperience: AdditionalExperienceItem[];
}
