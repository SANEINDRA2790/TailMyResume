"use client";

import React from "react";
import {
  FileTextIcon,
  UserIcon,
  SparklesIcon,
  SlidersIcon,
  BriefcaseIcon,
  LayersIcon,
  SettingsIcon,
  ShieldCheckIcon,
  GlobeIcon,
  BookmarkIcon,
  BotIcon,
} from "@/components/ui/icons";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export type NavTabId =
  | "dashboard"
  | "master-profile"
  | "jobs"
  | "tracker"
  | "jd-analyzer"
  | "tailor"
  | "assistant"
  | "library"
  | "templates"
  | "settings";

interface PlatformNavProps {
  activeTab: NavTabId;
  onTabChange: (tab: NavTabId) => void;
  profileCompletion: number;
}

export function PlatformNav({ activeTab, onTabChange, profileCompletion }: PlatformNavProps) {
  const navItems: { id: NavTabId; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: "dashboard", label: "Dashboard", icon: SparklesIcon },
    { id: "master-profile", label: "Master Profile", icon: UserIcon },
    { id: "jobs", label: "Global Jobs", icon: GlobeIcon, badge: "Global" },
    { id: "tracker", label: "Tracker", icon: BookmarkIcon },
    { id: "jd-analyzer", label: "JD Analyzer", icon: BriefcaseIcon },
    { id: "tailor", label: "Tailor Resume", icon: SlidersIcon },
    { id: "assistant", label: "AI Career Coach", icon: BotIcon, badge: "AI" },
    { id: "library", label: "Library", icon: FileTextIcon },
    { id: "templates", label: "Templates", icon: LayersIcon },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Product Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onTabChange("dashboard")}
              className="flex items-center gap-2.5 focus:outline-hidden text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-900 shadow-xs">
                <FileTextIcon className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-base tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                  TailMyResume
                  <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                    Pro
                  </span>
                </span>
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block -mt-0.5">
                  Global Jobs &amp; ATS Resume Intelligence
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                    isActive
                      ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-2xs font-semibold"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                  {item.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                      {item.badge}
                    </span>
                  )}
                  {item.id === "master-profile" && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                      {profileCompletion}%
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Header Actions: Theme Toggle + Quick Tailor Action */}
          <div className="flex items-center gap-2">
            <ThemeToggle showLabel={false} />
            <button
              onClick={() => onTabChange("tailor")}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-lg shadow-xs transition"
            >
              <SparklesIcon className="w-3.5 h-3.5" />
              Tailor Resume
            </button>
          </div>
        </div>

        {/* Mobile / Compact Subnav Row */}
        <div className="flex xl:hidden overflow-x-auto py-2 gap-1 border-t border-zinc-100 dark:border-zinc-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition ${
                  isActive
                    ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold"
                    : "text-zinc-600 dark:text-zinc-400"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
