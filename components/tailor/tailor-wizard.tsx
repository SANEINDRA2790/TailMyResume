"use client";

import React, { useState, useEffect } from "react";
import { MasterProfile, CareerCategory, TargetCountry } from "@/lib/types/profile";
import { ParsedJobDescription } from "@/lib/types/job";
import { TailoredResumeDocument, ResumeTemplateId } from "@/lib/types/tailored-resume";
import { CompatibilityAnalysis } from "@/lib/types/match";
import { evaluateJobMatch } from "@/lib/services/matching-engine";
import { generateTailoredResumeDocument } from "@/lib/services/resume-optimizer";
import { StorageService } from "@/lib/storage/profile-storage";
import { ResumePreview } from "@/components/editor/resume-preview";
import {
  SparklesIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  AlertCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckIcon,
  XIcon,
  SlidersIcon,
  LayersIcon,
  DownloadIcon,
  EyeIcon,
  EditIcon,
} from "@/components/ui/icons";

interface TailorWizardProps {
  profile: MasterProfile;
  initialJob?: ParsedJobDescription | null;
  savedJobs: ParsedJobDescription[];
  onOpenDownloadModal: (doc: TailoredResumeDocument) => void;
  onRefreshResumes: () => void;
}

export function TailorWizard({
  profile,
  initialJob,
  savedJobs,
  onOpenDownloadModal,
  onRefreshResumes,
}: TailorWizardProps) {
  // Wizard steps: 1: Configure, 2: Gap Match Matrix, 3: Content Review, 4: Live Editor & Preview
  const [step, setStep] = useState<number>(1);
  const [selectedJob, setSelectedJob] = useState<ParsedJobDescription | null>(
    initialJob || (savedJobs.length > 0 ? savedJobs[0] : null)
  );
  const [targetRole, setTargetRole] = useState<CareerCategory>("data_analyst");
  const [targetCountry, setTargetCountry] = useState<TargetCountry>("uk");

  const [matchAnalysis, setMatchAnalysis] = useState<CompatibilityAnalysis | null>(null);
  const [tailoredDoc, setTailoredDoc] = useState<TailoredResumeDocument | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [matchStatusFilter, setMatchStatusFilter] = useState<string>("all");

  useEffect(() => {
    if (initialJob) {
      setSelectedJob(initialJob);
    }
  }, [initialJob]);

  // When selected job or role changes, update match analysis
  useEffect(() => {
    if (selectedJob) {
      const analysis = evaluateJobMatch(profile, selectedJob);
      setMatchAnalysis(analysis);
    }
  }, [selectedJob, profile]);

  const handleStartOptimization = async () => {
    if (!selectedJob) {
      alert("Please select or paste a target job description first.");
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch("/api/optimize-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile,
          job: selectedJob,
          targetRole,
          targetCountry,
        }),
      });

      const data = await res.json();
      if (data.success && data.document) {
        setTailoredDoc(data.document);
        setStep(3); // Go to Content Review
      } else {
        // Fallback local deterministic generation
        const localDoc = generateTailoredResumeDocument(profile, selectedJob, targetRole, targetCountry);
        setTailoredDoc(localDoc);
        setStep(3);
      }
    } catch {
      const localDoc = generateTailoredResumeDocument(profile, selectedJob, targetRole, targetCountry);
      setTailoredDoc(localDoc);
      setStep(3);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!tailoredDoc) return;
    await StorageService.saveTailoredResume(tailoredDoc);
    onRefreshResumes();
    alert("Tailored Resume draft saved to your Resume Library!");
  };

  return (
    <div className="space-y-6">
      {/* Step Indicator Header */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2 sm:space-x-4 text-xs font-semibold">
            {[
              { num: 1, label: "Role & Country" },
              { num: 2, label: "Job Gap Matrix" },
              { num: 3, label: "Content Review" },
              { num: 4, label: "Live ATS Editor" },
            ].map((s) => (
              <div key={s.num} className="flex items-center space-x-1.5">
                <button
                  onClick={() => {
                    if (s.num <= 2 || tailoredDoc) setStep(s.num);
                  }}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition ${
                    step === s.num
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                      : step > s.num
                      ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {s.num}
                </button>
                <span className={step === s.num ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400"}>
                  {s.label}
                </span>
                {s.num < 4 && <span className="text-zinc-300 dark:text-zinc-700">→</span>}
              </div>
            ))}
          </div>

          {tailoredDoc && step === 4 && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveDraft}
                className="px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 rounded-lg transition"
              >
                Save Draft
              </button>
              <button
                onClick={() => onOpenDownloadModal(tailoredDoc)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 rounded-lg shadow-xs transition"
              >
                <DownloadIcon className="w-3.5 h-3.5" /> Export PDF / DOCX
              </button>
            </div>
          )}
        </div>
      </div>

      {/* STEP 1: Configure Role, Target Country, & Job Description */}
      {step === 1 && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-6 shadow-2xs">
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Configure Target Career Track & Country Convention
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              Select the professional persona and recruitment ruleset for this application.
            </p>
          </div>

          {/* Select Target Role Category */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">
              1. Professional Career Category (Module C)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  id: "data_analyst" as CareerCategory,
                  title: "Data Analyst",
                  desc: "SQL, Power BI, Tableau, Python, DAX, KPI analysis & automated reporting dashboards.",
                  icon: "📊",
                },
                {
                  id: "data_scientist" as CareerCategory,
                  title: "Data Scientist",
                  desc: "Python, statistics, predictive ML, feature engineering, Scikit-learn & analytical pipelines.",
                  icon: "🧪",
                },
                {
                  id: "ai_ml_engineer" as CareerCategory,
                  title: "AI / ML Engineer",
                  desc: "PyTorch, deep learning, model deployment, API integration, cloud scaling & MLOps.",
                  icon: "🤖",
                },
                {
                  id: "software_engineer" as CareerCategory,
                  title: "Software Engineer",
                  desc: "C#, .NET Core, ASP.NET Web API, Angular, TypeScript, SQL Server & microservices.",
                  icon: "💻",
                },
              ].map((role) => (
                <button
                  key={role.id}
                  onClick={() => setTargetRole(role.id)}
                  className={`p-4 rounded-xl text-left border transition ${
                    targetRole === role.id
                      ? "border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800/80 ring-1 ring-zinc-900 dark:ring-zinc-100"
                      : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400"
                  }`}
                >
                  <span className="text-2xl block mb-2">{role.icon}</span>
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    {role.title}
                  </h4>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                    {role.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Select Target Country */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">
              2. Target Country Recruitment Conventions (Module D)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: "uk" as TargetCountry,
                  name: "United Kingdom (UK CV)",
                  desc: "UK CV format, British spelling, 1–2 pages, no photo/marital status, Equality Act compliance.",
                  badge: "UK Standard",
                },
                {
                  id: "usa" as TargetCountry,
                  name: "United States (US Resume)",
                  desc: "Concise achievement-oriented, high-density action verbs (XYZ format), ATS-compliant layout.",
                  badge: "US Standard",
                },
                {
                  id: "india" as TargetCountry,
                  name: "India (Corporate CV)",
                  desc: "Indian recruitment conventions, technical skill matrices, academic milestones & projects.",
                  badge: "India Standard",
                },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setTargetCountry(c.id)}
                  className={`p-4 rounded-xl text-left border transition ${
                    targetCountry === c.id
                      ? "border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800/80 ring-1 ring-zinc-900 dark:ring-zinc-100"
                      : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400"
                  }`}
                >
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200">
                    {c.badge}
                  </span>
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mt-2">
                    {c.name}
                  </h4>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                    {c.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Target Job Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">
              3. Target Job Posting
            </label>
            {savedJobs.length === 0 ? (
              <div className="p-4 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 text-xs text-amber-800 dark:text-amber-300">
                No job postings saved yet. Head over to <strong>JD Analyzer</strong> to paste or upload your target job description.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {savedJobs.map((j) => (
                  <button
                    key={j.id}
                    onClick={() => setSelectedJob(j)}
                    className={`p-3.5 rounded-xl text-left border transition ${
                      selectedJob?.id === j.id
                        ? "border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800/80 ring-1 ring-zinc-900 dark:ring-zinc-100"
                        : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
                    }`}
                  >
                    <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 block">
                      {j.jobTitle}
                    </span>
                    <span className="text-xs text-zinc-500 mt-0.5 block">
                      {j.companyName} • {j.location} • {j.mandatoryRequirements.length} mandatory skills
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <button
              onClick={() => setStep(2)}
              disabled={!selectedJob}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 disabled:opacity-50 transition shadow-xs"
            >
              Next: Review Job Gap Matrix <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Compatibility Analysis & Gap Matrix (Module E) */}
      {step === 2 && matchAnalysis && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 text-amber-500" />
                Advanced Job Matching Matrix (Module E)
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Comparing Master Profile against {selectedJob?.jobTitle} @ {selectedJob?.companyName}.
              </p>
            </div>

            {/* Overall Score Box */}
            <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-800 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700">
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                  Weighted Match Score
                </span>
                <span className="text-xs text-zinc-600 dark:text-zinc-400">
                  {matchAnalysis.scoreBreakdown.mandatoryScore}% Mand. • {matchAnalysis.scoreBreakdown.desirableScore}% Des.
                </span>
              </div>
              <div className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
                {matchAnalysis.overallScore}%
              </div>
            </div>
          </div>

          {/* Scoring Methodology Banner */}
          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg text-xs text-blue-800 dark:text-blue-300">
            <strong>Transparent Scoring Methodology:</strong> {matchAnalysis.scoringMethodology}
          </div>

          {/* Status Filter */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">
              Requirements Matrix ({matchAnalysis.matches.length})
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500">Filter Status:</span>
              <select
                value={matchStatusFilter}
                onChange={(e) => setMatchStatusFilter(e.target.value)}
                className="text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-2 py-1 text-zinc-900 dark:text-zinc-100"
              >
                <option value="all">All Statuses</option>
                <option value="Strong match">Strong Match</option>
                <option value="Partial match">Partial Match</option>
                <option value="Missing evidence">Missing Evidence</option>
              </select>
            </div>
          </div>

          {/* Structured Compatibility Table (Module E Exact Requirement) */}
          <div className="overflow-x-auto border border-zinc-200 dark:border-zinc-800 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-zinc-500 font-semibold border-b border-zinc-200 dark:border-zinc-800 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Requirement</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Profile Evidence</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {matchAnalysis.matches
                  .filter((m) => matchStatusFilter === "all" || m.status === matchStatusFilter)
                  .map((row, i) => (
                    <tr key={i} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                      <td className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100">
                        {row.requirementName}
                        {row.isMandatory && (
                          <span className="ml-2 text-[9px] px-1.5 py-0.2 rounded bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 font-bold">
                            Mandatory
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-zinc-500 capitalize">
                        {row.category.replace(/_/g, " ")}
                      </td>
                      <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
                        {row.profileEvidence}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                            row.status === "Strong match"
                              ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                              : row.status === "Partial match"
                              ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800"
                              : "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800"
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition"
            >
              <ArrowLeftIcon className="w-4 h-4" /> Back to Config
            </button>
            <button
              onClick={handleStartOptimization}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 disabled:opacity-50 transition shadow-xs"
            >
              {isGenerating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white dark:border-zinc-900 border-t-transparent rounded-full animate-spin" />
                  Tailoring Resume...
                </>
              ) : (
                <>
                  Proceed to Content Review <ArrowRightIcon className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Content Review & Approval System (Module G) */}
      {step === 3 && tailoredDoc && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-6 shadow-2xs">
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5 text-emerald-500" />
              Content Review & Approval System (Module G)
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              Complete candidate transparency: Inspect recommended changes, review less relevant items, and verify genuine evidence.
            </p>
          </div>

          {/* 4 Quadrants Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Quadrant 1: Recommended Content */}
            <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                <CheckIcon className="w-4 h-4" /> 1. Strongly Recommended Content
              </h4>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                Information directly aligned with target job requirements:
              </p>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {tailoredDoc.reviewQuadrant.recommendedContent.map((item) => (
                  <div key={item.id} className="p-2 rounded bg-white dark:bg-zinc-800 border border-emerald-100 dark:border-emerald-900 text-xs">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 block">{item.section}</span>
                    <span className="text-zinc-700 dark:text-zinc-300">{item.item}</span>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block mt-1">
                      Reason: {item.reason}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quadrant 2: Less Relevant Content */}
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <SlidersIcon className="w-4 h-4" /> 2. Less Relevant (Genuine) Content
              </h4>
              <p className="text-[11px] text-zinc-500">
                Genuine experience that can be included or condensed:
              </p>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {tailoredDoc.reviewQuadrant.lessRelevantContent.map((item) => (
                  <div key={item.id} className="p-2 rounded bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 block">{item.section}</span>
                    <span className="text-zinc-600 dark:text-zinc-400">{item.item}</span>
                    <span className="text-[10px] text-zinc-500 block mt-1">{item.reason}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quadrant 3: Missing Information */}
            <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50/40 dark:bg-amber-950/20 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                <AlertTriangleIcon className="w-4 h-4" /> 3. Target Missing Information
              </h4>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                Mandatory posting requirements not yet documented in Master Profile:
              </p>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {tailoredDoc.reviewQuadrant.missingInformation.length === 0 ? (
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 italic">
                    All mandatory job requirements are covered by authentic Master Profile evidence.
                  </p>
                ) : (
                  tailoredDoc.reviewQuadrant.missingInformation.map((item) => (
                    <div key={item.id} className="p-2 rounded bg-white dark:bg-zinc-800 border border-amber-200 dark:border-amber-800 text-xs">
                      <span className="font-bold text-amber-900 dark:text-amber-200 block">{item.field}</span>
                      <span className="text-zinc-600 dark:text-zinc-400 text-[11px]">{item.promptToUser}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quadrant 4: Suggested Improvements */}
            <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/40 dark:bg-blue-950/20 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                <SparklesIcon className="w-4 h-4" /> 4. Action & Phrasing Improvements
              </h4>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                ATS framing, action verbs, and regional adjustments applied:
              </p>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {tailoredDoc.reviewQuadrant.suggestedImprovements.map((item) => (
                  <div key={item.id} className="p-2 rounded bg-white dark:bg-zinc-800 border border-blue-200 dark:border-blue-800 text-xs">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 block">{item.target}</span>
                    <span className="text-zinc-600 dark:text-zinc-400 text-[11px]">{item.suggestion}</span>
                    <span className="text-[10px] text-blue-700 dark:text-blue-400 block mt-1 font-medium">
                      Status: {item.suggestedAction}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition"
            >
              <ArrowLeftIcon className="w-4 h-4" /> Back to Matrix
            </button>
            <button
              onClick={() => setStep(4)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 transition shadow-xs"
            >
              Approve & Open Live Resume Editor <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Advanced ATS Resume Editor & Live Document Preview (Module H) */}
      {step === 4 && tailoredDoc && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls & Formatting Panel (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-4 shadow-2xs">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <SlidersIcon className="w-4 h-4" /> Resume Customization Controls
              </h3>

              {/* Template Picker */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                  ATS Professional Template
                </label>
                <select
                  value={tailoredDoc.templateId}
                  onChange={(e) =>
                    setTailoredDoc({
                      ...tailoredDoc,
                      templateId: e.target.value as ResumeTemplateId,
                    })
                  }
                  className="w-full text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 text-zinc-900 dark:text-zinc-100 focus:outline-hidden"
                >
                  <option value="modern_professional">1. Modern Professional</option>
                  <option value="minimal_ats">2. Minimal ATS (High Parseability)</option>
                  <option value="corporate_executive">3. Corporate Executive</option>
                  <option value="technical_specialist">4. Technical Specialist</option>
                  <option value="data_analytics">5. Data & Analytics Professional</option>
                </select>
              </div>

              {/* Font Size */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                  Typography Size
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["small", "medium", "large"] as const).map((sz) => (
                    <button
                      key={sz}
                      onClick={() =>
                        setTailoredDoc({
                          ...tailoredDoc,
                          formatting: { ...tailoredDoc.formatting, fontSize: sz },
                        })
                      }
                      className={`text-xs py-1.5 rounded-lg border capitalize ${
                        tailoredDoc.formatting.fontSize === sz
                          ? "border-zinc-900 dark:border-zinc-100 bg-zinc-100 dark:bg-zinc-800 font-bold"
                          : "border-zinc-200 dark:border-zinc-700 text-zinc-500"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Line Spacing */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                  Line & Section Density
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["compact", "normal", "relaxed"] as const).map((sp) => (
                    <button
                      key={sp}
                      onClick={() =>
                        setTailoredDoc({
                          ...tailoredDoc,
                          formatting: { ...tailoredDoc.formatting, lineSpacing: sp },
                        })
                      }
                      className={`text-xs py-1.5 rounded-lg border capitalize ${
                        tailoredDoc.formatting.lineSpacing === sp
                          ? "border-zinc-900 dark:border-zinc-100 bg-zinc-100 dark:bg-zinc-800 font-bold"
                          : "border-zinc-200 dark:border-zinc-700 text-zinc-500"
                      }`}
                    >
                      {sp}
                    </button>
                  ))}
                </div>
              </div>

              {/* Margins */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                  Page Margins
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["narrow", "normal", "wide"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() =>
                        setTailoredDoc({
                          ...tailoredDoc,
                          formatting: { ...tailoredDoc.formatting, margins: m },
                        })
                      }
                      className={`text-xs py-1.5 rounded-lg border capitalize ${
                        tailoredDoc.formatting.margins === m
                          ? "border-zinc-900 dark:border-zinc-100 bg-zinc-100 dark:bg-zinc-800 font-bold"
                          : "border-zinc-200 dark:border-zinc-700 text-zinc-500"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Page Indicator */}
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                <span className="text-zinc-500">Document Target:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                  1–2 Pages (ATS Safe)
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-3 shadow-2xs">
              <button
                onClick={() => onOpenDownloadModal(tailoredDoc)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 transition shadow-xs"
              >
                <DownloadIcon className="w-4 h-4" /> Export PDF / DOCX
              </button>
              <button
                onClick={handleSaveDraft}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 transition"
              >
                Save Version to Library
              </button>
            </div>
          </div>

          {/* Live A4 Recruitment Document Preview (8 cols) */}
          <div className="lg:col-span-8 overflow-x-auto pb-6">
            <ResumePreview
              document={tailoredDoc}
              templateId={tailoredDoc.templateId}
              readOnly={false}
              onUpdateSummary={(newSummary) =>
                setTailoredDoc({
                  ...tailoredDoc,
                  summary: { ...tailoredDoc.summary, tailoredText: newSummary },
                })
              }
              onUpdateBullet={(empId, bulletId, newText) => {
                const newExp = tailoredDoc.experience.map((e) => {
                  if (e.id === empId) {
                    return {
                      ...e,
                      bullets: e.bullets.map((b) =>
                        b.id === bulletId ? { ...b, tailoredText: newText } : b
                      ),
                    };
                  }
                  return e;
                });
                setTailoredDoc({ ...tailoredDoc, experience: newExp });
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
