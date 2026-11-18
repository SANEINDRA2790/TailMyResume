import { TargetCountry } from "../types/profile";

export interface CountryConvention {
  country: TargetCountry;
  name: string;
  documentHeading: string;
  spellingMap: Record<string, string>;
  dateFormat: "Month YYYY" | "MM/YYYY" | "YYYY";
  includePhotoNotice: string;
  recommendedPageLimit: string;
  sectionOrder: string[];
  bulletStyleGuideline: string;
}

export const COUNTRY_CONVENTIONS: Record<TargetCountry, CountryConvention> = {
  uk: {
    country: "uk",
    name: "United Kingdom (UK CV)",
    documentHeading: "Curriculum Vitae",
    spellingMap: {
      optimized: "optimised",
      prioritized: "prioritised",
      modeling: "modelling",
      analyzed: "analysed",
      programs: "programmes",
      organization: "organisation",
      behavior: "behaviour",
    },
    dateFormat: "Month YYYY",
    includePhotoNotice: "Strictly no photograph, date of birth, or marital status under UK Equality Act 2010.",
    recommendedPageLimit: "1–2 Pages depending on career duration",
    sectionOrder: ["summary", "skills", "experience", "education", "projects", "certifications"],
    bulletStyleGuideline: "Evidence-grounded narrative showcasing responsibilities, methodologies, and team outcomes.",
  },
  usa: {
    country: "usa",
    name: "United States (US Resume)",
    documentHeading: "Resume",
    spellingMap: {
      optimised: "optimized",
      prioritised: "prioritized",
      modelling: "modeling",
      analysed: "analyzed",
      programmes: "programs",
      organisation: "organization",
      behaviour: "behavior",
    },
    dateFormat: "Month YYYY",
    includePhotoNotice: "No headshot, age, gender, or personal demographic details for ATS and EEOC compliance.",
    recommendedPageLimit: "Strictly 1–2 Pages, high density, quantifiable achievements",
    sectionOrder: ["summary", "skills", "experience", "education", "projects", "certifications"],
    bulletStyleGuideline: "Impact-driven XYZ format: Action Verb + Context + Quantified Business Metric.",
  },
  india: {
    country: "india",
    name: "India (Corporate CV)",
    documentHeading: "Professional Curriculum Vitae",
    spellingMap: {
      optimized: "optimised",
      prioritized: "prioritised",
      modeling: "modelling",
      programs: "programmes",
    },
    dateFormat: "Month YYYY",
    includePhotoNotice: "Professional Indian recruitment format focusing on verifiable academic and corporate credentials.",
    recommendedPageLimit: "2 Pages comprehensive technical profile",
    sectionOrder: ["summary", "skills", "experience", "education", "projects", "certifications", "achievements"],
    bulletStyleGuideline: "Detailed technical competencies, project scopes, team collaboration, and measurable delivery milestones.",
  },
};

export function adaptSpelling(text: string, country: TargetCountry): string {
  const convention = COUNTRY_CONVENTIONS[country];
  let adapted = text;
  Object.entries(convention.spellingMap).forEach(([from, to]) => {
    const regex = new RegExp(`\\b${from}\\b`, "gi");
    adapted = adapted.replace(regex, to);
  });
  return adapted;
}
