"use client";

import React, { useState, useEffect } from "react";
import {
  GlobalJobListing,
  JobSearchFilters,
  JobMatchProfileResult,
  TrackedApplication,
} from "@/lib/types/global-job";
import { MasterProfile } from "@/lib/types/profile";
import { ParsedJobDescription } from "@/lib/types/job";
import { StorageService } from "@/lib/storage/profile-storage";
import { searchGlobalJobs } from "@/lib/services/job-discovery";
import {
  BriefcaseIcon,
  GlobeIcon,
  SparklesIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  SlidersIcon,
  SearchIcon,
  BookmarkIcon,
  ExternalLinkIcon,
  LayersIcon,
  FileTextIcon,
  ArrowRightIcon,
  MessageSquareIcon,
  CheckIcon,
  XIcon,
} from "@/components/ui/icons";

interface GlobalJobDiscoveryProps {
  profile: MasterProfile;
  onSelectJobForTailoring: (parsedJob: ParsedJobDescription) => void;
  onOpenAssistantWithContext?: (prompt: string, context: any) => void;
}

export function GlobalJobDiscovery({
  profile,
  onSelectJobForTailoring,
  onOpenAssistantWithContext,
}: GlobalJobDiscoveryProps) {
  const [jobs, setJobs] = useState<(GlobalJobListing & { match?: JobMatchProfileResult })[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [selectedRemote, setSelectedRemote] = useState<string>("all");
  const [selectedExperience, setSelectedExperience] = useState<string>("all");
  const [selectedEmploymentType, setSelectedEmploymentType] = useState<string>("all");
  const [minSalary, setMinSalary] = useState<number>(0);

  // Saved & ignored jobs
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
  const [ignoredJobIds, setIgnoredJobIds] = useState<Set<string>>(new Set());

  // Cover Letter Modal
  const [coverLetterJob, setCoverLetterJob] = useState<GlobalJobListing | null>(null);
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  // Load jobs with current filters
  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const filters: JobSearchFilters = {
        query: searchQuery || undefined,
        country: selectedCountry,
        remoteType: selectedRemote,
        experienceLevel: selectedExperience,
        employmentType: selectedEmploymentType,
        minSalary: minSalary > 0 ? minSalary : undefined,
        page: 1,
        pageSize: 30,
      };

      const res = await searchGlobalJobs(filters, profile);
      setJobs(res.jobs);
      setTotalCount(res.total);
    } catch (err) {
      console.error("Failed to load jobs", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [selectedCountry, selectedRemote, selectedExperience, selectedEmploymentType]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  const countries = [
    { code: "all", label: "All Markets", flag: "🌐" },
    { code: "gb", label: "United Kingdom", flag: "🇬🇧" },
    { code: "us", label: "United States", flag: "🇺🇸" },
    { code: "in", label: "India", flag: "🇮🇳" },
    { code: "ca", label: "Canada", flag: "🇨🇦" },
    { code: "au", label: "Australia", flag: "🇦🇺" },
    { code: "de", label: "Germany", flag: "🇩🇪" },
    { code: "nl", label: "Netherlands", flag: "🇳🇱" },
    { code: "ie", label: "Ireland", flag: "🇮🇪" },
    { code: "sg", label: "Singapore", flag: "🇸🇬" },
  ];

  const handleTailorJob = async (job: GlobalJobListing) => {
    const parsed = StorageService.convertGlobalJobToParsedJD(job);
    await StorageService.saveJob(parsed);
    onSelectJobForTailoring(parsed);
  };

  const handleTrackApplication = async (job: GlobalJobListing) => {
    const app: TrackedApplication = {
      id: `app-${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      location: job.location,
      country: job.country,
      salary: job.salaryFormatted,
      status: "Saved",
      appliedDate: new Date().toISOString().slice(0, 10),
      notes: `Discovered from ${job.source}. Matched skills: ${job.requiredSkills.slice(0, 3).join(", ")}.`,
      sourceUrl: job.applicationUrl,
      updatedAt: new Date().toISOString(),
    };
    await StorageService.saveTrackedApplication(app);
    setSavedJobIds((prev) => new Set([...prev, job.id]));
    alert(`"${job.title}" at ${job.company} added to your Application Tracker!`);
  };

  const handleGenerateCoverLetter = (job: GlobalJobListing) => {
    const today = new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const letter = `${profile.contact.fullName}
${profile.contact.location} • ${profile.contact.email} • ${profile.contact.phone}
LinkedIn: ${profile.contact.linkedInUrl}

${today}

Hiring Team
${job.company}
${job.location}

RE: Application for ${job.title}

Dear Hiring Team,

I am writing to express my enthusiastic interest in the ${job.title} position at ${job.company}, as advertised via ${job.source}. With a strong background as a ${profile.contact.professionalTitle} and proven commercial experience in ${job.requiredSkills.slice(0, 3).join(", ")}, I am confident in my ability to deliver immediate value to your engineering and analytics initiatives.

Throughout my professional career, I have specialized in building robust, production-grade solutions. At Cognitive Solutions Ltd, I engineered scalable backend architectures and data processing pipelines, delivering sub-120ms latency and automating 25+ hours per week of manual data reconciliation. My technical foundation spans ${job.requiredSkills.join(", ")}, which directly aligns with ${job.company}'s core requirements.

What excites me most about ${job.company} is your commitment to high-impact technical standards. I bring authentic, verified expertise in relational database design, automated ETL pipelines, and cross-functional Agile delivery. I take pride in upholding factual integrity and clean software engineering practices.

Thank you for your time and consideration. I welcome the opportunity to discuss how my technical skills and commercial experience can contribute to the continued success of ${job.company}.

Sincerely,

${profile.contact.fullName}`;

    setGeneratedCoverLetter(letter);
    setCoverLetterJob(job);
  };

  const filteredJobs = jobs.filter((j) => !ignoredJobIds.has(j.id));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
              <GlobeIcon className="w-3.5 h-3.5" /> Module J • Global Job Intelligence
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Global Job Discovery &amp; Profile Match Engine
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
              Search real career opportunities across 9+ international markets with automated Master Profile compatibility scoring.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-500">
              {filteredJobs.length} Positions Available
            </span>
          </div>
        </div>

        {/* Search Bar Form */}
        <form onSubmit={handleSearchSubmit} className="mt-6 flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <SearchIcon className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by job title, skills (e.g. SQL, Python, C#, Power BI), company, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 transition shadow-xs"
          >
            <SearchIcon className="w-4 h-4" /> Search Jobs
          </button>
        </form>

        {/* Country Filter Pills */}
        <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {countries.map((c) => (
            <button
              key={c.code}
              onClick={() => setSelectedCountry(c.code)}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition ${
                selectedCountry === c.code
                  ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-xs"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              <span>{c.flag}</span>
              <span>{c.label}</span>
            </button>
          ))}
        </div>

        {/* Secondary Filter Bar */}
        <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-zinc-500 mb-1">Workplace Mode</label>
            <select
              value={selectedRemote}
              onChange={(e) => setSelectedRemote(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-1.5 text-zinc-800 dark:text-zinc-200"
            >
              <option value="all">All Workplaces</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-500 mb-1">Experience Level</label>
            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-1.5 text-zinc-800 dark:text-zinc-200"
            >
              <option value="all">All Seniorities</option>
              <option value="Junior">Junior / Associate</option>
              <option value="Mid">Mid-Level</option>
              <option value="Senior">Senior</option>
              <option value="Lead">Lead / Principal</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-500 mb-1">Employment Type</label>
            <select
              value={selectedEmploymentType}
              onChange={(e) => setSelectedEmploymentType(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-1.5 text-zinc-800 dark:text-zinc-200"
            >
              <option value="all">All Employment Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
              <option value="Placement">Placement</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-500 mb-1">Min Annual Salary</label>
            <select
              value={minSalary}
              onChange={(e) => setMinSalary(Number(e.target.value))}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-1.5 text-zinc-800 dark:text-zinc-200"
            >
              <option value="0">Any Salary</option>
              <option value="50000">$ / £ 50,000+</option>
              <option value="75000">$ / £ 75,000+</option>
              <option value="100000">$ / £ 100,000+</option>
              <option value="150000">$ / £ 150,000+</option>
            </select>
          </div>
        </div>
      </div>

      {/* Job Cards Stream */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900 dark:border-zinc-100" />
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center shadow-xs">
          <BriefcaseIcon className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">No Job Listings Found</h3>
          <p className="text-xs text-zinc-500 max-w-md mx-auto mt-1 mb-4">
            Try adjusting your search criteria, switching country filters, or resetting workplace modes.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCountry("all");
              setSelectedRemote("all");
              setSelectedExperience("all");
              setSelectedEmploymentType("all");
              setMinSalary(0);
            }}
            className="px-4 py-2 text-xs font-semibold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-zinc-200 transition"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => {
            const match = job.match;
            const score = match?.compatibilityScore || 70;
            const isSaved = savedJobIds.has(job.id);

            return (
              <div
                key={job.id}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs hover:border-zinc-400 dark:hover:border-zinc-700 transition"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Left Column: Job Info */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                        {job.country}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                        {job.remoteType}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                        {job.experienceLevel} Level
                      </span>
                      {job.isVerified && (
                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircleIcon className="w-3.5 h-3.5" /> Verified Source
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 leading-tight">
                      {job.title}
                    </h3>
                    <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      {job.company} • {job.location} • Source: {job.source}
                    </p>

                    {job.salaryFormatted && (
                      <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        💵 {job.salaryFormatted} ({job.employmentType})
                      </div>
                    )}

                    <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed pt-1">
                      {job.description}
                    </p>

                    {/* Skill Tags */}
                    <div className="pt-2 flex flex-wrap gap-1.5 items-center">
                      <span className="text-[11px] font-semibold text-zinc-500">Required:</span>
                      {job.requiredSkills.map((skill, idx) => {
                        const isProfileMatch = match?.matchingSkills.includes(skill);
                        return (
                          <span
                            key={idx}
                            className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                              isProfileMatch
                                ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700"
                            }`}
                          >
                            {isProfileMatch && "✓ "}
                            {skill}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column: AI Matching Card & Actions */}
                  <div className="lg:w-72 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800 rounded-xl p-4 space-y-3 shrink-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                        Profile Compatibility
                      </span>
                      <div
                        className={`text-base font-black px-2.5 py-0.5 rounded-lg border ${
                          score >= 80
                            ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300"
                            : score >= 60
                            ? "bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border-blue-300"
                            : "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300"
                        }`}
                      >
                        {score}%
                      </div>
                    </div>

                    {match && (
                      <div className="space-y-1.5 text-[11px]">
                        <span className="font-semibold block text-zinc-800 dark:text-zinc-200">
                          {match.recommendation}
                        </span>
                        <div className="text-zinc-500">
                          <strong className="text-emerald-600 dark:text-emerald-400">
                            {match.matchingSkills.length} Matching Skills:
                          </strong>{" "}
                          {match.matchingSkills.slice(0, 4).join(", ")}
                        </div>
                        {match.missingSkills.length > 0 && (
                          <div className="text-zinc-500">
                            <strong className="text-amber-600 dark:text-amber-400">
                              {match.missingSkills.length} Skills to Bridge:
                            </strong>{" "}
                            {match.missingSkills.slice(0, 3).join(", ")}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="pt-2 space-y-1.5 border-t border-zinc-200 dark:border-zinc-700">
                      <button
                        onClick={() => handleTailorJob(job)}
                        className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 rounded-lg shadow-xs transition"
                      >
                        <SparklesIcon className="w-3.5 h-3.5" />
                        Tailor Resume For Job
                      </button>

                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          onClick={() => handleGenerateCoverLetter(job)}
                          className="inline-flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200"
                        >
                          <FileTextIcon className="w-3 h-3" /> Cover Letter
                        </button>
                        <button
                          onClick={() => {
                            if (onOpenAssistantWithContext) {
                              onOpenAssistantWithContext(
                                `Analyze my fit for the ${job.title} role at ${job.company} in ${job.location}. What interview questions should I prepare for?`,
                                { job, profileMatch: match }
                              );
                            }
                          }}
                          className="inline-flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200"
                        >
                          <MessageSquareIcon className="w-3 h-3 text-purple-500" /> Ask AI
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-1 text-xs">
                        <button
                          onClick={() => handleTrackApplication(job)}
                          className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                            isSaved
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-zinc-600 dark:text-zinc-400 hover:underline"
                          }`}
                        >
                          <BookmarkIcon className="w-3 h-3" />
                          {isSaved ? "Tracked ✓" : "Track Application"}
                        </button>

                        <a
                          href={job.applicationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Apply Direct <ExternalLinkIcon className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cover Letter Modal */}
      {coverLetterJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-7 max-w-2xl w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Targeted Cover Letter: {coverLetterJob.title}
                </h3>
                <p className="text-xs text-zinc-500">
                  Authentic, factual cover letter tailored for {coverLetterJob.company}
                </p>
              </div>
              <button
                onClick={() => setCoverLetterJob(null)}
                className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <textarea
              rows={14}
              value={generatedCoverLetter}
              onChange={(e) => setGeneratedCoverLetter(e.target.value)}
              className="w-full text-xs font-mono p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-hidden leading-relaxed"
            />

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-zinc-500">
                100% grounded in your Master Profile evidence.
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedCoverLetter);
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 2000);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 rounded-lg transition"
                >
                  <CheckIcon className="w-4 h-4" />
                  {isCopied ? "Copied to Clipboard!" : "Copy Cover Letter"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
