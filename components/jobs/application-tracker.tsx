"use client";

import React, { useState, useEffect } from "react";
import { TrackedApplication, ApplicationStatus } from "@/lib/types/global-job";
import { StorageService } from "@/lib/storage/profile-storage";
import {
  BookmarkIcon,
  CheckCircleIcon,
  TrashIcon,
  EditIcon,
  ExternalLinkIcon,
  ClockIcon,
  PlusIcon,
  XIcon,
} from "@/components/ui/icons";

export function ApplicationTracker() {
  const [applications, setApplications] = useState<TrackedApplication[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editingApp, setEditingApp] = useState<TrackedApplication | null>(null);

  const loadApplications = async () => {
    const list = await StorageService.getTrackedApplications();
    setApplications(list);
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: ApplicationStatus) => {
    const app = applications.find((a) => a.id === id);
    if (!app) return;
    const updated = { ...app, status: newStatus, updatedAt: new Date().toISOString() };
    await StorageService.saveTrackedApplication(updated);
    loadApplications();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Remove this application from tracking?")) {
      await StorageService.deleteTrackedApplication(id);
      loadApplications();
    }
  };

  const statuses: ApplicationStatus[] = ["Saved", "Applied", "Interviewing", "Offered", "Rejected"];

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case "Saved":
        return "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700";
      case "Applied":
        return "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      case "Interviewing":
        return "bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800";
      case "Offered":
        return "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
      case "Rejected":
        return "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800";
    }
  };

  const filtered = applications.filter(
    (a) => statusFilter === "all" || a.status === statusFilter
  );

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
              <BookmarkIcon className="w-3.5 h-3.5" /> Career Application Pipeline
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mt-1">
              Application Tracker ({applications.length})
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
              Track the full progression of your job submissions from initial discovery to interviews and offers.
            </p>
          </div>

          <div className="flex flex-wrap gap-1 text-xs">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                statusFilter === "all"
                  ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-xs"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200"
              }`}
            >
              All ({applications.length})
            </button>
            {statuses.map((st) => {
              const count = applications.filter((a) => a.status === st).length;
              return (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition ${
                    statusFilter === st
                      ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-xs"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200"
                  }`}
                >
                  {st} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center shadow-xs">
          <BookmarkIcon className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            No Applications Found
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1">
            Track jobs directly from Global Job Discovery to manage your recruitment pipeline here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((app) => (
            <div
              key={app.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-zinc-400 dark:hover:border-zinc-700 transition"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                      app.status
                    )}`}
                  >
                    {app.status}
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    {app.appliedDate || new Date(app.updatedAt).toLocaleDateString()}
                  </span>
                </div>

                <h4 className="font-bold text-base text-zinc-900 dark:text-zinc-50 leading-snug">
                  {app.jobTitle}
                </h4>
                <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                  {app.company} • {app.location}
                </p>

                {app.salary && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                    {app.salary}
                  </p>
                )}

                {app.notes && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/60 p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800">
                    {app.notes}
                  </p>
                )}
              </div>

              {/* Status Selector & Actions */}
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-1">
                  <select
                    value={app.status}
                    onChange={(e) => handleUpdateStatus(app.id, e.target.value as ApplicationStatus)}
                    className="text-xs bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-1 text-zinc-800 dark:text-zinc-200 focus:outline-hidden"
                  >
                    {statuses.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                  {app.sourceUrl && (
                    <a
                      href={app.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-zinc-500 hover:text-blue-600"
                      title="View Job"
                    >
                      <ExternalLinkIcon className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(app.id)}
                  className="p-1 text-zinc-400 hover:text-red-500 rounded-md transition"
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
