"use client";

import React, { useState, useEffect } from "react";
import { MasterProfile } from "@/lib/types/profile";
import { ParsedJobDescription } from "@/lib/types/job";
import { TailoredResumeDocument } from "@/lib/types/tailored-resume";
import { TrackedApplication } from "@/lib/types/global-job";
import { NavTabId } from "@/components/layout/platform-nav";
import { StorageService } from "@/lib/storage/profile-storage";
import {
  SparklesIcon,
  UserIcon,
  BriefcaseIcon,
  FileTextIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  ArrowRightIcon,
  SlidersIcon,
  LayersIcon,
  GlobeIcon,
  BookmarkIcon,
  BotIcon,
} from "@/components/ui/icons";

interface MainDashboardProps {
  profile: MasterProfile;
  savedJobs: ParsedJobDescription[];
  tailoredResumes: TailoredResumeDocument[];
  onNavigate: (tab: NavTabId) => void;
}

export function MainDashboard({
  profile,
  savedJobs,
  tailoredResumes,
  onNavigate,
}: MainDashboardProps) {
  const [trackedApps, setTrackedApps] = useState<TrackedApplication[]>([]);

  useEffect(() => {
    StorageService.getTrackedApplications().then(setTrackedApps);
  }, []);

  // Compute metrics
  const professionalCount = profile.skills.filter((s) => s.evidenceLevel === "professional").length;
  const projectCount = profile.projects.length;
  const employmentCount = profile.employmentHistory.length;

  // Recommendations for profile enhancement
  const recommendations: { title: string; desc: string; actionTab: NavTabId }[] = [];

  const metricsMissingInResp = profile.employmentHistory.some((e) =>
    e.responsibilities.some((r) => !r.impactMetric && r.evidenceLevel === "professional")
  );
  if (metricsMissingInResp) {
    recommendations.push({
      title: "Add Quantifiable Metrics to Professional Duties",
      desc: "Supplying exact genuine percentage or volume metrics boosts your ATS score alignment across target vacancies.",
      actionTab: "master-profile",
    });
  }

  recommendations.push({
    title: "Explore Live Global Jobs in UK, USA & India",
    desc: "Discover real vacancies matching your skill set with automatic compatibility scoring and 1-click resume tailoring.",
    actionTab: "jobs",
  });

  recommendations.push({
    title: "Practice Mock Interview with AI Career Coach",
    desc: "Run a turn-by-turn technical interview simulation customized to your target job requirements.",
    actionTab: "assistant",
  });

  return (
    <div className="space-y-8">
      {/* Welcome & Quick Action Hero */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-zinc-200 text-xs font-medium backdrop-blur-xs">
            <SparklesIcon className="w-3.5 h-3.5 text-amber-300" />
            AI-Powered Career Intelligence System
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {profile.contact.fullName}
          </h1>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
            Your single source of truth holds {profile.skills.length} verified technical skills, {employmentCount} employment positions, and {projectCount} documented projects. Discover global opportunities, run mock interviews, and generate ATS-optimized CVs for the UK, USA, and India.
          </p>
          <div className="pt-2 flex flex-wrap gap-2.5">
            <button
              onClick={() => onNavigate("jobs")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white text-zinc-950 hover:bg-zinc-100 transition shadow-xs"
            >
              <GlobeIcon className="w-4 h-4 text-zinc-900" />
              Find Global Jobs
            </button>
            <button
              onClick={() => onNavigate("tailor")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 transition"
            >
              <SparklesIcon className="w-4 h-4 text-amber-400" />
              Tailor Resume
            </button>
            <button
              onClick={() => onNavigate("assistant")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-purple-600 hover:bg-purple-700 text-white transition shadow-xs"
            >
              <BotIcon className="w-4 h-4" />
              AI Career Coach
            </button>
            <button
              onClick={() => onNavigate("tracker")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-zinc-800/80 hover:bg-zinc-800 text-white border border-zinc-700 transition"
            >
              <BookmarkIcon className="w-4 h-4 text-zinc-300" />
              Track Applications ({trackedApps.length})
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-zinc-500">
            <span>Master Profile Status</span>
            <UserIcon className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            100% Complete
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <CheckCircleIcon className="w-3.5 h-3.5" /> All 17 domains verified
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-zinc-500">
            <span>Global Opportunities</span>
            <GlobeIcon className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            9+ Markets
          </div>
          <p className="text-xs text-zinc-500">
            UK, USA, India, Canada, Germany &amp; more
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-zinc-500">
            <span>Application Pipeline</span>
            <BookmarkIcon className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {trackedApps.length} Tracked
          </div>
          <p className="text-xs text-zinc-500">
            Saved, Applied &amp; Interviewing
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-zinc-500">
            <span>Tailored Resumes</span>
            <FileTextIcon className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {tailoredResumes.length}
          </div>
          <p className="text-xs text-zinc-500">
            Export-ready ATS versions
          </p>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Recent Tailored Resumes & Saved Jobs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Global Opportunities Spotlight */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <GlobeIcon className="w-4 h-4 text-blue-500" />
                  Target Global Opportunities
                </h3>
                <p className="text-xs text-zinc-500">
                  Search live tech postings with automatic Master Profile match scoring.
                </p>
              </div>
              <button
                onClick={() => onNavigate("jobs")}
                className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 hover:underline flex items-center gap-1"
              >
                Explore All Jobs <ArrowRightIcon className="w-3 h-3" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-blue-950 dark:text-blue-200 block">
                  Find jobs in London, San Francisco, Bangalore &amp; Remote
                </span>
                <span className="text-[11px] text-zinc-600 dark:text-zinc-400">
                  Includes Monzo, Stripe, Deloitte, Shopify, Canva, and ASML positions matching your skill set.
                </span>
              </div>
              <button
                onClick={() => onNavigate("jobs")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition whitespace-nowrap"
              >
                Launch Job Search →
              </button>
            </div>
          </div>

          {/* Recent Tailored Resumes */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Recent Resume Generations
                </h3>
                <p className="text-xs text-zinc-500">
                  Targeted CVs customized with zero hallucination.
                </p>
              </div>
              <button
                onClick={() => onNavigate("library")}
                className="text-xs font-medium text-zinc-900 dark:text-zinc-100 hover:underline flex items-center gap-1"
              >
                View Library <ArrowRightIcon className="w-3 h-3" />
              </button>
            </div>

            {tailoredResumes.length === 0 ? (
              <div className="text-center py-10 px-4 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                <FileTextIcon className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  No tailored resumes generated yet
                </p>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1 mb-4">
                  Select a target role and job description to generate your first document.
                </p>
                <button
                  onClick={() => onNavigate("tailor")}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 transition"
                >
                  <SparklesIcon className="w-3.5 h-3.5" /> Start Tailoring
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {tailoredResumes.slice(0, 3).map((res) => (
                  <div
                    key={res.id}
                    className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 flex items-center justify-between gap-3"
                  >
                    <div>
                      <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                        {res.label}
                      </h4>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        Target: <span className="capitalize">{res.targetRole.replace(/_/g, " ")}</span> • Country: <span className="uppercase">{res.targetCountry}</span> • Updated {new Date(res.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => onNavigate("library")}
                      className="text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700"
                    >
                      Open Document
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Profile Recommendations & AI Assistant CTA */}
        <div className="space-y-6">
          {/* AI Career Assistant Prompt Card */}
          <div className="bg-gradient-to-br from-purple-900/90 to-purple-950 text-white p-6 rounded-2xl shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <BotIcon className="w-5 h-5 text-purple-300" />
              <h3 className="text-base font-bold">Dedicated Career Coach</h3>
            </div>
            <p className="text-xs text-purple-200 leading-relaxed">
              Ask questions about your profile, generate 20 technical interview questions for any job, or conduct a realistic mock interview.
            </p>
            <button
              onClick={() => onNavigate("assistant")}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white text-purple-950 hover:bg-purple-50 transition shadow-xs"
            >
              <BotIcon className="w-4 h-4" /> Open AI Career Coach
            </button>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4 shadow-2xs">
            <div className="flex items-center gap-2">
              <SparklesIcon className="w-4 h-4 text-amber-500" />
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Strategic Recommendations
              </h3>
            </div>
            <p className="text-xs text-zinc-500">
              Suggestions to maximize genuine evidence and ATS ranking.
            </p>

            <div className="space-y-3">
              {recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-amber-200/60 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20 space-y-1.5"
                >
                  <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                    {rec.title}
                  </h4>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-normal">
                    {rec.desc}
                  </p>
                  <button
                    onClick={() => onNavigate(rec.actionTab)}
                    className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 hover:underline flex items-center gap-1 pt-1"
                  >
                    Action in {rec.actionTab.replace("-", " ")} <ArrowRightIcon className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
