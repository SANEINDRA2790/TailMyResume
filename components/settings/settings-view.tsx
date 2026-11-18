"use client";

import React, { useState } from "react";
import { StorageService } from "@/lib/storage/profile-storage";
import { MasterProfile } from "@/lib/types/profile";
import { useTheme } from "@/components/theme/theme-provider";
import {
  ShieldCheckIcon,
  DownloadIcon,
  RefreshCwIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  SlidersIcon,
  GlobeIcon,
} from "@/components/ui/icons";

interface SettingsViewProps {
  profile: MasterProfile;
  onRefreshAll: () => void;
}

export function SettingsView({ profile, onRefreshAll }: SettingsViewProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const handleExportAllData = () => {
    const backup = {
      profile,
      exportedAt: new Date().toISOString(),
      platform: "TailMyResume Pro v1.0",
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `TailMyResume_FullBackup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <ShieldCheckIcon className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
          System Settings, Theme &amp; Storage
        </h2>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
          Manage environment credentials, color themes, anti-hallucination policies, and local data persistence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Theme Preferences (Module L) */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <SlidersIcon className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
            Theme Preferences (Module L)
          </h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Choose your preferred interface appearance. Changes apply instantly across the entire application while strictly preserving authentic white-paper formatting on generated resumes.
          </p>

          <div className="grid grid-cols-3 gap-2 pt-1">
            {[
              { id: "light" as const, label: "Light Mode", icon: "☀️" },
              { id: "dark" as const, label: "Dark Mode", icon: "🌙" },
              { id: "system" as const, label: "System Default", icon: "💻" },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setTheme(opt.id)}
                className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition ${
                  theme === opt.id
                    ? "border-zinc-900 dark:border-zinc-100 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 ring-1 ring-zinc-900 dark:ring-zinc-100"
                    : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400"
                }`}
              >
                <span className="text-base">{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>

          <div className="text-[11px] text-zinc-500 pt-1">
            Active theme: <strong className="capitalize text-zinc-800 dark:text-zinc-200">{theme}</strong> (Rendering: {resolvedTheme})
          </div>
        </div>

        {/* Card 2: AI Provider & Environment */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            AI Engine &amp; Vercel Environment
          </h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            The AI Career Assistant and Resume Optimization engine communicate server-side with Google Gemini. API keys are managed securely in serverless environment variables.
          </p>

          <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs space-y-1">
            <div className="font-semibold text-zinc-900 dark:text-zinc-100">
              Required Environment Variable:
            </div>
            <code className="text-emerald-700 dark:text-emerald-400 font-mono text-[11px] block">
              GEMINI_API_KEY=your_gemini_api_key_here
            </code>
            <p className="text-[10px] text-zinc-500 pt-1">
              If unset, the platform seamlessly runs on the deterministic role, country, and contextual coaching engines.
            </p>
          </div>
        </div>

        {/* Card 3: External Job Search API Configuration (Module J) */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <GlobeIcon className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
            Global Job Search API Integration (Module J)
          </h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Connect legitimate job aggregation API credentials to query live external feeds for the UK, USA, India, and other international markets.
          </p>

          <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs space-y-1.5 font-mono text-[11px]">
            <div>ADZUNA_APP_ID=your_app_id</div>
            <div>ADZUNA_APP_KEY=your_app_key</div>
            <div>USAJOBS_API_KEY=your_usajobs_key</div>
            <div>REED_API_KEY=your_reed_key</div>
          </div>
          <p className="text-[10px] text-zinc-500">
            A comprehensive verified global job database across 9+ international markets is bundled by default for immediate testing and matching.
          </p>
        </div>

        {/* Card 4: Storage & Local-First IndexedDB */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            Local-First Storage &amp; Persistence
          </h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Your Master Profile, job descriptions, tracked applications, and tailored resumes are stored locally in IndexedDB with localStorage fallback.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={handleExportAllData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 rounded-lg transition"
            >
              <DownloadIcon className="w-3.5 h-3.5" /> Export Full System JSON
            </button>
            <button
              onClick={async () => {
                if (window.confirm("Reset Master Profile to default verified seed?")) {
                  await StorageService.resetToDefaultProfile();
                  onRefreshAll();
                  alert("Master Profile reset to default verified seed.");
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 rounded-lg transition"
            >
              <RefreshCwIcon className="w-3.5 h-3.5" /> Reset to Default Seed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
