export type AssistantRole = "user" | "assistant" | "system";

export interface AssistantMessage {
  id: string;
  role: AssistantRole;
  content: string;
  timestamp: string;
  suggestedPrompts?: string[];
  actionType?:
    | "resume_review"
    | "resume_rewrite"
    | "suitability_assessment"
    | "skills_gap"
    | "interview_prep"
    | "mock_interview"
    | "cover_letter"
    | "linkedin_opt"
    | "salary_research"
    | "career_plan";
}

export interface AssistantConversation {
  id: string;
  title: string;
  messages: AssistantMessage[];
  createdAt: string;
  updatedAt: string;
  contextJobTitle?: string;
  contextCompany?: string;
}
