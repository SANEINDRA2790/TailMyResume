"use client";

import React, { useState, useEffect } from "react";
import { PlatformNav, NavTabId } from "@/components/layout/platform-nav";
import { MainDashboard } from "@/components/dashboard/main-dashboard";
import { MasterProfileStudio } from "@/components/profile/master-profile-studio";
import { GlobalJobDiscovery } from "@/components/jobs/global-job-discovery";
import { ApplicationTracker } from "@/components/jobs/application-tracker";
import { JDAnalyzerView } from "@/components/jd-analyzer/jd-analyzer-view";
import { TailorWizard } from "@/components/tailor/tailor-wizard";
import { CareerAssistantView } from "@/components/assistant/career-assistant-view";
import { ResumeLibraryView } from "@/components/library/resume-library-view";
import { TemplatesView } from "@/components/templates/templates-view";
import { SettingsView } from "@/components/settings/settings-view";
import { DownloadModal } from "@/components/export/download-modal";
import { FloatingAssistantDock } from "@/components/assistant/floating-assistant-dock";

import { MasterProfile } from "@/lib/types/profile";
import { ParsedJobDescription } from "@/lib/types/job";
import { TailoredResumeDocument } from "@/lib/types/tailored-resume";
import { StorageService } from "@/lib/storage/profile-storage";
import { initialMasterProfile } from "@/lib/storage/seed-data";

export default function Home() {
  const [activeTab, setActiveTab] = useState<NavTabId>("dashboard");
  const [profile, setProfile] = useState<MasterProfile>(initialMasterProfile);
  const [savedJobs, setSavedJobs] = useState<ParsedJobDescription[]>([]);
  const [tailoredResumes, setTailoredResumes] = useState<TailoredResumeDocument[]>([]);
  const [activeJobForTailoring, setActiveJobForTailoring] = useState<ParsedJobDescription | null>(null);
  const [assistantPrompt, setAssistantPrompt] = useState<string>("");

  // Modal download state
  const [downloadDoc, setDownloadDoc] = useState<TailoredResumeDocument | null>(null);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const refreshAllData = async () => {
    const prof = await StorageService.getMasterProfile();
    const jobs = await StorageService.getSavedJobs();
    const resumes = await StorageService.getTailoredResumes();
    setProfile(prof);
    setSavedJobs(jobs);
    setTailoredResumes(resumes);
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  const handleProceedToTailor = (job: ParsedJobDescription) => {
    setActiveJobForTailoring(job);
    setActiveTab("tailor");
  };

  const handleOpenDownloadModal = (doc: TailoredResumeDocument) => {
    setDownloadDoc(doc);
    setIsDownloadModalOpen(true);
  };

  const handleSelectResumeFromLibrary = (doc: TailoredResumeDocument) => {
    setActiveJobForTailoring(null);
    setActiveTab("tailor");
  };

  const handleOpenAssistantWithContext = (prompt: string, context: any) => {
    setAssistantPrompt(prompt);
    setActiveTab("assistant");
  };

  const completeness = 100;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Application Navbar with Theme Toggle */}
      <PlatformNav
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        profileCompletion={completeness}
      />

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "dashboard" && (
          <MainDashboard
            profile={profile}
            savedJobs={savedJobs}
            tailoredResumes={tailoredResumes}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === "master-profile" && <MasterProfileStudio />}

        {activeTab === "jobs" && (
          <GlobalJobDiscovery
            profile={profile}
            onSelectJobForTailoring={handleProceedToTailor}
            onOpenAssistantWithContext={handleOpenAssistantWithContext}
          />
        )}

        {activeTab === "tracker" && <ApplicationTracker />}

        {activeTab === "jd-analyzer" && (
          <JDAnalyzerView
            onProceedToTailor={handleProceedToTailor}
            savedJobs={savedJobs}
            onRefreshJobs={refreshAllData}
          />
        )}

        {activeTab === "tailor" && (
          <TailorWizard
            profile={profile}
            initialJob={activeJobForTailoring}
            savedJobs={savedJobs}
            onOpenDownloadModal={handleOpenDownloadModal}
            onRefreshResumes={refreshAllData}
          />
        )}

        {activeTab === "assistant" && (
          <CareerAssistantView
            profile={profile}
            activeJob={activeJobForTailoring}
            initialPrompt={assistantPrompt}
            onNavigateToTailor={() => setActiveTab("tailor")}
          />
        )}

        {activeTab === "library" && (
          <ResumeLibraryView
            tailoredResumes={tailoredResumes}
            onSelectResume={handleSelectResumeFromLibrary}
            onOpenDownloadModal={handleOpenDownloadModal}
            onRefresh={refreshAllData}
            onNavigateToTailor={() => setActiveTab("tailor")}
          />
        )}

        {activeTab === "templates" && (
          <TemplatesView
            profile={profile}
            onSelectTemplateToTailor={(tplId) => setActiveTab("tailor")}
          />
        )}

        {activeTab === "settings" && (
          <SettingsView profile={profile} onRefreshAll={refreshAllData} />
        )}
      </main>

      {/* Floating Global AI Assistant Dock (Always Accessible Across All Tabs) */}
      <FloatingAssistantDock
        profile={profile}
        activeJob={activeJobForTailoring}
        onNavigateToTailor={() => setActiveTab("tailor")}
      />

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-6 text-center text-xs text-zinc-500 transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            TailMyResume Pro • Global Job Discovery &amp; AI Career Platform
          </span>
          <span className="text-[11px] text-zinc-400">
            Candidate: Sane Indra Kiran • UK, USA &amp; India ATS Compliant
          </span>
        </div>
      </footer>

      {/* Export / Download Configuration Modal */}
      {downloadDoc && (
        <DownloadModal
          document={downloadDoc}
          isOpen={isDownloadModalOpen}
          onClose={() => setIsDownloadModalOpen(false)}
        />
      )}
    </div>
  );
}
