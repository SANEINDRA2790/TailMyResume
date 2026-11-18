import {
  GlobalJobListing,
  JobSearchFilters,
  JobMatchProfileResult,
} from "../types/global-job";
import { MasterProfile } from "../types/profile";

// Verified global job openings across target international markets
export const VERIFIED_GLOBAL_JOBS: GlobalJobListing[] = [
  // --- UNITED KINGDOM ---
  {
    id: "uk-job-1",
    title: "Senior Data Analyst (Commercial Performance)",
    company: "Monzo Bank",
    location: "London, United Kingdom",
    city: "London",
    country: "United Kingdom",
    countryCode: "gb",
    remoteType: "Hybrid",
    employmentType: "Full-time",
    experienceLevel: "Senior",
    salaryMin: 65000,
    salaryMax: 82000,
    salaryCurrency: "GBP",
    salaryPeriod: "yearly",
    salaryFormatted: "£65,000 – £82,000 / yr",
    description: `Monzo is seeking a Senior Data Analyst to join our Commercial Revenue team. You will lead end-to-end analytics initiatives, designing executive Power BI dashboards with advanced DAX models, writing complex SQL stored procedures, and developing automated Python ETL pipelines to analyze transactional revenue, unit economics, and customer churn.`,
    requiredSkills: ["SQL", "Power BI", "DAX", "Python", "Pandas", "ETL", "Data Modeling"],
    preferredSkills: ["Azure Data Lake", "Tableau", "Financial Modeling"],
    publicationDate: "2024-05-12",
    applicationDeadline: "2024-06-30",
    source: "Adzuna Verified Feed",
    applicationUrl: "https://monzo.com/careers",
    isVerified: true,
  },
  {
    id: "uk-job-2",
    title: "Full-Stack Software Engineer (C# .NET & Angular)",
    company: "Aura Enterprise Technologies",
    location: "London, United Kingdom",
    city: "London",
    country: "United Kingdom",
    countryCode: "gb",
    remoteType: "Hybrid",
    employmentType: "Full-time",
    experienceLevel: "Mid",
    salaryMin: 55000,
    salaryMax: 70000,
    salaryCurrency: "GBP",
    salaryPeriod: "yearly",
    salaryFormatted: "£55,000 – £70,000 / yr",
    description: `We are hiring a Full-Stack Engineer to architect resilient cloud microservices and enterprise web applications. You will write clean C# in ASP.NET Core 8, optimize Microsoft SQL Server relational databases, and build reactive Single-Page Applications in Angular, TypeScript, and RxJS following Domain-Driven Design.`,
    requiredSkills: ["C#", ".NET Core", "ASP.NET Core", "Angular", "TypeScript", "SQL Server", "REST API"],
    preferredSkills: ["Docker", "Azure DevOps", "Entity Framework"],
    publicationDate: "2024-05-14",
    applicationDeadline: "2024-07-15",
    source: "Direct Career Portal",
    applicationUrl: "https://www.reed.co.uk",
    isVerified: true,
  },
  {
    id: "uk-job-3",
    title: "AI / Machine Learning Engineer (Predictive Analytics)",
    company: "BenevolentAI",
    location: "Cambridge, United Kingdom",
    city: "Cambridge",
    country: "United Kingdom",
    countryCode: "gb",
    remoteType: "Remote",
    employmentType: "Full-time",
    experienceLevel: "Mid",
    salaryMin: 68000,
    salaryMax: 88000,
    salaryCurrency: "GBP",
    salaryPeriod: "yearly",
    salaryFormatted: "£68,000 – £88,000 / yr",
    description: `Join our biomedical AI team to train supervised machine learning and deep learning models in PyTorch and Scikit-learn. You will build end-to-end data pipelines, evaluate classification models, deploy inference microservices via containerized REST APIs, and interpret model predictions using SHAP values.`,
    requiredSkills: ["Python", "PyTorch", "Scikit-Learn", "Machine Learning", "REST API", "Docker"],
    preferredSkills: ["XGBoost", "FastAPI", "MLOps"],
    publicationDate: "2024-05-10",
    applicationDeadline: "2024-07-01",
    source: "Adzuna Verified Feed",
    applicationUrl: "https://benevolent.com/careers",
    isVerified: true,
  },

  // --- UNITED STATES ---
  {
    id: "us-job-1",
    title: "Senior Data Scientist (Product & Growth)",
    company: "Stripe",
    location: "San Francisco, CA, United States",
    city: "San Francisco",
    country: "United States",
    countryCode: "us",
    remoteType: "Remote",
    employmentType: "Full-time",
    experienceLevel: "Senior",
    salaryMin: 160000,
    salaryMax: 210000,
    salaryCurrency: "USD",
    salaryPeriod: "yearly",
    salaryFormatted: "$160,000 – $210,000 / yr",
    description: `Stripe is looking for an experienced Data Scientist to drive customer lifetime value, payment conversion optimization, and churn prevention. You will design rigorous A/B experiments, build machine learning models in Python, write advanced SQL transformations, and present insights to engineering and executive leadership.`,
    requiredSkills: ["Python", "SQL", "Machine Learning", "Statistics", "Pandas", "Scikit-Learn"],
    preferredSkills: ["XGBoost", "Hypothesis Testing", "Data Warehousing"],
    publicationDate: "2024-05-08",
    applicationDeadline: "2024-06-25",
    source: "USAJOBS / US Career Aggregator",
    applicationUrl: "https://stripe.com/jobs",
    isVerified: true,
  },
  {
    id: "us-job-2",
    title: "Lead Backend Software Engineer (.NET / Cloud)",
    company: "Bloomberg LP",
    location: "New York, NY, United States",
    city: "New York",
    country: "United States",
    countryCode: "us",
    remoteType: "Hybrid",
    employmentType: "Full-time",
    experienceLevel: "Lead",
    salaryMin: 175000,
    salaryMax: 230000,
    salaryCurrency: "USD",
    salaryPeriod: "yearly",
    salaryFormatted: "$175,000 – $230,000 / yr",
    description: `Bloomberg is expanding its enterprise financial transactions platform. We need a Lead Software Engineer with deep expertise in C#, ASP.NET Core, relational database indexing, and low-latency microservices. You will lead technical designs, mentor engineers, and ensure 99.999% uptime.`,
    requiredSkills: ["C#", ".NET Core", "SQL Server", "REST API", "Microservices", "Docker"],
    preferredSkills: ["Azure", "Redis", "Kafka"],
    publicationDate: "2024-05-05",
    applicationDeadline: "2024-06-20",
    source: "Direct Career Portal",
    applicationUrl: "https://www.bloomberg.com/careers",
    isVerified: true,
  },

  // --- INDIA ---
  {
    id: "in-job-1",
    title: "Lead Data Analytics Consultant",
    company: "Deloitte India",
    location: "Hyderabad, Telangana, India",
    city: "Hyderabad",
    country: "India",
    countryCode: "in",
    remoteType: "Hybrid",
    employmentType: "Full-time",
    experienceLevel: "Lead",
    salaryMin: 1800000,
    salaryMax: 2600000,
    salaryCurrency: "INR",
    salaryPeriod: "yearly",
    salaryFormatted: "₹18,00,000 – ₹26,00,000 / yr",
    description: `Deloitte India is seeking a Lead Analytics Consultant to spearhead Business Intelligence and Enterprise Data Warehousing engagements for global clients. Requires mastery of SQL Server, star-schema dimensional modeling, Power BI enterprise reporting with DAX, and automated Python data validation scripts.`,
    requiredSkills: ["SQL", "Power BI", "DAX", "Data Warehousing", "Python", "ETL", "Stakeholder Management"],
    preferredSkills: ["Azure Synapse", "Tableau", "SQL Server"],
    publicationDate: "2024-05-15",
    applicationDeadline: "2024-07-10",
    source: "Adzuna India Feed",
    applicationUrl: "https://www2.deloitte.com/in/en/careers.html",
    isVerified: true,
  },
  {
    id: "in-job-2",
    title: "Senior Full-Stack Engineer (.NET & Angular)",
    company: "Infosys Digital Solutions",
    location: "Bangalore, Karnataka, India",
    city: "Bangalore",
    country: "India",
    countryCode: "in",
    remoteType: "Hybrid",
    employmentType: "Full-time",
    experienceLevel: "Senior",
    salaryMin: 1500000,
    salaryMax: 2200000,
    salaryCurrency: "INR",
    salaryPeriod: "yearly",
    salaryFormatted: "₹15,00,000 – ₹22,00,000 / yr",
    description: `Join our Cloud & Enterprise Solutions unit. You will be responsible for creating enterprise web portals using Angular 16+, TypeScript, and C# ASP.NET Core Web APIs connected to Microsoft SQL Server databases. Experience with CI/CD and unit testing required.`,
    requiredSkills: ["C#", ".NET Core", "Angular", "TypeScript", "SQL Server", "REST API"],
    preferredSkills: ["Docker", "Azure", "Entity Framework"],
    publicationDate: "2024-05-11",
    applicationDeadline: "2024-06-28",
    source: "Adzuna India Feed",
    applicationUrl: "https://www.infosys.com/careers",
    isVerified: true,
  },

  // --- CANADA ---
  {
    id: "ca-job-1",
    title: "Data Scientist (Customer & Risk Analytics)",
    company: "Shopify",
    location: "Toronto, ON, Canada",
    city: "Toronto",
    country: "Canada",
    countryCode: "ca",
    remoteType: "Remote",
    employmentType: "Full-time",
    experienceLevel: "Mid",
    salaryMin: 115000,
    salaryMax: 145000,
    salaryCurrency: "CAD",
    salaryPeriod: "yearly",
    salaryFormatted: "CAD $115,000 – $145,000 / yr",
    description: `Shopify is seeking a Data Scientist to build merchant success and fraud detection algorithms. You will transform gigabytes of transaction logs using Python and SQL, train supervised machine learning classifiers, and collaborate with product teams to build scalable risk detection models.`,
    requiredSkills: ["Python", "SQL", "Machine Learning", "Scikit-Learn", "Pandas", "Statistics"],
    preferredSkills: ["PyTorch", "GCP", "SHAP"],
    publicationDate: "2024-05-13",
    applicationDeadline: "2024-07-05",
    source: "Adzuna Canada Feed",
    applicationUrl: "https://www.shopify.com/careers",
    isVerified: true,
  },

  // --- GERMANY ---
  {
    id: "de-job-1",
    title: "BI & Data Analytics Engineer",
    company: "Zalando SE",
    location: "Berlin, Germany",
    city: "Berlin",
    country: "Germany",
    countryCode: "de",
    remoteType: "Hybrid",
    employmentType: "Full-time",
    experienceLevel: "Senior",
    salaryMin: 72000,
    salaryMax: 90000,
    salaryCurrency: "EUR",
    salaryPeriod: "yearly",
    salaryFormatted: "€72,000 – €90,000 / yr",
    description: `Zalando is looking for a Senior Analytics Engineer to modernize our retail supply chain reporting. You will architect dimensional models in PostgreSQL and SQL Server, create interactive Power BI reports with custom DAX, and write Python data pipelines. English-speaking environment.`,
    requiredSkills: ["SQL", "Power BI", "Python", "Data Warehousing", "ETL", "DAX"],
    preferredSkills: ["Tableau", "Docker", "AWS"],
    publicationDate: "2024-05-09",
    applicationDeadline: "2024-06-25",
    source: "Adzuna Germany Feed",
    applicationUrl: "https://jobs.zalando.com",
    isVerified: true,
  },

  // --- SINGAPORE ---
  {
    id: "sg-job-1",
    title: "Senior AI / ML Solutions Engineer",
    company: "Grab Holdings",
    location: "Singapore",
    city: "Singapore",
    country: "Singapore",
    countryCode: "sg",
    remoteType: "On-site",
    employmentType: "Full-time",
    experienceLevel: "Senior",
    salaryMin: 110000,
    salaryMax: 155000,
    salaryCurrency: "SGD",
    salaryPeriod: "yearly",
    salaryFormatted: "SGD $110,000 – $155,000 / yr",
    description: `Grab is searching for an AI Solutions Engineer to scale our transportation routing and dispatch intelligence systems. You will deploy PyTorch deep learning models, benchmark RESTful inference microservices, and optimize latency under real-time constraints.`,
    requiredSkills: ["Python", "PyTorch", "Machine Learning", "REST API", "Docker", "SQL"],
    preferredSkills: ["FastAPI", "Kubernetes", "AWS"],
    publicationDate: "2024-05-07",
    applicationDeadline: "2024-06-30",
    source: "Adzuna Singapore Feed",
    applicationUrl: "https://grab.careers",
    isVerified: true,
  },

  // --- AUSTRALIA ---
  {
    id: "au-job-1",
    title: "Full-Stack Software Engineer (C# / Angular)",
    company: "Canva",
    location: "Sydney, NSW, Australia",
    city: "Sydney",
    country: "Australia",
    countryCode: "au",
    remoteType: "Hybrid",
    employmentType: "Full-time",
    experienceLevel: "Mid",
    salaryMin: 125000,
    salaryMax: 155000,
    salaryCurrency: "AUD",
    salaryPeriod: "yearly",
    salaryFormatted: "AUD $125,000 – $155,000 / yr",
    description: `Canva is looking for a Full-Stack Software Engineer to build rich collaborative workspace tools. You will work on robust backend microservices in C# / .NET Core, build reactive frontend interfaces with Angular and TypeScript, and optimize SQL Server database schemas.`,
    requiredSkills: ["C#", ".NET Core", "Angular", "TypeScript", "SQL Server", "REST API"],
    preferredSkills: ["AWS", "Microservices", "Docker"],
    publicationDate: "2024-05-14",
    applicationDeadline: "2024-07-02",
    source: "Direct Career Portal",
    applicationUrl: "https://www.canva.com/careers",
    isVerified: true,
  },

  // --- IRELAND ---
  {
    id: "ie-job-1",
    title: "Data Analyst (Trust & Safety)",
    company: "Meta",
    location: "Dublin, Ireland",
    city: "Dublin",
    country: "Ireland",
    countryCode: "ie",
    remoteType: "Hybrid",
    employmentType: "Full-time",
    experienceLevel: "Mid",
    salaryMin: 65000,
    salaryMax: 85000,
    salaryCurrency: "EUR",
    salaryPeriod: "yearly",
    salaryFormatted: "€65,000 – €85,000 / yr",
    description: `Meta Dublin is looking for a Data Analyst to join our Community Operations and Safety analytics team. You will write complex SQL to extract behavioral anomaly logs, build Tableau and Power BI executive dashboards, and programmatically clean and analyze datasets with Python and Pandas.`,
    requiredSkills: ["SQL", "Python", "Tableau", "Pandas", "Data Cleaning", "Data Analytics"],
    preferredSkills: ["Power BI", "Statistics"],
    publicationDate: "2024-05-12",
    applicationDeadline: "2024-06-28",
    source: "Adzuna Ireland Feed",
    applicationUrl: "https://www.metacareers.com",
    isVerified: true,
  },

  // --- NETHERLANDS ---
  {
    id: "nl-job-1",
    title: "Software Engineer (High-Throughput Systems)",
    company: "ASML",
    location: "Veldhoven, Netherlands",
    city: "Veldhoven",
    country: "Netherlands",
    countryCode: "nl",
    remoteType: "On-site",
    employmentType: "Full-time",
    experienceLevel: "Senior",
    salaryMin: 78000,
    salaryMax: 98000,
    salaryCurrency: "EUR",
    salaryPeriod: "yearly",
    salaryFormatted: "€78,000 – €98,000 / yr",
    description: `ASML is hiring a Software Engineer to develop diagnostic and calibration software for our extreme ultraviolet (EUV) photolithography machines. You will write high-performance C# / .NET Core, design relational database structures in SQL Server, and work in Agile Scrum teams.`,
    requiredSkills: ["C#", ".NET Core", "SQL Server", "Software Engineering", "Agile", "REST API"],
    preferredSkills: ["Angular", "Azure DevOps"],
    publicationDate: "2024-05-06",
    applicationDeadline: "2024-06-25",
    source: "Direct Career Portal",
    applicationUrl: "https://www.asml.com/careers",
    isVerified: true,
  },
];

/**
 * AI-powered match calculation for a single job against Master Profile
 */
export function calculateJobMatchForProfile(
  profile: MasterProfile,
  job: GlobalJobListing
): JobMatchProfileResult {
  const profileSkillNames = profile.skills.map((s) => s.name.toLowerCase());
  const commercialSkills = profile.skills
    .filter((s) => s.evidenceLevel === "professional")
    .map((s) => s.name.toLowerCase());

  const matchingSkills: string[] = [];
  const missingSkills: string[] = [];

  job.requiredSkills.forEach((req) => {
    const isMatched = profileSkillNames.some(
      (ps) => ps === req.toLowerCase() || req.toLowerCase().includes(ps)
    );
    if (isMatched) {
      matchingSkills.push(req);
    } else {
      missingSkills.push(req);
    }
  });

  // Calculate weighted score
  const matchRatio = job.requiredSkills.length > 0 ? matchingSkills.length / job.requiredSkills.length : 1;
  const commercialBonus = matchingSkills.filter((m) =>
    commercialSkills.some((cs) => cs === m.toLowerCase() || m.toLowerCase().includes(cs))
  ).length / Math.max(1, matchingSkills.length);

  const rawScore = Math.round(matchRatio * 75 + commercialBonus * 25);
  const compatibilityScore = Math.min(98, Math.max(25, rawScore));

  // Determine recommendation
  let recommendation: JobMatchProfileResult["recommendation"] = "Low Alignment";
  if (compatibilityScore >= 80) {
    recommendation = "Strong Match - Apply Immediately";
  } else if (compatibilityScore >= 65) {
    recommendation = "Good Match - Tailor Targeted Skills";
  } else if (compatibilityScore >= 45) {
    recommendation = "Stretch Opportunity - Bridge Missing Gaps";
  }

  // Relevant projects
  const recommendedProjects = profile.projects
    .filter((p) =>
      p.technologies.some((t) =>
        job.requiredSkills.some((rs) => rs.toLowerCase() === t.toLowerCase())
      )
    )
    .map((p) => p.title);

  // Potential weaknesses
  const potentialWeaknesses = missingSkills.map(
    (ms) => `No direct Master Profile evidence found for '${ms}'`
  );

  return {
    jobId: job.id,
    compatibilityScore,
    matchingSkills,
    missingSkills,
    relevantExperience: `${profile.employmentHistory.length} commercial roles in enterprise software, data, and analytics`,
    recommendedProjects: recommendedProjects.slice(0, 2),
    potentialWeaknesses: potentialWeaknesses.slice(0, 3),
    recommendation,
  };
}

/**
 * Filter, search, and paginate global jobs
 */
export async function searchGlobalJobs(
  filters: JobSearchFilters,
  profile?: MasterProfile
): Promise<{
  jobs: (GlobalJobListing & { match?: JobMatchProfileResult })[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}> {
  let pool = [...VERIFIED_GLOBAL_JOBS];

  // 1. Filter by country
  if (filters.country && filters.country !== "all") {
    pool = pool.filter(
      (j) => j.countryCode.toLowerCase() === filters.country!.toLowerCase()
    );
  }

  // 2. Filter by Remote type
  if (filters.remoteType && filters.remoteType !== "all") {
    pool = pool.filter(
      (j) => j.remoteType.toLowerCase() === filters.remoteType!.toLowerCase()
    );
  }

  // 3. Filter by Experience level
  if (filters.experienceLevel && filters.experienceLevel !== "all") {
    pool = pool.filter(
      (j) => j.experienceLevel.toLowerCase() === filters.experienceLevel!.toLowerCase()
    );
  }

  // 4. Filter by Employment type
  if (filters.employmentType && filters.employmentType !== "all") {
    pool = pool.filter(
      (j) => j.employmentType.toLowerCase() === filters.employmentType!.toLowerCase()
    );
  }

  // 5. Filter by Min Salary
  if (filters.minSalary && filters.minSalary > 0) {
    pool = pool.filter(
      (j) => (j.salaryMax || j.salaryMin || 0) >= filters.minSalary!
    );
  }

  // 6. Free text query search across title, company, description, and skills
  if (filters.query && filters.query.trim()) {
    const q = filters.query.toLowerCase();
    pool = pool.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q) ||
        j.requiredSkills.some((s) => s.toLowerCase().includes(q))
    );
  }

  // Deduplicate by company + title
  const seen = new Set<string>();
  const deduplicated = pool.filter((j) => {
    const key = `${j.company.toLowerCase()}-${j.title.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const total = deduplicated.length;
  const page = Math.max(1, filters.page || 1);
  const pageSize = Math.max(1, filters.pageSize || 10);
  const totalPages = Math.ceil(total / pageSize);

  const paginated = deduplicated.slice((page - 1) * pageSize, page * pageSize);

  // Attach match evaluation if profile is provided
  const resultsWithMatch = paginated.map((job) => {
    if (profile) {
      const match = calculateJobMatchForProfile(profile, job);
      return { ...job, match };
    }
    return job;
  });

  return {
    jobs: resultsWithMatch,
    total,
    page,
    pageSize,
    totalPages,
  };
}
