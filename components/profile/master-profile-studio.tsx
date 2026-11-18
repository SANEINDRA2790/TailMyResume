"use client";

import React, { useState, useEffect } from "react";
import {
  MasterProfile,
  EmploymentItem,
  SkillItem,
  ProjectItem,
  EducationItem,
  CertificationItem,
  AchievementItem,
  EvidenceLevel,
} from "@/lib/types/profile";
import { StorageService } from "@/lib/storage/profile-storage";
import { EvidenceBadge } from "@/components/ui/evidence-badge";
import {
  UserIcon,
  BriefcaseIcon,
  SparklesIcon,
  AcademicCapIcon,
  AwardIcon,
  DownloadIcon,
  PlusIcon,
  TrashIcon,
  EditIcon,
  CheckIcon,
  RefreshCwIcon,
  GlobeIcon,
  SlidersIcon,
  AlertCircleIcon,
  LayersIcon,
} from "@/components/ui/icons";

export function MasterProfileStudio() {
  const [profile, setProfile] = useState<MasterProfile | null>(null);
  const [activeTab, setActiveTab] = useState<string>("contact");
  const [evidenceFilter, setEvidenceFilter] = useState<string>("all");
  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState("");
  const [importError, setImportError] = useState("");

  // Editing state
  const [editingItemType, setEditingItemType] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    StorageService.getMasterProfile().then((data) => {
      setProfile(data);
    });
  }, []);

  const triggerSave = async (updated: MasterProfile) => {
    setProfile(updated);
    await StorageService.saveMasterProfile(updated);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2000);
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900 dark:border-zinc-100"></div>
      </div>
    );
  }

  // Calculate profile completeness score
  const calculateCompleteness = (): number => {
    let score = 0;
    if (profile.contact.fullName && profile.contact.email) score += 15;
    if (profile.professionalSummary.baseText.length > 50) score += 15;
    if (profile.employmentHistory.length > 0) score += 20;
    if (profile.skills.length >= 10) score += 20;
    if (profile.education.length > 0) score += 10;
    if (profile.projects.length > 0) score += 10;
    if (profile.certifications.length > 0) score += 5;
    if (profile.achievements.length > 0) score += 5;
    return Math.min(100, score);
  };

  const completeness = calculateCompleteness();

  const handleExportJSON = () => {
    const jsonStr = StorageService.exportProfileAsJSON(profile);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MasterProfile_${profile.contact.fullName.replace(/\s+/g, "_")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = async () => {
    try {
      setImportError("");
      const imported = await StorageService.importProfileFromJSON(importJsonText);
      setProfile(imported);
      setIsImportModalOpen(false);
      setImportJsonText("");
      setIsSavedNotice(true);
      setTimeout(() => setIsSavedNotice(false), 2000);
    } catch (err: any) {
      setImportError(err.message || "Failed to parse JSON file.");
    }
  };

  const handleResetToDefault = async () => {
    if (window.confirm("Reset Master Profile to the authentic default baseline? Any unexported custom changes will be overwritten.")) {
      const reset = await StorageService.resetToDefaultProfile();
      setProfile(reset);
      setIsSavedNotice(true);
      setTimeout(() => setIsSavedNotice(false), 2000);
    }
  };

  // Filter skills or items by evidence
  const filterByEvidence = <T extends { evidenceLevel?: EvidenceLevel }>(items: T[]): T[] => {
    if (evidenceFilter === "all") return items;
    return items.filter((item) => item.evidenceLevel === evidenceFilter);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Profile Overview */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                {profile.contact.fullName}
              </h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Verified Single Source of Truth
              </span>
              {isSavedNotice && (
                <span className="inline-flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckIcon className="w-3.5 h-3.5 mr-1" /> Auto-saved
                </span>
              )}
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {profile.contact.professionalTitle} • {profile.contact.location}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportJSON}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition"
            >
              <DownloadIcon className="w-3.5 h-3.5" /> Export JSON
            </button>
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition"
            >
              <LayersIcon className="w-3.5 h-3.5" /> Import JSON
            </button>
            <button
              onClick={handleResetToDefault}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 rounded-lg transition"
            >
              <RefreshCwIcon className="w-3.5 h-3.5" /> Reset Default
            </button>
          </div>
        </div>

        {/* Profile Completeness Bar */}
        <div className="mt-5 pt-5 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
              Master Profile Completeness:
            </span>
            <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-zinc-900 dark:bg-zinc-100 h-2 rounded-full transition-all duration-500"
                style={{ width: `${completeness}%` }}
              />
            </div>
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
              {completeness}%
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Filter Evidence:</span>
            <select
              value={evidenceFilter}
              onChange={(e) => setEvidenceFilter(e.target.value)}
              className="text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-2 py-1 text-zinc-900 dark:text-zinc-100 focus:outline-hidden"
            >
              <option value="all">All Evidence Levels</option>
              <option value="professional">Verified Professional</option>
              <option value="academic">Academic / Degree</option>
              <option value="personal_project">Personal Projects</option>
              <option value="coursework">Coursework</option>
              <option value="theoretical">Theoretical Knowledge</option>
              <option value="learning">Currently Learning</option>
            </select>
          </div>
        </div>
      </div>

      {/* Navigation Tabs for 17 Master Domains */}
      <div className="flex overflow-x-auto pb-1 gap-2 border-b border-zinc-200 dark:border-zinc-800 text-sm">
        {[
          { id: "contact", label: "1. Contact & Identity", icon: UserIcon },
          { id: "summary", label: "2. Professional Summary", icon: SparklesIcon },
          { id: "employment", label: "3. Employment History", icon: BriefcaseIcon },
          { id: "skills", label: "4. Technical Skills Matrix", icon: SlidersIcon },
          { id: "education", label: "5. Academic Degrees", icon: AcademicCapIcon },
          { id: "certifications", label: "6. Certifications", icon: AwardIcon },
          { id: "projects", label: "7. Projects & Implementations", icon: LayersIcon },
          { id: "achievements", label: "8. Achievements", icon: AwardIcon },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-lg font-medium whitespace-nowrap transition border-b-2 -mb-px ${
                isActive
                  ? "border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-900"
                  : "border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: 1. Contact & Identity */}
      {activeTab === "contact" && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Personal & Contact Information
            </h3>
            <span className="text-xs text-zinc-500">Always synchronized across tailored outputs</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                Full Legal Name
              </label>
              <input
                type="text"
                value={profile.contact.fullName}
                onChange={(e) => {
                  const updated = { ...profile, contact: { ...profile.contact, fullName: e.target.value } };
                  triggerSave(updated);
                }}
                className="w-full text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                Headline / Professional Title
              </label>
              <input
                type="text"
                value={profile.contact.professionalTitle}
                onChange={(e) => {
                  const updated = { ...profile, contact: { ...profile.contact, professionalTitle: e.target.value } };
                  triggerSave(updated);
                }}
                className="w-full text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                Primary Email
              </label>
              <input
                type="email"
                value={profile.contact.email}
                onChange={(e) => {
                  const updated = { ...profile, contact: { ...profile.contact, email: e.target.value } };
                  triggerSave(updated);
                }}
                className="w-full text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                Phone Number (UK / International)
              </label>
              <input
                type="text"
                value={profile.contact.phone}
                onChange={(e) => {
                  const updated = { ...profile, contact: { ...profile.contact, phone: e.target.value } };
                  triggerSave(updated);
                }}
                className="w-full text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                Location (City, Country)
              </label>
              <input
                type="text"
                value={profile.contact.location}
                onChange={(e) => {
                  const updated = { ...profile, contact: { ...profile.contact, location: e.target.value } };
                  triggerSave(updated);
                }}
                className="w-full text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                value={profile.contact.linkedInUrl}
                onChange={(e) => {
                  const updated = { ...profile, contact: { ...profile.contact, linkedInUrl: e.target.value } };
                  triggerSave(updated);
                }}
                className="w-full text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                GitHub Profile URL
              </label>
              <input
                type="url"
                value={profile.contact.gitHubUrl}
                onChange={(e) => {
                  const updated = { ...profile, contact: { ...profile.contact, gitHubUrl: e.target.value } };
                  triggerSave(updated);
                }}
                className="w-full text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                Live Portfolio / Domain
              </label>
              <input
                type="url"
                value={profile.contact.portfolioUrl}
                onChange={(e) => {
                  const updated = { ...profile, contact: { ...profile.contact, portfolioUrl: e.target.value } };
                  triggerSave(updated);
                }}
                className="w-full text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 2. Professional Summary */}
      {activeTab === "summary" && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Core Professional Summary
              </h3>
              <p className="text-xs text-zinc-500">
                The baseline summary of authentic qualifications. Job-tailored resumes adapt from this single source.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
              Base Professional Overview
            </label>
            <textarea
              rows={5}
              value={profile.professionalSummary.baseText}
              onChange={(e) => {
                const updated = {
                  ...profile,
                  professionalSummary: {
                    ...profile.professionalSummary,
                    baseText: e.target.value,
                  },
                };
                triggerSave(updated);
              }}
              className="w-full text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 p-3 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Key Value Proposition Highlights
            </label>
            {profile.professionalSummary.highlights.map((highlight, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={highlight}
                  onChange={(e) => {
                    const newHighlights = [...profile.professionalSummary.highlights];
                    newHighlights[index] = e.target.value;
                    const updated = {
                      ...profile,
                      professionalSummary: {
                        ...profile.professionalSummary,
                        highlights: newHighlights,
                      },
                    };
                    triggerSave(updated);
                  }}
                  className="flex-1 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-1.5 text-zinc-900 dark:text-zinc-100"
                />
                <button
                  onClick={() => {
                    const newHighlights = profile.professionalSummary.highlights.filter((_, i) => i !== index);
                    const updated = {
                      ...profile,
                      professionalSummary: {
                        ...profile.professionalSummary,
                        highlights: newHighlights,
                      },
                    };
                    triggerSave(updated);
                  }}
                  className="p-1.5 text-zinc-400 hover:text-red-500 rounded-md transition"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const updated = {
                  ...profile,
                  professionalSummary: {
                    ...profile.professionalSummary,
                    highlights: [...profile.professionalSummary.highlights, ""],
                  },
                };
                triggerSave(updated);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-900 dark:text-zinc-100 hover:underline pt-2"
            >
              <PlusIcon className="w-3.5 h-3.5" /> Add Highlight Bullet
            </button>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 3. Employment History */}
      {activeTab === "employment" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Employment History ({profile.employmentHistory.length})
            </h3>
            <button
              onClick={() => {
                const newEmp: EmploymentItem = {
                  id: `emp-${Date.now()}`,
                  company: "New Company",
                  jobTitle: "Software / Data Engineer",
                  employmentType: "Full-time",
                  location: "London, UK",
                  startDate: "2023-01",
                  endDate: "Present",
                  isCurrent: true,
                  overview: "Role description overview...",
                  responsibilities: [],
                  technologiesUsed: [],
                };
                const updated = {
                  ...profile,
                  employmentHistory: [newEmp, ...profile.employmentHistory],
                };
                triggerSave(updated);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 rounded-lg transition"
            >
              <PlusIcon className="w-3.5 h-3.5" /> Add Employment Position
            </button>
          </div>

          {profile.employmentHistory.map((emp, empIndex) => (
            <div
              key={emp.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-4 shadow-xs"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={emp.jobTitle}
                      onChange={(e) => {
                        const newHistory = [...profile.employmentHistory];
                        newHistory[empIndex].jobTitle = e.target.value;
                        triggerSave({ ...profile, employmentHistory: newHistory });
                      }}
                      className="text-base font-bold text-zinc-900 dark:text-zinc-100 bg-transparent border-b border-dashed border-zinc-300 dark:border-zinc-700 focus:outline-hidden"
                    />
                    <span className="text-zinc-400">@</span>
                    <input
                      type="text"
                      value={emp.company}
                      onChange={(e) => {
                        const newHistory = [...profile.employmentHistory];
                        newHistory[empIndex].company = e.target.value;
                        triggerSave({ ...profile, employmentHistory: newHistory });
                      }}
                      className="text-base font-semibold text-zinc-700 dark:text-zinc-300 bg-transparent border-b border-dashed border-zinc-300 dark:border-zinc-700 focus:outline-hidden"
                    />
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">
                    {emp.location} • {emp.startDate} - {emp.endDate} ({emp.employmentType})
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete ${emp.jobTitle} at ${emp.company}?`)) {
                        const newHistory = profile.employmentHistory.filter((_, i) => i !== empIndex);
                        triggerSave({ ...profile, employmentHistory: newHistory });
                      }
                    }}
                    className="p-1.5 text-zinc-400 hover:text-red-500 rounded-md transition"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Responsibilities with Evidence Badges */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Documented Responsibilities & Accomplishments ({emp.responsibilities.length})
                  </span>
                  <button
                    onClick={() => {
                      const newResp = {
                        id: `resp-${Date.now()}`,
                        text: "Engineered scalable feature delivering measurable business value...",
                        evidenceLevel: "professional" as EvidenceLevel,
                        impactMetric: "",
                      };
                      const newHistory = [...profile.employmentHistory];
                      newHistory[empIndex].responsibilities.push(newResp);
                      triggerSave({ ...profile, employmentHistory: newHistory });
                    }}
                    className="inline-flex items-center gap-1 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:underline"
                  >
                    <PlusIcon className="w-3 h-3" /> Add Responsibility
                  </button>
                </div>

                <div className="space-y-2">
                  {emp.responsibilities.map((resp, respIndex) => (
                    <div
                      key={resp.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-zinc-50 dark:bg-zinc-800/50 p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800"
                    >
                      <div className="flex-1 w-full">
                        <input
                          type="text"
                          value={resp.text}
                          onChange={(e) => {
                            const newHistory = [...profile.employmentHistory];
                            newHistory[empIndex].responsibilities[respIndex].text = e.target.value;
                            triggerSave({ ...profile, employmentHistory: newHistory });
                          }}
                          className="w-full text-xs text-zinc-800 dark:text-zinc-200 bg-transparent focus:outline-hidden"
                        />
                        {resp.impactMetric && (
                          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block mt-0.5">
                            📊 Metric: {resp.impactMetric}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <select
                          value={resp.evidenceLevel}
                          onChange={(e) => {
                            const newHistory = [...profile.employmentHistory];
                            newHistory[empIndex].responsibilities[respIndex].evidenceLevel = e.target.value as EvidenceLevel;
                            triggerSave({ ...profile, employmentHistory: newHistory });
                          }}
                          className="text-[11px] bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded px-1.5 py-0.5 text-zinc-700 dark:text-zinc-300"
                        >
                          <option value="professional">Verified Professional</option>
                          <option value="academic">Academic</option>
                          <option value="personal_project">Personal Project</option>
                          <option value="coursework">Coursework</option>
                          <option value="theoretical">Theoretical</option>
                        </select>
                        <EvidenceBadge level={resp.evidenceLevel} />
                        <button
                          onClick={() => {
                            const newHistory = [...profile.employmentHistory];
                            newHistory[empIndex].responsibilities = newHistory[empIndex].responsibilities.filter((_, i) => i !== respIndex);
                            triggerSave({ ...profile, employmentHistory: newHistory });
                          }}
                          className="p-1 text-zinc-400 hover:text-red-500 transition"
                        >
                          <TrashIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technologies Used */}
              <div className="pt-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 block mb-2">
                  Technologies Applied
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {emp.technologiesUsed.map((tech, techIdx) => (
                    <span
                      key={techIdx}
                      className="px-2 py-0.5 text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded border border-zinc-200 dark:border-zinc-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT: 4. Technical Skills Matrix */}
      {activeTab === "skills" && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Technical Skills & Evidence Matrix ({filterByEvidence(profile.skills).length})
              </h3>
              <p className="text-xs text-zinc-500">
                Every skill is verified with an evidence level. Tailoring matches strictly against this matrix.
              </p>
            </div>
            <button
              onClick={() => {
                const newSkill: SkillItem = {
                  id: `sk-${Date.now()}`,
                  name: "New Technical Skill",
                  category: "programming_language",
                  proficiency: "Intermediate",
                  evidenceLevel: "professional",
                  yearsOfExperience: 2,
                };
                triggerSave({ ...profile, skills: [...profile.skills, newSkill] });
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 rounded-lg transition"
            >
              <PlusIcon className="w-3.5 h-3.5" /> Add New Skill
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filterByEvidence(profile.skills).map((skill, index) => (
              <div
                key={skill.id}
                className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) => {
                      const newSkills = [...profile.skills];
                      newSkills[index].name = e.target.value;
                      triggerSave({ ...profile, skills: newSkills });
                    }}
                    className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 bg-transparent focus:outline-hidden border-b border-transparent focus:border-zinc-400"
                  />
                  <button
                    onClick={() => {
                      const newSkills = profile.skills.filter((s) => s.id !== skill.id);
                      triggerSave({ ...profile, skills: newSkills });
                    }}
                    className="text-zinc-400 hover:text-red-500 transition p-1"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <span className="capitalize">{skill.category.replace(/_/g, " ")}</span>
                  <span>{skill.proficiency} {skill.yearsOfExperience ? `• ${skill.yearsOfExperience}y exp` : ""}</span>
                </div>

                <div className="pt-1 flex items-center justify-between">
                  <EvidenceBadge level={skill.evidenceLevel} />
                  <select
                    value={skill.evidenceLevel}
                    onChange={(e) => {
                      const newSkills = [...profile.skills];
                      newSkills[index].evidenceLevel = e.target.value as EvidenceLevel;
                      triggerSave({ ...profile, skills: newSkills });
                    }}
                    className="text-[10px] bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded px-1 text-zinc-700 dark:text-zinc-300"
                  >
                    <option value="professional">Professional</option>
                    <option value="academic">Academic</option>
                    <option value="personal_project">Personal</option>
                    <option value="coursework">Coursework</option>
                    <option value="theoretical">Theoretical</option>
                    <option value="learning">Learning</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 5. Academic Degrees */}
      {activeTab === "education" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Academic Qualifications ({profile.education.length})
            </h3>
            <button
              onClick={() => {
                const newEdu: EducationItem = {
                  id: `edu-${Date.now()}`,
                  institution: "University Name",
                  degree: "Bachelor of Science",
                  fieldOfStudy: "Computer Science",
                  startDate: "2018",
                  endDate: "2022",
                  location: "United Kingdom",
                  keyModules: [],
                };
                triggerSave({ ...profile, education: [...profile.education, newEdu] });
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 rounded-lg transition"
            >
              <PlusIcon className="w-3.5 h-3.5" /> Add Academic Degree
            </button>
          </div>

          {profile.education.map((edu, eduIndex) => (
            <div
              key={edu.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-4 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <div>
                  <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                    {edu.degree} in {edu.fieldOfStudy}
                  </h4>
                  <p className="text-xs text-zinc-500">
                    {edu.institution} • {edu.location} ({edu.startDate} - {edu.endDate})
                  </p>
                  {edu.grade && (
                    <span className="inline-block mt-1 text-xs font-medium text-blue-600 dark:text-blue-400">
                      Honors/Grade: {edu.grade}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    const newEdu = profile.education.filter((_, i) => i !== eduIndex);
                    triggerSave({ ...profile, education: newEdu });
                  }}
                  className="p-1 text-zinc-400 hover:text-red-500 transition"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>

              {edu.dissertationTitle && (
                <div className="text-xs text-zinc-700 dark:text-zinc-300">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">Dissertation:</span>{" "}
                  {edu.dissertationTitle}
                </div>
              )}

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 block mb-1.5">
                  Key Modules & Focus Areas
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {edu.keyModules.map((mod, modIdx) => (
                    <span
                      key={modIdx}
                      className="px-2 py-0.5 text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded border border-zinc-200 dark:border-zinc-700"
                    >
                      {mod}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT: 6. Certifications */}
      {activeTab === "certifications" && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Professional Certifications ({profile.certifications.length})
            </h3>
            <button
              onClick={() => {
                const newCert: CertificationItem = {
                  id: `cert-${Date.now()}`,
                  name: "New Professional Certification",
                  issuingOrganization: "Certifying Body",
                  issueDate: "2024-01",
                  skillsCovered: [],
                };
                triggerSave({ ...profile, certifications: [...profile.certifications, newCert] });
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 rounded-lg transition"
            >
              <PlusIcon className="w-3.5 h-3.5" /> Add Certification
            </button>
          </div>

          <div className="space-y-3">
            {profile.certifications.map((cert, certIdx) => (
              <div
                key={cert.id}
                className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <AwardIcon className="w-4 h-4 text-amber-500" />
                    <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{cert.name}</h4>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Issued by {cert.issuingOrganization} • {cert.issueDate}
                    {cert.credentialId ? ` • ID: ${cert.credentialId}` : ""}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {cert.skillsCovered.map((s, idx) => (
                      <span key={idx} className="text-[11px] bg-white dark:bg-zinc-700 px-1.5 py-0.5 rounded text-zinc-600 dark:text-zinc-300">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    const newCerts = profile.certifications.filter((_, i) => i !== certIdx);
                    triggerSave({ ...profile, certifications: newCerts });
                  }}
                  className="p-1 text-zinc-400 hover:text-red-500 transition"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 7. Projects & Implementations */}
      {activeTab === "projects" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Projects & Implementations ({filterByEvidence(profile.projects).length})
            </h3>
            <button
              onClick={() => {
                const newProj: ProjectItem = {
                  id: `proj-${Date.now()}`,
                  title: "New Implementation Project",
                  type: "professional",
                  role: "Lead Developer",
                  startDate: "2023-01",
                  endDate: "2023-06",
                  overview: "Project overview and purpose...",
                  responsibilities: [],
                  measurableOutcomes: [],
                  technologies: [],
                  evidenceLevel: "professional",
                };
                triggerSave({ ...profile, projects: [...profile.projects, newProj] });
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 rounded-lg transition"
            >
              <PlusIcon className="w-3.5 h-3.5" /> Add Project
            </button>
          </div>

          {filterByEvidence(profile.projects).map((proj, projIdx) => (
            <div
              key={proj.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-4 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">{proj.title}</h4>
                    <EvidenceBadge level={proj.evidenceLevel} />
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Role: {proj.role} • ({proj.startDate} - {proj.endDate || "Ongoing"})
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newProj = profile.projects.filter((p) => p.id !== proj.id);
                    triggerSave({ ...profile, projects: newProj });
                  }}
                  className="p-1 text-zinc-400 hover:text-red-500 transition"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-zinc-600 dark:text-zinc-400">{proj.overview}</p>

              {proj.measurableOutcomes.length > 0 && (
                <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 block mb-1">
                    Quantified Business / Technical Outcomes
                  </span>
                  <ul className="list-disc list-inside text-xs text-emerald-700 dark:text-emerald-400 space-y-0.5">
                    {proj.measurableOutcomes.map((out, idx) => (
                      <li key={idx}>{out}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 block mb-1.5">
                  Tech Stack Applied
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {proj.technologies.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded border border-zinc-200 dark:border-zinc-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT: 8. Achievements */}
      {activeTab === "achievements" && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Verified Professional Achievements ({profile.achievements.length})
            </h3>
            <button
              onClick={() => {
                const newAch: AchievementItem = {
                  id: `ach-${Date.now()}`,
                  title: "New Professional Award or Milestone",
                  context: "Recognition details...",
                  date: "2023-12",
                  quantifiedResult: "Quantified metric...",
                  category: "workplace",
                  evidenceLevel: "professional",
                };
                triggerSave({ ...profile, achievements: [...profile.achievements, newAch] });
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 rounded-lg transition"
            >
              <PlusIcon className="w-3.5 h-3.5" /> Add Achievement
            </button>
          </div>

          <div className="space-y-3">
            {profile.achievements.map((ach, achIdx) => (
              <div
                key={ach.id}
                className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{ach.title}</h4>
                    <EvidenceBadge level={ach.evidenceLevel} />
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">{ach.context}</p>
                  {ach.quantifiedResult && (
                    <span className="inline-block mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      🏆 Verified Outcome: {ach.quantifiedResult}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => {
                    const newAchs = profile.achievements.filter((_, i) => i !== achIdx);
                    triggerSave({ ...profile, achievements: newAchs });
                  }}
                  className="p-1 text-zinc-400 hover:text-red-500 transition"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 max-w-lg w-full space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Import Master Profile JSON</h3>
            <p className="text-xs text-zinc-500">
              Paste valid Master Profile JSON. This will update your single source of truth.
            </p>
            {importError && (
              <div className="p-2.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400 rounded-lg">
                {importError}
              </div>
            )}
            <textarea
              rows={8}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="Paste JSON here..."
              className="w-full text-xs font-mono rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 p-3 text-zinc-900 dark:text-zinc-100 focus:outline-hidden"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="px-3 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleImportJSON}
                className="px-3 py-1.5 text-xs font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 rounded-lg transition"
              >
                Validate & Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
