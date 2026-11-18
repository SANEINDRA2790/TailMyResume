"use client";

import React, { useState } from "react";
import { MasterProfile } from "@/lib/types/profile";
import { ParsedJobDescription } from "@/lib/types/job";
import { GlobalJobListing } from "@/lib/types/global-job";
import { CareerAssistantView } from "./career-assistant-view";
import { BotIcon, XIcon, SparklesIcon } from "@/components/ui/icons";

interface FloatingAssistantDockProps {
  profile: MasterProfile;
  activeJob?: ParsedJobDescription | GlobalJobListing | null;
  onNavigateToTailor?: () => void;
}

export function FloatingAssistantDock({
  profile,
  activeJob,
  onNavigateToTailor,
}: FloatingAssistantDockProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40 no-print">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open AI Career Assistant"
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <BotIcon className="w-5 h-5 animate-pulse" />
          <span className="text-xs font-bold tracking-wide hidden sm:inline">
            {isOpen ? "Close Career Coach" : "AI Career Coach"}
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
        </button>
      </div>

      {/* Floating Dialog Modal / Drawer */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[95vw] sm:w-[480px] max-h-[85vh] h-[650px] shadow-2xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 border border-zinc-200 dark:border-zinc-800 no-print">
          <div className="h-full relative flex flex-col">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-10 p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition"
              title="Minimize Assistant"
            >
              <XIcon className="w-4 h-4" />
            </button>
            <CareerAssistantView
              profile={profile}
              activeJob={activeJob}
              onNavigateToTailor={() => {
                setIsOpen(false);
                if (onNavigateToTailor) onNavigateToTailor();
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
