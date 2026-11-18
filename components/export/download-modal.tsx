"use client";

import React, { useState } from "react";
import { TailoredResumeDocument, ResumeTemplateId } from "@/lib/types/tailored-resume";
import { CareerCategory, TargetCountry } from "@/lib/types/profile";
import {
  DownloadIcon,
  XIcon,
  CheckCircleIcon,
  FileTextIcon,
  SparklesIcon,
} from "@/components/ui/icons";

interface DownloadModalProps {
  document: TailoredResumeDocument;
  isOpen: boolean;
  onClose: () => void;
}

export function DownloadModal({ document, isOpen, onClose }: DownloadModalProps) {
  const [targetRole, setTargetRole] = useState<CareerCategory>(document.targetRole);
  const [targetCountry, setTargetCountry] = useState<TargetCountry>(document.targetCountry);
  const [templateId, setTemplateId] = useState<ResumeTemplateId>(document.templateId);
  const [versionNumber, setVersionNumber] = useState<number>(document.versionNumber || 1);
  const [companyLabel, setCompanyLabel] = useState<string>(document.companyTarget || "");
  const [isExportingDocx, setIsExportingDocx] = useState(false);

  if (!isOpen) return null;

  // Format exact standardized filename: Indra_Kiran_Sane_Data_Analyst_UK_Resume
  const cleanName = document.contact.fullName.replace(/\s+/g, "_");
  const cleanRole = targetRole
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\s+/g, "_");
  const cleanCountry = targetCountry.toUpperCase();
  const baseFilename = `${cleanName}_${cleanRole}_${cleanCountry}_Resume`;

  const handleDownloadDocx = async () => {
    setIsExportingDocx(true);
    try {
      const updatedDoc: TailoredResumeDocument = {
        ...document,
        targetRole,
        targetCountry,
        templateId,
        versionNumber,
        companyTarget: companyLabel,
      };

      const res = await fetch("/api/export-docx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedDoc),
      });

      if (!res.ok) throw new Error("Server error generating document");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement("a");
      a.href = url;
      a.download = `${baseFilename}.doc`;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(err.message || "Failed to download document");
    } finally {
      setIsExportingDocx(false);
    }
  };

  const handleDownloadPdf = () => {
    // Set document title temporarily to ensure browser print dialog defaults to standardized filename
    const originalTitle = window.document.title;
    window.document.title = `${baseFilename}.pdf`;
    window.print();
    setTimeout(() => {
      window.document.title = originalTitle;
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-7 max-w-lg w-full space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-900">
              <DownloadIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Pre-Download Document Configuration
              </h3>
              <p className="text-xs text-zinc-500">
                Configure country, template, and export format (Module I)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg transition"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Configuration Fields */}
        <div className="space-y-4 text-xs">
          {/* Target Role */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-zinc-500 mb-1">
              1. Target Role Category
            </label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value as CareerCategory)}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 text-zinc-900 dark:text-zinc-100 focus:outline-hidden"
            >
              <option value="data_analyst">Data Analyst</option>
              <option value="data_scientist">Data Scientist</option>
              <option value="ai_ml_engineer">AI / Machine Learning Engineer</option>
              <option value="software_engineer">Software Engineer / Full-Stack Developer</option>
            </select>
          </div>

          {/* Target Country Format */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-zinc-500 mb-1">
              2. Country Recruitment Format
            </label>
            <select
              value={targetCountry}
              onChange={(e) => setTargetCountry(e.target.value as TargetCountry)}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 text-zinc-900 dark:text-zinc-100 focus:outline-hidden"
            >
              <option value="uk">United Kingdom (UK CV)</option>
              <option value="usa">United States (USA Resume)</option>
              <option value="india">India (Corporate CV)</option>
            </select>
          </div>

          {/* Selected Template */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-zinc-500 mb-1">
              3. ATS Professional Template
            </label>
            <select
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value as ResumeTemplateId)}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 text-zinc-900 dark:text-zinc-100 focus:outline-hidden"
            >
              <option value="modern_professional">Modern Professional</option>
              <option value="minimal_ats">Minimal ATS</option>
              <option value="corporate_executive">Corporate Executive</option>
              <option value="technical_specialist">Technical Specialist</option>
              <option value="data_analytics">Data & Analytics Professional</option>
            </select>
          </div>

          {/* Company Label */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-zinc-500 mb-1">
              4. Company or Job Reference (Optional)
            </label>
            <input
              type="text"
              value={companyLabel}
              onChange={(e) => setCompanyLabel(e.target.value)}
              placeholder="e.g. Monzo Bank"
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 text-zinc-900 dark:text-zinc-100 focus:outline-hidden"
            />
          </div>

          {/* Standardized Filename Preview */}
          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
              Standardized ATS Filename Preview:
            </span>
            <span className="font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-100 mt-1 block">
              {baseFilename}.[pdf|doc]
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleDownloadPdf}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 transition shadow-xs"
          >
            <DownloadIcon className="w-4 h-4" />
            Download ATS PDF
          </button>
          <button
            onClick={handleDownloadDocx}
            disabled={isExportingDocx}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 transition"
          >
            <FileTextIcon className="w-4 h-4" />
            {isExportingDocx ? "Generating..." : "Download Word (.doc)"}
          </button>
        </div>
      </div>
    </div>
  );
}
