"use client";

import React from "react";
import { TailoredResumeDocument } from "@/lib/types/tailored-resume";
import { StorageService } from "@/lib/storage/profile-storage";
import {
  FileTextIcon,
  DownloadIcon,
  TrashIcon,
  SparklesIcon,
  EyeIcon,
} from "@/components/ui/icons";

interface ResumeLibraryViewProps {
  tailoredResumes: TailoredResumeDocument[];
  onSelectResume: (doc: TailoredResumeDocument) => void;
  onOpenDownloadModal: (doc: TailoredResumeDocument) => void;
  onRefresh: () => void;
  onNavigateToTailor: () => void;
}

export function ResumeLibraryView({
  tailoredResumes,
  onSelectResume,
  onOpenDownloadModal,
  onRefresh,
  onNavigateToTailor,
}: ResumeLibraryViewProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              <FileTextIcon className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
              Tailored Resume Library ({tailoredResumes.length})
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
              Every job-tailored resume draft, version, and approved recruitment document is safely stored locally.
            </p>
          </div>
          <button
            onClick={onNavigateToTailor}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 rounded-lg shadow-xs transition"
          >
            <SparklesIcon className="w-3.5 h-3.5" /> Tailor New Resume
          </button>
        </div>
      </div>

      {tailoredResumes.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xs">
          <FileTextIcon className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200">
            Your Resume Library is Empty
          </h3>
          <p className="text-xs text-zinc-500 max-w-md mx-auto mt-1 mb-5">
            Use the Tailoring Studio to adapt your Master Profile for Data Analyst, Data Scientist, AI/ML, or Software Engineer positions.
          </p>
          <button
            onClick={onNavigateToTailor}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 transition shadow-xs"
          >
            <SparklesIcon className="w-4 h-4" /> Start First Generation
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tailoredResumes.map((doc) => (
            <div
              key={doc.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-2xs flex flex-col justify-between space-y-4 hover:border-zinc-400 dark:hover:border-zinc-700 transition"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                    {doc.targetCountry.toUpperCase()} Format
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    {new Date(doc.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 leading-snug">
                  {doc.label}
                </h4>
                <p className="text-xs text-zinc-500">
                  Target: <span className="capitalize">{doc.targetRole.replace(/_/g, " ")}</span>
                  {doc.companyTarget ? ` • ${doc.companyTarget}` : ""}
                </p>
                <div className="text-[11px] text-zinc-500 capitalize">
                  Template: {doc.templateId.replace(/_/g, " ")}
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onSelectResume(doc)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200"
                  >
                    <EyeIcon className="w-3.5 h-3.5" /> Edit / Preview
                  </button>
                  <button
                    onClick={() => onOpenDownloadModal(doc)}
                    className="p-1.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    title="Export PDF / DOCX"
                  >
                    <DownloadIcon className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={async () => {
                    if (window.confirm(`Delete ${doc.label}?`)) {
                      await StorageService.deleteTailoredResume(doc.id);
                      onRefresh();
                    }
                  }}
                  className="p-1.5 text-zinc-400 hover:text-red-500 rounded-md transition"
                  title="Delete Draft"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
