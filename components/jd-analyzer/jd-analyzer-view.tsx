"use client";

import React, { useState } from "react";
import { ParsedJobDescription } from "@/lib/types/job";
import { StorageService } from "@/lib/storage/profile-storage";
import { NavTabId } from "@/components/layout/platform-nav";
import {
  BriefcaseIcon,
  SparklesIcon,
  CheckCircleIcon,
  CheckIcon,
  LayersIcon,
  TrashIcon,
  ArrowRightIcon,
  FileTextIcon,
  GlobeIcon,
} from "@/components/ui/icons";

interface JDAnalyzerViewProps {
  onProceedToTailor: (job: ParsedJobDescription) => void;
  savedJobs: ParsedJobDescription[];
  onRefreshJobs: () => void;
}

export function JDAnalyzerView({
  onProceedToTailor,
  savedJobs,
  onRefreshJobs,
}: JDAnalyzerViewProps) {
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [location, setLocation] = useState("London, United Kingdom");
  const [jobUrl, setJobUrl] = useState("");
  const [rawText, setRawText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<ParsedJobDescription | null>(null);

  // Sample templates for rapid testing
  const sampleJobs = [
    {
      title: "Senior Data Analyst",
      company: "Monzo Financial Services",
      location: "London, UK",
      text: `Role: Senior Data Analyst
Company: Monzo Financial Services
Location: London, United Kingdom (Hybrid)
Experience: 3+ years

About the Role:
We are looking for an experienced Senior Data Analyst to join our Revenue & Commercial Performance team. You will partner with business leaders, design executive dashboards, and build reliable data pipelines.

Key Responsibilities:
- Design, build, and maintain production Power BI dashboards with complex DAX measures.
- Write advanced SQL queries and stored procedures to extract and aggregate transaction logs.
- Utilize Python and Pandas for data manipulation, cleaning, and exploratory data analysis.
- Partner with finance and product stakeholders to define core commercial KPIs and forecast metrics.

Essential Requirements:
- Proven commercial experience with SQL and relational databases (SQL Server or PostgreSQL).
- Advanced proficiency in Power BI, DAX, and Power Query data modeling.
- Solid analytical programming skills in Python (Pandas, NumPy).
- Strong understanding of ETL workflows and data warehousing concepts.
- Excellent stakeholder communication and Agile delivery experience.

Desirable / Nice to Have:
- Experience with Azure cloud services (Azure Data Lake, Azure SQL).
- Familiarity with Tableau.
- Understanding of basic predictive machine learning techniques (classification, regression).`,
    },
    {
      title: "Full-Stack Software Engineer (.NET / Angular)",
      company: "Aura Enterprise Systems",
      location: "London, UK",
      text: `Role: Full-Stack Software Engineer
Company: Aura Enterprise Systems
Location: London, UK / Remote
Experience: 3-5 years

We are seeking a Full-Stack Software Engineer with strong C# and Angular expertise to scale our cloud-native enterprise application suite.

Responsibilities:
- Architect and develop secure RESTful microservices in C# and ASP.NET Core 8.
- Build responsive, accessible front-end user interfaces using Angular and TypeScript.
- Implement efficient database schemas, indexing, and LINQ/Entity Framework queries in SQL Server.
- Participate in peer code reviews, CI/CD pipeline automation, and unit testing.

Requirements:
- Strong commercial experience in C# and .NET Core / ASP.NET Core Web API.
- Deep hands-on knowledge of Angular (v14+), TypeScript, RxJS, and modern web styling.
- Proficient in Microsoft SQL Server, query optimization, and transaction handling.
- Experience building and consuming REST APIs following clean architecture principles.
- Familiarity with Git, Agile Scrum, and Docker containerization.

Desirable:
- Experience with Microsoft Azure or AWS deployments.
- Understanding of caching strategies using Redis.`,
    },
  ];

  const handleAnalyze = async () => {
    if (!rawText.trim()) {
      alert("Please enter or paste a job description.");
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/parse-jd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawText,
          jobTitle: jobTitle || undefined,
          companyName: companyName || undefined,
          location: location || undefined,
          jobUrl: jobUrl || undefined,
        }),
      });

      const data = await res.json();
      if (data.success && data.job) {
        setCurrentAnalysis(data.job);
        await StorageService.saveJob(data.job);
        onRefreshJobs();
      } else {
        alert(data.error || "Failed to parse job description.");
      }
    } catch (err: any) {
      alert(err.message || "An error occurred during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setRawText(content);
        if (!jobTitle) setJobTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
    };
    reader.readAsText(file);
  };

  const loadSample = (sample: typeof sampleJobs[0]) => {
    setJobTitle(sample.title);
    setCompanyName(sample.company);
    setLocation(sample.location);
    setRawText(sample.text);
  };

  return (
    <div className="space-y-8">
      {/* View Header */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              <BriefcaseIcon className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
              Job Description Intelligence & Extraction
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
              Extract mandatory requirements, technical competencies, seniority levels, and ATS keywords from any target posting.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Quick Samples:</span>
            {sampleJobs.map((sample, i) => (
              <button
                key={i}
                onClick={() => loadSample(sample)}
                className="px-2.5 py-1 text-xs font-medium rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 transition"
              >
                {sample.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Form (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-4 shadow-2xs">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              1. Job Opportunity Metadata
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Senior Data Analyst"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Monzo Bank"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    Job Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. London, UK"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  Job Reference / Application URL
                </label>
                <input
                  type="url"
                  placeholder="https://company.careers/job/12345"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  className="w-full text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-hidden"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    Paste Job Description Text
                  </label>
                  <label className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                    Upload file (.txt / .md)
                    <input
                      type="file"
                      accept=".txt,.md,.text"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <textarea
                  rows={9}
                  placeholder="Paste the full job posting requirements and responsibilities here..."
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  className="w-full text-xs font-mono rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 p-3 text-zinc-900 dark:text-zinc-100 focus:outline-hidden leading-relaxed"
                />
              </div>

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 transition disabled:opacity-50 shadow-xs"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white dark:border-zinc-900 border-t-transparent rounded-full animate-spin" />
                    Analyzing Requirements...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-4 h-4" />
                    Extract Requirements & Analyze
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Stored Target Jobs */}
          {savedJobs.length > 0 && (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-3 shadow-2xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Saved Target Opportunities ({savedJobs.length})
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {savedJobs.map((j) => (
                  <div
                    key={j.id}
                    className="p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">
                        {j.jobTitle}
                      </span>
                      <span className="text-zinc-500">
                        {j.companyName} • {j.mandatoryRequirements.length} reqs
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setCurrentAnalysis(j)}
                        className="px-2 py-1 text-xs rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-700 dark:text-zinc-300"
                      >
                        Inspect
                      </button>
                      <button
                        onClick={async () => {
                          await StorageService.deleteJob(j.id);
                          onRefreshJobs();
                        }}
                        className="p-1 text-zinc-400 hover:text-red-500"
                      >
                        <TrashIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Structured Analysis Output (7 cols) */}
        <div className="lg:col-span-7">
          {currentAnalysis ? (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-6 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                      {currentAnalysis.jobTitle}
                    </h3>
                    <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      {currentAnalysis.seniorityLevel} Level
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">
                    {currentAnalysis.companyName} • {currentAnalysis.location} • ~{currentAnalysis.requiredExperienceYears}y exp
                  </p>
                </div>

                <button
                  onClick={() => onProceedToTailor(currentAnalysis)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition"
                >
                  <SparklesIcon className="w-3.5 h-3.5" /> Match & Tailor Resume
                </button>
              </div>

              {/* Mandatory Requirements */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Mandatory Requirements ({currentAnalysis.mandatoryRequirements.length})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentAnalysis.mandatoryRequirements.map((req) => (
                    <div
                      key={req.id}
                      className="p-2.5 rounded-lg border border-red-100 dark:border-red-950/60 bg-red-50/30 dark:bg-red-950/20 text-xs"
                    >
                      <div className="flex items-center justify-between font-semibold text-zinc-900 dark:text-zinc-100">
                        <span>{req.name}</span>
                        <span className="text-[10px] text-red-600 dark:text-red-400 capitalize">
                          {req.importance} Priority
                        </span>
                      </div>
                      <span className="text-[11px] text-zinc-500 capitalize block mt-0.5">
                        Category: {req.category.replace(/_/g, " ")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desirable Requirements */}
              {currentAnalysis.desirableRequirements.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Desirable / Preferred Competencies ({currentAnalysis.desirableRequirements.length})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentAnalysis.desirableRequirements.map((req) => (
                      <div
                        key={req.id}
                        className="p-2.5 rounded-lg border border-amber-100 dark:border-amber-950/60 bg-amber-50/30 dark:bg-amber-950/20 text-xs"
                      >
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">
                          {req.name}
                        </span>
                        <span className="text-[11px] text-zinc-500 capitalize block mt-0.5">
                          Category: {req.category.replace(/_/g, " ")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Extracted ATS Keywords */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Extracted Keywords for ATS Optimization ({currentAnalysis.extractedKeywords.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentAnalysis.extractedKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded border border-zinc-200 dark:border-zinc-700 font-mono"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Responsibilities */}
              {currentAnalysis.responsibilities.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Target Role Responsibilities
                  </span>
                  <ul className="list-disc list-inside text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
                    {currentAnalysis.responsibilities.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-center shadow-2xs min-h-[400px]">
              <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mb-3">
                <BriefcaseIcon className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                No Job Posting Selected
              </h4>
              <p className="text-xs text-zinc-500 max-w-sm mt-1">
                Paste job text on the left or select a sample preset to view mandatory skills, experience level, and ATS keywords.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
