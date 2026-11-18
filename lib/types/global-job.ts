export type RemoteType = "Remote" | "Hybrid" | "On-site";
export type EmploymentType = "Full-time" | "Part-time" | "Contract" | "Internship" | "Placement";
export type ExperienceTier = "Entry" | "Junior" | "Mid" | "Senior" | "Lead" | "Principal";

export type ApplicationStatus = "Saved" | "Applied" | "Interviewing" | "Offered" | "Rejected";

export interface GlobalJobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  city: string;
  country: string;
  countryCode: string; // "gb" | "us" | "in" | "ca" | "au" | "de" | "nl" | "ie" | "sg"
  remoteType: RemoteType;
  employmentType: EmploymentType;
  experienceLevel: ExperienceTier;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  salaryPeriod?: "yearly" | "monthly" | "hourly";
  salaryFormatted?: string;
  description: string;
  requiredSkills: string[];
  preferredSkills?: string[];
  publicationDate: string;
  applicationDeadline?: string;
  source: string; // "Adzuna" | "USAJOBS" | "Reed" | "Direct Career Portal" | "Verified Job Aggregator"
  applicationUrl: string;
  isExpired?: boolean;
  isVerified: boolean;
}

export interface JobSearchFilters {
  query?: string;
  skills?: string[];
  company?: string;
  country?: string; // "all", "gb", "us", "in", "ca", "au", "de", "nl", "ie", "sg"
  city?: string;
  remoteType?: string; // "all", "Remote", "Hybrid", "On-site"
  experienceLevel?: string; // "all", "Junior", "Mid", "Senior", "Lead"
  employmentType?: string; // "all", "Full-time", "Contract", "Internship", "Placement"
  minSalary?: number;
  page: number;
  pageSize: number;
}

export interface JobMatchProfileResult {
  jobId: string;
  compatibilityScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  relevantExperience: string;
  recommendedProjects: string[];
  potentialWeaknesses: string[];
  recommendation:
    | "Strong Match - Apply Immediately"
    | "Good Match - Tailor Targeted Skills"
    | "Stretch Opportunity - Bridge Missing Gaps"
    | "Low Alignment";
}

export interface TrackedApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  location: string;
  country: string;
  salary?: string;
  status: ApplicationStatus;
  appliedDate?: string;
  interviewDate?: string;
  tailoredResumeId?: string;
  coverLetterText?: string;
  notes: string;
  sourceUrl: string;
  updatedAt: string;
}
