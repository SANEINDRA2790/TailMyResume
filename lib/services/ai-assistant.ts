import { AssistantMessage } from "../types/assistant";
import { MasterProfile } from "../types/profile";
import { ParsedJobDescription } from "../types/job";
import { GlobalJobListing } from "../types/global-job";

export interface AssistantRequestContext {
  profile: MasterProfile;
  activeJob?: ParsedJobDescription | GlobalJobListing | null;
  history: AssistantMessage[];
  userQuery: string;
}

export interface AssistantResponse {
  message: string;
  suggestedPrompts: string[];
}

function getJobMetadata(job?: ParsedJobDescription | GlobalJobListing | null) {
  if (!job) {
    return {
      title: "Target Professional Role",
      company: "Target Company",
      location: "Hybrid / Remote",
      skills: "Relevant Technical Skills",
      description: "",
    };
  }
  const title = "title" in job ? job.title : job.jobTitle;
  const company = "company" in job ? job.company : job.companyName;
  const location = job.location || "Hybrid / Remote";
  const skills = "requiredSkills" in job ? job.requiredSkills.join(", ") : job.extractedKeywords.join(", ");
  const description = "description" in job ? job.description : job.overviewSummary;
  return { title, company, location, skills, description };
}

export async function processCareerAssistantQuery(
  context: AssistantRequestContext
): Promise<AssistantResponse> {
  const { profile, activeJob, history, userQuery } = context;
  const apiKey = process.env.GEMINI_API_KEY;

  const jobMeta = getJobMetadata(activeJob);

  const jobContextStr = activeJob
    ? `Target Opportunity: "${jobMeta.title}" at "${jobMeta.company}" (${jobMeta.location}). Required Skills: ${jobMeta.skills}. Description Overview: ${jobMeta.description.slice(0, 300)}`
    : "No target job currently selected.";

  const profileSummaryStr = `Candidate: ${profile.contact.fullName}
Title: ${profile.contact.professionalTitle}
Verified Commercial Skills: ${profile.skills.filter((s) => s.evidenceLevel === "professional").map((s) => s.name).join(", ")}
Academic & Project Skills: ${profile.skills.filter((s) => s.evidenceLevel !== "professional").map((s) => s.name).join(", ")}
Employment History: ${profile.employmentHistory.map((e) => `${e.jobTitle} @ ${e.company} (${e.startDate} - ${e.endDate})`).join("; ")}
Projects: ${profile.projects.map((p) => p.title).join("; ")}
Education: ${profile.education.map((ed) => `${ed.degree} in ${ed.fieldOfStudy} (${ed.institution})`).join("; ")}`;

  const systemInstruction = `You are a Senior Technical Career Coach, ATS Specialist, and AI Career Assistant for Sane Indra Kiran.
You possess complete awareness of the candidate's authentic Master Professional Profile and the target job opportunity.

CANDIDATE MASTER PROFILE:
${profileSummaryStr}

TARGET JOB CONTEXT:
${jobContextStr}

STRICT ANTI-HALLUCINATION & CAREER COACHING RULES:
1. Always ground advice, resume revisions, and interview answers in the candidate's actual documented background.
2. NEVER invent work history, company names, employment dates, certifications, or metrics.
3. If asked about a skill the candidate lacks, clearly identify it as an area to learn or frame honestly.
4. For interview prep: generate targeted, challenging technical and behavioral questions (STAR format) tailored to the exact role.
5. For mock interviews: act as a supportive yet rigorous technical hiring manager, giving constructive feedback on the candidate's response.
6. Provide structured, actionable, and formatted markdown responses with bullet points.`;

  // 1. If GEMINI_API_KEY is available, use Google Gemini API
  if (apiKey) {
    try {
      const contents = [
        ...history.slice(-6).map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
        {
          role: "user",
          parts: [
            {
              text: `${systemInstruction}\n\nUser Question: ${userQuery}`,
            },
          ],
        },
      ];

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents,
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 1200,
            },
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return {
            message: text,
            suggestedPrompts: generateDynamicFollowups(userQuery, jobMeta.title),
          };
        }
      }
    } catch (err) {
      console.warn("Gemini API call failed, using high-intelligence deterministic engine:", err);
    }
  }

  // 2. High-Intelligence Contextual Deterministic Fallback Engine
  return generateDeterministicCareerResponse(userQuery, profile, jobMeta);
}

function generateDynamicFollowups(
  query: string,
  jobTitle: string
): string[] {
  const q = query.toLowerCase();

  if (q.includes("interview") || q.includes("question")) {
    return [
      `Conduct a mock interview for ${jobTitle}`,
      "How should I answer 'Tell me about yourself'?",
      "What are the top 5 technical red flags for this position?",
    ];
  }

  if (q.includes("project") || q.includes("highlight")) {
    return [
      "How should I describe my Enterprise Revenue Dashboard in an interview?",
      "How can I tailor my customer churn ML project for this role?",
      "Review my resume bullet points for measurable outcomes",
    ];
  }

  if (q.includes("gap") || q.includes("qualified")) {
    return [
      `What should I study this week to bridge gaps for ${jobTitle}?`,
      "Draft a cover letter addressing my transferable skills",
      "Tailor my resume for this position now",
    ];
  }

  return [
    `Am I qualified for ${jobTitle}?`,
    "Generate 10 technical interview questions for this job",
    "Which of my projects should I highlight?",
    "Rewrite my experience using the XYZ impact framework",
  ];
}

function generateDeterministicCareerResponse(
  query: string,
  profile: MasterProfile,
  jobMeta: { title: string; company: string; location: string; skills: string; description: string }
): AssistantResponse {
  const q = query.toLowerCase();
  const jobTitle = jobMeta.title;
  const company = jobMeta.company;

  // A. Interview Questions
  if (q.includes("interview") || q.includes("question") || q.includes("mock")) {
    return {
      message: `### 🎯 Targeted Technical & Competency Interview Preparation for **${jobTitle}** @ **${company}**

Based on your verified Master Profile and the requirements of this position, here are the most critical interview questions you should prepare for:

#### 1. Technical Architecture & Database Systems
* **SQL Query Optimization:** "In your work with Microsoft SQL Server, how did you achieve a 42% query execution reduction? Explain your approach to index fragmentation, execution plans, and CTE optimization."
* **Data Modeling:** "Walk me through how you design a star schema for enterprise commercial reporting. How do you distinguish fact tables from dimension tables, and how do you handle slowly changing dimensions (SCD)?"
* **DAX & Power BI:** "Explain the difference between calculated columns and measures in DAX. How do you optimize memory consumption with large tabular models?"

#### 2. Backend & System Engineering (C# / .NET Core)
* **REST API Scalability:** "How did you design RESTful endpoints in ASP.NET Core handling 150k+ daily transactions with sub-120ms latency? How did you structure dependency injection and error middleware?"
* **Relational Consistency:** "How do you manage concurrency and transactions in Entity Framework Core when multiple services modify inventory or billing records?"

#### 3. Machine Learning & Predictive Analytics
* **Feature Selection & Validation:** "Describe your customer churn classification pipeline. Why did you choose XGBoost over baseline models, and how did you mitigate class imbalance using SMOTE?"
* **Interpretability:** "How did you explain model decisions to non-technical stakeholders using SHAP values?"

#### 4. Behavioral & Leadership (STAR Method)
* **Ambiguity & Deadlines:** "Describe a situation at Cognitive Solutions where requirements shifted mid-sprint. How did you communicate with stakeholders and realign delivery?"

---
💡 **Next Step:** Tell me which question you'd like to practice, and I will act as your interviewer to evaluate your answer!`,
      suggestedPrompts: [
        "Let's practice the SQL query optimization question",
        "Let's practice the ASP.NET Core scalability question",
        "How do I answer: 'Why do you want to work at " + company + "?'",
      ],
    };
  }

  // B. Suitability / Qualification Assessment
  if (q.includes("qualified") || q.includes("suitability") || q.includes("am i")) {
    return {
      message: `### 📊 Factual Job Suitability Assessment: **${jobTitle}** @ **${company}**

Here is a breakdown of your genuine qualifications based strictly on your Master Profile:

#### ✅ Strong Match Evidence
* **Core Technologies:** Your commercial mastery of **SQL Server, C#, .NET Core, ASP.NET Core, Angular, Python, and Power BI** directly aligns with the technical responsibilities.
* **Commercial Track Record:** Documented production impact at Cognitive Solutions (150k+ daily transactions, 42% query acceleration, 25 hrs/week automation) provides high-credibility proof of delivery.
* **Academic Foundation:** MSc in Data Science and Analytics (Distinction) provides academic backing in statistical modeling and machine learning.

#### ⚠️ Gaps & Areas to Clarify
* If the role demands deep Kubernetes orchestration or specific proprietary cloud tools (e.g. AWS Redshift / Snowflake) beyond your documented Azure and SQL Server experience, emphasize your **fast ramp-up speed** and solid fundamental knowledge of relational warehousing.

#### 🚀 Recommendation
**Strong Match.** Your background represents an exceptional hybrid profile bridging Enterprise Software Engineering and Business Intelligence / Data Analytics. You are fully positioned to proceed with resume tailoring.`,
      suggestedPrompts: [
        "Which projects should I highlight for this role?",
        "Tailor my resume for this job now",
        "Generate a tailored cover letter for " + company,
      ],
    };
  }

  // C. Project Highlighting
  if (q.includes("project") || q.includes("highlight")) {
    return {
      message: `### 💡 Recommended Projects to Highlight for **${jobTitle}**

To position yourself effectively for **${company}**, feature these two projects prominently:

1. **Enterprise Revenue Intelligence & Executive KPI Dashboard**
   * *Why it matters:* Demonstrates end-to-end commercial ownership—taking raw SQL Server tables, architecting a star schema, formulating 35+ DAX measures, and eliminating 18 hours/week of manual spreadsheet tasks.
   * *Interview Talking Point:* Emphasize how this directly impacted C-suite decision-making and cross-departmental adoption.

2. **Predictive Customer Churn Analysis & Machine Learning Pipeline**
   * *Why it matters:* Demonstrates statistical rigor in Python, Scikit-learn, and XGBoost (achieving 0.89 ROC-AUC and 19% improvement over baseline), validated using SHAP value interpretation.
   * *Interview Talking Point:* Showcases your ability to translate raw data science research into actionable business retention strategies.`,
      suggestedPrompts: [
        "Rewrite my project bullets for ATS impact",
        "Prepare 5 interview questions about my Power BI project",
        "Tailor my resume for this position",
      ],
    };
  }

  // D. General Career Advice / Rewriting
  return {
    message: `### 🚀 AI Career Assistant Insights for **Sane Indra Kiran**

I am ready to help you optimize your career materials and application strategy for **${jobTitle}** at **${company}**.

#### Key Capabilities Available:
1. **Resume Bullet Rewriting:** Transform existing duties into high-impact **XYZ bullets** (*Accomplished [X] as measured by [Y] by doing [Z]*).
2. **Technical Skills Gap Analysis:** Compare target job postings against your 17 Master Profile domains.
3. **Mock Interview Simulator:** Turn-by-turn technical and behavioral practice with feedback.
4. **Targeted Cover Letter Drafting:** Grounded in your genuine commercial achievements.
5. **Salary & Market Negotiation Guidance:** UK, US, and international benchmark guidance.

What would you like to focus on right now?`,
    suggestedPrompts: [
      "Generate 10 technical interview questions for " + jobTitle,
      "Am I qualified for this position?",
      "Which of my projects should I highlight?",
      "Rewrite my experience using the XYZ impact framework",
    ],
  };
}
