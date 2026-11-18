import React from "react";
import { EvidenceLevel } from "@/lib/types/profile";

interface EvidenceBadgeProps {
  level: EvidenceLevel;
  className?: string;
}

export function EvidenceBadge({ level, className = "" }: EvidenceBadgeProps) {
  const configs: Record<
    EvidenceLevel,
    { label: string; bg: string; text: string; border: string; desc: string }
  > = {
    professional: {
      label: "Verified Professional",
      bg: "bg-emerald-50 dark:bg-emerald-950/60",
      text: "text-emerald-700 dark:text-emerald-300",
      border: "border-emerald-300 dark:border-emerald-800",
      desc: "Commercial enterprise production experience",
    },
    academic: {
      label: "Academic / Degree",
      bg: "bg-blue-50 dark:bg-blue-950/60",
      text: "text-blue-700 dark:text-blue-300",
      border: "border-blue-300 dark:border-blue-800",
      desc: "University research or postgraduate curriculum",
    },
    personal_project: {
      label: "Personal Project",
      bg: "bg-purple-50 dark:bg-purple-950/60",
      text: "text-purple-700 dark:text-purple-300",
      border: "border-purple-300 dark:border-purple-800",
      desc: "Independent end-to-end implementation",
    },
    coursework: {
      label: "Coursework",
      bg: "bg-amber-50 dark:bg-amber-950/60",
      text: "text-amber-700 dark:text-amber-300",
      border: "border-amber-300 dark:border-amber-800",
      desc: "Academic module assignments or coursework",
    },
    theoretical: {
      label: "Theoretical Knowledge",
      bg: "bg-zinc-100 dark:bg-zinc-800",
      text: "text-zinc-700 dark:text-zinc-300",
      border: "border-zinc-300 dark:border-zinc-700",
      desc: "Foundational concepts without production deployment",
    },
    learning: {
      label: "Currently Learning",
      bg: "bg-cyan-50 dark:bg-cyan-950/60",
      text: "text-cyan-700 dark:text-cyan-300",
      border: "border-cyan-300 dark:border-cyan-800",
      desc: "In-progress study or skill acquisition",
    },
  };

  const config = configs[level] || configs.theoretical;

  return (
    <span
      title={config.desc}
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-75" />
      {config.label}
    </span>
  );
}
