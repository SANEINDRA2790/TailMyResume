import { EvidenceLevel } from "./profile";

export type MatchStatus =
  | "Strong match"
  | "Partial match"
  | "Missing evidence"
  | "Not applicable";

export interface RequirementMatchRow {
  requirementId: string;
  requirementName: string;
  category: string;
  isMandatory: boolean;
  profileEvidence: string;
  evidenceLevel?: EvidenceLevel;
  status: MatchStatus;
  relevanceExplanation: string;
}

export interface CompatibilityAnalysis {
  overallScore: number; // 0 - 100 calculated transparently
  scoreBreakdown: {
    mandatoryScore: number;
    desirableScore: number;
    experienceScore: number;
    weights: {
      mandatoryWeight: number; // e.g. 60%
      desirableWeight: number; // e.g. 20%
      experienceWeight: number; // e.g. 20%
    };
  };
  scoringMethodology: string;
  matches: RequirementMatchRow[];
  strengths: string[];
  gaps: {
    type: "technical" | "experience" | "qualification" | "keyword";
    description: string;
    suggestion: string;
  }[];
  relevantProjects: {
    projectId: string;
    title: string;
    matchReason: string;
  }[];
  missingKeywords: string[];
  improvementAreas: string[];
}
