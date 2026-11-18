"use client";

import React, { useState } from "react";
import { ResumeTemplateId, TailoredResumeDocument } from "@/lib/types/tailored-resume";
import { MasterProfile } from "@/lib/types/profile";
import { generateTailoredResumeDocument } from "@/lib/services/resume-optimizer";
import { ResumePreview } from "@/components/editor/resume-preview";
import { LayersIcon, CheckCircleIcon } from "@/components/ui/icons";

interface TemplatesViewProps {
  profile: MasterProfile;
  onSelectTemplateToTailor: (templateId: ResumeTemplateId) => void;
}

export function TemplatesView({ profile, onSelectTemplateToTailor }: TemplatesViewProps) {
  const [activeTemplate, setActiveTemplate] = useState<ResumeTemplateId>("modern_professional");

  const templates: {
    id: ResumeTemplateId;
    name: string;
    description: string;
    recommendedFor: string;
    features: string[];
  }[] = [
    {
      id: "modern_professional",
      name: "1. Modern Professional",
      description: "Clean typographical hierarchy, subtle header rules, well-proportioned sections.",
      recommendedFor: "General Software Engineering, Data Analytics, Corporate Roles",
      features: ["Single-column clean reading", "ATS-optimized headings", "Bold metrics emphasis"],
    },
    {
      id: "minimal_ats",
      name: "2. Minimal ATS",
      description: "High-density standard monospace/sans layout designed for 100% automated parseability.",
      recommendedFor: "Large Enterprise portals (Workday, Taleo, Greenhouse)",
      features: ["Zero decorative lines", "Standardized section markers", "High text density"],
    },
    {
      id: "corporate_executive",
      name: "3. Corporate Executive",
      description: "Refined serif typography with dedicated Executive Summary and Areas of Expertise.",
      recommendedFor: "Lead Engineers, Engineering Managers, Principal Architects",
      features: ["Executive summary prominence", "Leadership competencies grid", "Distinguished styling"],
    },
    {
      id: "technical_specialist",
      name: "4. Technical Specialist",
      description: "Technical stack matrix placed directly below profile with inline technology tagging.",
      recommendedFor: "Cloud, Full-Stack, AI/ML Engineers & Systems Developers",
      features: ["Tech stack highlighting", "Repository & project focus", "Engineering position layout"],
    },
    {
      id: "data_analytics",
      name: "5. Data & Analytics Professional",
      description: "Structured specifically for Data Analysts, BI Specialists, and Analytics Developers.",
      recommendedFor: "Data Analysts, BI Developers, Reporting Specialists",
      features: ["KPI & Metric impact styling", "BI Tools & SQL matrix", "Executive reporting focus"],
    },
  ];

  // Dummy mock document to preview templates with Sane Indra Kiran's profile
  const previewDoc: TailoredResumeDocument = generateTailoredResumeDocument(
    profile,
    {
      id: "sample-job",
      rawText: "Sample Job",
      parsedAt: new Date().toISOString(),
      jobTitle: "Senior Technology Professional",
      companyName: "Enterprise Client",
      location: "London, UK",
      seniorityLevel: "Senior",
      overviewSummary: "Overview...",
      mandatoryRequirements: [],
      desirableRequirements: [],
      responsibilities: [],
      extractedKeywords: ["SQL", "Python", "Power BI", "C#", ".NET Core"],
    },
    "data_analyst",
    "uk"
  );
  previewDoc.templateId = activeTemplate;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-2xs">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <LayersIcon className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
          ATS-Compliant Resume Templates (5 Styles)
        </h2>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
          Every template is engineered for clean reading order, proper margins, selectable text, and zero awkward page breaks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Template Selector Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => setActiveTemplate(tpl.id)}
              className={`p-4 rounded-xl border cursor-pointer transition ${
                activeTemplate === tpl.id
                  ? "border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800/80 ring-1 ring-zinc-900 dark:ring-zinc-100"
                  : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 bg-white dark:bg-zinc-900"
              }`}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{tpl.name}</h4>
                {activeTemplate === tpl.id && (
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
                    Active Preview
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500 mt-1">{tpl.description}</p>
              <div className="mt-2 text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">
                Best For: {tpl.recommendedFor}
              </div>
            </div>
          ))}
        </div>

        {/* Live Template A4 Preview (7 cols) */}
        <div className="lg:col-span-7 overflow-x-auto pb-4">
          <ResumePreview
            document={previewDoc}
            templateId={activeTemplate}
            readOnly={true}
          />
        </div>
      </div>
    </div>
  );
}
