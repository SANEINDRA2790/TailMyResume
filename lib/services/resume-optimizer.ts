import { MasterProfile, CareerCategory, TargetCountry } from "../types/profile";
import { ParsedJobDescription } from "../types/job";
import {
  TailoredResumeDocument,
  TailoredExperience,
  TailoredBullet,
  ContentReviewQuadrant,
} from "../types/tailored-resume";
import { ROLE_BLUEPRINTS } from "./role-rules";
import { adaptSpelling } from "./country-rules";

export function generateTailoredResumeDocument(
  profile: MasterProfile,
  job: ParsedJobDescription,
  targetRole: CareerCategory,
  targetCountry: TargetCountry
): TailoredResumeDocument {
  const roleBlueprint = ROLE_BLUEPRINTS[targetRole];

  // 1. Contextualize & Tailor Professional Summary
  const rawSummary = `Versatile and results-driven ${roleBlueprint.title} with solid commercial and academic experience. Proven track record specializing in ${roleBlueprint.primarySkills.slice(0, 4).join(", ")}. Adept at translating complex business and data requirements at ${job.companyName || "enterprise organizations"} into scalable, high-impact deliverables. Strong background in relational systems, clean architecture, and cross-functional Agile delivery adhering to ${targetCountry.toUpperCase()} standards.`;
  const adaptedSummaryText = adaptSpelling(rawSummary, targetCountry);

  // 2. Prioritize and Tailor Employment History
  const tailoredExperience: TailoredExperience[] = profile.employmentHistory.map((emp) => {
    // Score bullets based on keyword overlap with job
    const bullets: TailoredBullet[] = emp.responsibilities.map((resp) => {
      const lower = resp.text.toLowerCase();
      const matchedKeywords = job.extractedKeywords.filter((kw) =>
        lower.includes(kw.toLowerCase())
      );
      const isRoleSkill = roleBlueprint.primarySkills.some((s) =>
        lower.includes(s.toLowerCase())
      );

      const isRecommended = matchedKeywords.length > 0 || isRoleSkill;

      // Extract leading action verb
      const words = resp.text.split(" ");
      const actionVerb = words[0] || "Executed";

      const tailoredText = adaptSpelling(resp.text, targetCountry);

      return {
        id: resp.id,
        originalText: resp.text,
        tailoredText,
        actionVerb,
        quantifiedResult: resp.impactMetric,
        keywordsIncluded: matchedKeywords,
        isRecommended,
        status: "accepted" as const,
      };
    });

    // Sort bullets: recommended first
    bullets.sort((a, b) => (b.isRecommended ? 1 : 0) - (a.isRecommended ? 1 : 0));

    return {
      id: emp.id,
      company: emp.company,
      jobTitle: emp.jobTitle,
      location: emp.location,
      startDate: emp.startDate,
      endDate: emp.endDate,
      relevanceScore: 85,
      bullets,
    };
  });

  // 3. Prioritize Skills Matrix based on Role Track
  const prioritizedSkills = [
    {
      categoryName: "Core Role Competencies",
      skills: profile.skills
        .filter((s) => roleBlueprint.primarySkills.some((ps) => ps.toLowerCase() === s.name.toLowerCase()))
        .map((s) => s.name),
    },
    {
      categoryName: "Databases & Data Infrastructure",
      skills: profile.skills
        .filter((s) => s.category === "database" || s.category === "cloud")
        .map((s) => s.name),
    },
    {
      categoryName: "Languages & Frameworks",
      skills: profile.skills
        .filter((s) => s.category === "programming_language" || s.category === "framework")
        .map((s) => s.name),
    },
    {
      categoryName: "Analytical Tools & Methodologies",
      skills: profile.skills
        .filter((s) => s.category === "data_analytics" || s.category === "soft_skill")
        .map((s) => s.name),
    },
  ];

  // 4. Tailor Projects
  const tailoredProjects = profile.projects.map((proj) => {
    const isPrimary = proj.technologies.some((t) =>
      roleBlueprint.primarySkills.includes(t)
    );
    return {
      id: proj.id,
      title: proj.title,
      role: proj.role,
      dates: `${proj.startDate} - ${proj.endDate || "Present"}`,
      bullets: proj.responsibilities.map((r) => adaptSpelling(r, targetCountry)),
      technologies: proj.technologies,
      relevanceScore: isPrimary ? 90 : 70,
      isIncluded: true,
    };
  });

  // Sort projects by relevance
  tailoredProjects.sort((a, b) => b.relevanceScore - a.relevanceScore);

  // 5. Build Content Review Quadrant (Module G)
  const reviewQuadrant: ContentReviewQuadrant = {
    recommendedContent: [
      {
        id: "rc-1",
        section: "Professional Summary",
        item: `Contextualized profile targeting ${roleBlueprint.title} at ${job.companyName}`,
        reason: "Directly mirrors mandatory requirements identified in job analysis.",
      },
      ...tailoredExperience.flatMap((e) =>
        e.bullets
          .filter((b) => b.isRecommended)
          .slice(0, 3)
          .map((b) => ({
            id: `rc-${b.id}`,
            section: `Experience @ ${e.company}`,
            item: b.tailoredText,
            reason: `Direct keyword overlap: ${b.keywordsIncluded.join(", ") || roleBlueprint.title}`,
          }))
      ),
    ],
    lessRelevantContent: tailoredExperience.flatMap((e) =>
      e.bullets
        .filter((b) => !b.isRecommended)
        .map((b) => ({
          id: `lrc-${b.id}`,
          section: `Experience @ ${e.company}`,
          item: b.tailoredText,
          reason: "Genuine commercial experience, but secondary to target role keywords.",
          includedByDefault: true,
        }))
    ),
    missingInformation: job.mandatoryRequirements
      .filter(
        (m) =>
          !profile.skills.some((s) => s.name.toLowerCase() === m.name.toLowerCase())
      )
      .map((m) => ({
        id: `mi-${m.id}`,
        field: m.name,
        promptToUser: `The employer lists '${m.name}' as essential. If you have unlisted experience, add it to strengthen match.`,
        importance: "critical" as const,
      })),
    suggestedImprovements: [
      {
        id: "si-1",
        target: "Employment Experience",
        suggestion: "Ensure all bullets begin with past-tense action verbs (e.g. Engineered, Architected, Spearheaded).",
        suggestedAction: "Action verbs have been prioritized in current draft.",
      },
      {
        id: "si-2",
        target: "Quantifiable Results",
        suggestion: "Highlight metric outcomes (e.g. 'reduced latency by 42%') in first 2 bullets.",
        suggestedAction: "Applied to Cognitive Solutions and Apex Tech positions.",
      },
    ],
  };

  return {
    id: `resume-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    versionNumber: 1,
    label: `${profile.contact.fullName} - ${roleBlueprint.title} (${targetCountry.toUpperCase()})`,
    targetRole,
    targetCountry,
    templateId: "modern_professional",
    jobTitleTarget: job.jobTitle,
    companyTarget: job.companyName,
    contact: profile.contact,
    summary: {
      originalText: profile.professionalSummary.baseText,
      tailoredText: adaptedSummaryText,
      alignmentRationale: `Aligned to emphasize ${roleBlueprint.primarySkills.slice(0, 3).join(", ")} and enterprise readiness for ${job.companyName}.`,
    },
    prioritizedSkills,
    experience: tailoredExperience,
    projects: tailoredProjects,
    education: profile.education.map((edu) => ({
      institution: edu.institution,
      degree: edu.degree,
      dates: `${edu.startDate} - ${edu.endDate}`,
      location: edu.location,
      details: [
        edu.fieldOfStudy ? `Field: ${edu.fieldOfStudy}` : "",
        edu.grade ? `Honours: ${edu.grade}` : "",
        edu.dissertationTitle ? `Dissertation: ${edu.dissertationTitle}` : "",
      ].filter(Boolean),
    })),
    certifications: profile.certifications.map(
      (c) => `${c.name} (${c.issuingOrganization}, ${c.issueDate})`
    ),
    achievements: profile.achievements.map(
      (a) => `${a.title}: ${a.quantifiedResult || a.context}`
    ),
    reviewQuadrant,
    formatting: {
      fontSize: "medium",
      lineSpacing: "normal",
      sectionOrder: ["summary", "skills", "experience", "education", "projects", "certifications"],
      margins: "normal",
    },
  };
}
