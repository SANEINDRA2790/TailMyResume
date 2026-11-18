"use client";

import React from "react";
import { TailoredResumeDocument, ResumeTemplateId } from "@/lib/types/tailored-resume";

interface ResumePreviewProps {
  document: TailoredResumeDocument;
  templateId?: ResumeTemplateId;
  readOnly?: boolean;
  onUpdateSummary?: (newText: string) => void;
  onUpdateBullet?: (empId: string, bulletId: string, newText: string) => void;
}

export function ResumePreview({
  document,
  templateId = document.templateId,
  readOnly = true,
  onUpdateSummary,
  onUpdateBullet,
}: ResumePreviewProps) {
  const { contact, summary, prioritizedSkills, experience, projects, education, certifications, achievements, formatting } =
    document;

  const fontSizes = {
    small: "text-[11px] leading-[1.35]",
    medium: "text-[12px] leading-[1.45]",
    large: "text-[13px] leading-[1.55]",
  };

  const lineSpacings = {
    compact: "space-y-2",
    normal: "space-y-3.5",
    relaxed: "space-y-5",
  };

  const marginPaddings = {
    narrow: "p-8",
    normal: "p-10",
    wide: "p-12",
  };

  // Base A4 Print Styling wrapper
  return (
    <div
      id="printable-resume-document"
      className={`bg-white text-zinc-900 shadow-lg border border-zinc-200 dark:border-zinc-700 mx-auto max-w-[800px] w-full min-h-[1050px] transition-all font-sans ${marginPaddings[formatting.margins]} ${fontSizes[formatting.fontSize]}`}
    >
      {/* TEMPLATE 1: Modern Professional */}
      {templateId === "modern_professional" && (
        <div className={lineSpacings[formatting.lineSpacing]}>
          {/* Header */}
          <div className="border-b-2 border-zinc-900 pb-3 text-center">
            <h1 className="text-2xl font-bold tracking-tight uppercase text-zinc-900">
              {contact.fullName}
            </h1>
            <p className="text-xs font-semibold text-zinc-700 tracking-wide mt-0.5">
              {contact.professionalTitle}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-zinc-600 mt-1.5 font-medium">
              <span>{contact.location}</span>
              <span>•</span>
              <a href={`mailto:${contact.email}`} className="text-zinc-800 hover:underline">{contact.email}</a>
              <span>•</span>
              <span>{contact.phone}</span>
              {contact.linkedInUrl && (
                <>
                  <span>•</span>
                  <a href={contact.linkedInUrl} target="_blank" rel="noreferrer" className="text-zinc-800 hover:underline">
                    LinkedIn
                  </a>
                </>
              )}
              {contact.gitHubUrl && (
                <>
                  <span>•</span>
                  <a href={contact.gitHubUrl} target="_blank" rel="noreferrer" className="text-zinc-800 hover:underline">
                    GitHub
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Professional Summary */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-300 pb-0.5 mb-1.5">
              Professional Summary
            </h2>
            {readOnly ? (
              <p className="text-zinc-800 text-justify leading-relaxed">{summary.tailoredText}</p>
            ) : (
              <textarea
                value={summary.tailoredText}
                onChange={(e) => onUpdateSummary && onUpdateSummary(e.target.value)}
                rows={3}
                className="w-full text-xs p-1.5 border border-zinc-300 rounded focus:outline-hidden"
              />
            )}
          </div>

          {/* Key Skills Matrix */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-300 pb-0.5 mb-1.5">
              Technical & Core Competencies
            </h2>
            <div className="space-y-1">
              {prioritizedSkills.map((cat, idx) => (
                <div key={idx} className="text-[11px]">
                  <span className="font-bold text-zinc-900">{cat.categoryName}: </span>
                  <span className="text-zinc-700">{cat.skills.join(" • ")}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Employment Experience */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-300 pb-0.5 mb-2">
              Professional Experience
            </h2>
            <div className="space-y-3">
              {experience.map((emp) => (
                <div key={emp.id} className="space-y-1">
                  <div className="flex justify-between items-baseline text-xs font-bold text-zinc-900">
                    <div>
                      <span>{emp.jobTitle}</span>
                      <span className="font-normal text-zinc-600"> — {emp.company}</span>
                    </div>
                    <span className="text-[11px] text-zinc-600 font-medium">
                      {emp.startDate} – {emp.endDate} | {emp.location}
                    </span>
                  </div>
                  <ul className="list-disc list-outside pl-4 space-y-1 text-zinc-800">
                    {emp.bullets.map((b) => (
                      <li key={b.id} className="leading-snug">
                        {readOnly ? (
                          b.tailoredText
                        ) : (
                          <input
                            type="text"
                            value={b.tailoredText}
                            onChange={(e) =>
                              onUpdateBullet && onUpdateBullet(emp.id, b.id, e.target.value)
                            }
                            className="w-full border-b border-zinc-200 text-xs py-0.5 focus:outline-hidden"
                          />
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Relevant Projects */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-300 pb-0.5 mb-2">
              Key Implementations & Projects
            </h2>
            <div className="space-y-2">
              {projects.filter((p) => p.isIncluded).map((proj) => (
                <div key={proj.id} className="space-y-0.5">
                  <div className="flex justify-between items-baseline text-xs font-bold text-zinc-900">
                    <span>
                      {proj.title} <span className="font-normal text-zinc-600">({proj.role})</span>
                    </span>
                    <span className="text-[11px] text-zinc-500 font-medium">{proj.dates}</span>
                  </div>
                  <div className="text-[11px] text-zinc-600">
                    <span className="font-semibold text-zinc-800">Technologies: </span>
                    {proj.technologies.join(", ")}
                  </div>
                  <ul className="list-disc list-outside pl-4 space-y-0.5 text-zinc-800">
                    {proj.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Certifications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-300 pb-0.5 mb-1.5">
                Education
              </h2>
              {education.map((edu, i) => (
                <div key={i} className="mb-2">
                  <div className="font-bold text-zinc-900">{edu.degree}</div>
                  <div className="text-[11px] text-zinc-700">{edu.institution} ({edu.dates})</div>
                  {edu.details.map((d, di) => (
                    <div key={di} className="text-[10px] text-zinc-600">{d}</div>
                  ))}
                </div>
              ))}
            </div>

            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-300 pb-0.5 mb-1.5">
                Certifications & Accreditations
              </h2>
              <ul className="list-disc list-outside pl-4 space-y-1 text-zinc-700">
                {certifications.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TEMPLATE 2: Minimal ATS */}
      {templateId === "minimal_ats" && (
        <div className="font-mono text-zinc-900 space-y-4">
          <div className="text-center pb-2 border-b border-zinc-400">
            <h1 className="text-xl font-bold uppercase">{contact.fullName}</h1>
            <p className="text-xs mt-1">
              {contact.location} | {contact.email} | {contact.phone}
            </p>
            <p className="text-[11px] text-zinc-600">
              {contact.linkedInUrl} | {contact.gitHubUrl}
            </p>
          </div>

          <div>
            <h2 className="font-bold uppercase text-xs border-b border-zinc-400 pb-0.5 mb-1">
              SUMMARY
            </h2>
            <p className="text-xs text-justify">{summary.tailoredText}</p>
          </div>

          <div>
            <h2 className="font-bold uppercase text-xs border-b border-zinc-400 pb-0.5 mb-1">
              TECHNICAL SKILLS
            </h2>
            {prioritizedSkills.map((cat, i) => (
              <div key={i} className="text-xs">
                <strong>{cat.categoryName}:</strong> {cat.skills.join(", ")}
              </div>
            ))}
          </div>

          <div>
            <h2 className="font-bold uppercase text-xs border-b border-zinc-400 pb-0.5 mb-1">
              EXPERIENCE
            </h2>
            {experience.map((emp) => (
              <div key={emp.id} className="mb-3">
                <div className="flex justify-between font-bold text-xs">
                  <span>{emp.jobTitle.toUpperCase()} - {emp.company.toUpperCase()}</span>
                  <span>{emp.startDate} - {emp.endDate}</span>
                </div>
                <div className="text-[11px] italic mb-1">{emp.location}</div>
                <ul className="list-disc list-outside pl-4 text-xs space-y-1">
                  {emp.bullets.map((b) => (
                    <li key={b.id}>{b.tailoredText}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div>
            <h2 className="font-bold uppercase text-xs border-b border-zinc-400 pb-0.5 mb-1">
              EDUCATION & CERTIFICATIONS
            </h2>
            {education.map((edu, i) => (
              <div key={i} className="text-xs mb-1">
                <strong>{edu.degree}</strong>, {edu.institution} ({edu.dates})
              </div>
            ))}
            {certifications.map((c, i) => (
              <div key={i} className="text-xs">• {c}</div>
            ))}
          </div>
        </div>
      )}

      {/* TEMPLATE 3: Corporate Executive */}
      {templateId === "corporate_executive" && (
        <div className="space-y-4 font-serif">
          <div className="text-center border-b-2 border-zinc-800 pb-4">
            <h1 className="text-2xl font-bold tracking-wider text-zinc-900">{contact.fullName}</h1>
            <p className="text-xs italic text-zinc-700 mt-1">{contact.professionalTitle}</p>
            <div className="text-xs text-zinc-600 mt-1">
              {contact.location} • {contact.email} • {contact.phone}
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-800 border-b border-zinc-300 pb-1 mb-2 font-sans">
              Executive Profile
            </h2>
            <p className="text-xs text-justify leading-relaxed">{summary.tailoredText}</p>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-800 border-b border-zinc-300 pb-1 mb-2 font-sans">
              Areas of Expertise
            </h2>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {prioritizedSkills.map((cat, i) => (
                <div key={i}>
                  <strong className="block text-zinc-900">{cat.categoryName}</strong>
                  <span className="text-zinc-700">{cat.skills.join(", ")}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-800 border-b border-zinc-300 pb-1 mb-2 font-sans">
              Leadership & Professional Career
            </h2>
            {experience.map((emp) => (
              <div key={emp.id} className="mb-3">
                <div className="flex justify-between font-bold text-xs">
                  <span>{emp.jobTitle} | {emp.company}</span>
                  <span className="font-normal text-zinc-600">{emp.startDate} – {emp.endDate}</span>
                </div>
                <ul className="list-disc list-outside pl-4 text-xs space-y-1 mt-1 text-zinc-800">
                  {emp.bullets.map((b) => (
                    <li key={b.id}>{b.tailoredText}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-800 border-b border-zinc-300 pb-1 mb-2 font-sans">
              Education & Honors
            </h2>
            {education.map((edu, i) => (
              <div key={i} className="text-xs">
                <strong>{edu.degree}</strong> — {edu.institution} ({edu.dates})
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TEMPLATE 4: Technical Specialist */}
      {templateId === "technical_specialist" && (
        <div className="space-y-4 font-sans">
          <div className="bg-zinc-100 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-zinc-900">{contact.fullName}</h1>
              <p className="text-xs font-semibold text-zinc-700">{contact.professionalTitle}</p>
            </div>
            <div className="text-[11px] text-zinc-600 mt-2 sm:mt-0 text-left sm:text-right">
              <div>{contact.email} | {contact.phone}</div>
              <div>{contact.location} | {contact.gitHubUrl}</div>
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-800 border-b-2 border-zinc-800 pb-0.5 mb-1.5">
              Engineering Profile
            </h2>
            <p className="text-xs text-zinc-800">{summary.tailoredText}</p>
          </div>

          <div className="bg-zinc-50 p-3 rounded border border-zinc-200">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-2">
              Technical Stack & Architecture
            </h2>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {prioritizedSkills.map((cat, i) => (
                <div key={i}>
                  <span className="font-bold text-zinc-900 block">{cat.categoryName}</span>
                  <span className="text-zinc-700">{cat.skills.join(" • ")}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-800 border-b-2 border-zinc-800 pb-0.5 mb-2">
              Engineering Positions
            </h2>
            {experience.map((emp) => (
              <div key={emp.id} className="mb-3">
                <div className="flex justify-between font-bold text-xs text-zinc-900">
                  <span>{emp.jobTitle} @ {emp.company}</span>
                  <span className="text-zinc-600 font-normal">{emp.startDate} - {emp.endDate}</span>
                </div>
                <ul className="list-disc list-outside pl-4 text-xs space-y-1 mt-1 text-zinc-800">
                  {emp.bullets.map((b) => (
                    <li key={b.id}>{b.tailoredText}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-800 border-b-2 border-zinc-800 pb-0.5 mb-2">
              Projects & Repositories
            </h2>
            {projects.filter((p) => p.isIncluded).map((proj) => (
              <div key={proj.id} className="mb-2 text-xs">
                <div className="font-bold text-zinc-900">{proj.title}</div>
                <div className="text-[11px] text-zinc-600">Stack: {proj.technologies.join(", ")}</div>
                <ul className="list-disc list-outside pl-4 text-zinc-800 space-y-0.5">
                  {proj.bullets.map((b, bi) => (
                    <li key={bi}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TEMPLATE 5: Data & Analytics Professional */}
      {templateId === "data_analytics" && (
        <div className="space-y-4 font-sans">
          <div className="border-b-2 border-emerald-700 pb-3">
            <div className="flex justify-between items-baseline">
              <h1 className="text-2xl font-black text-zinc-900">{contact.fullName}</h1>
              <span className="text-xs font-bold uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                Data & BI Specialist
              </span>
            </div>
            <p className="text-xs font-medium text-zinc-700 mt-1">{contact.professionalTitle}</p>
            <div className="flex gap-4 text-[11px] text-zinc-600 mt-1 font-medium">
              <span>{contact.location}</span>
              <span>{contact.email}</span>
              <span>{contact.phone}</span>
              <span>{contact.linkedInUrl}</span>
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-900 border-b border-emerald-200 pb-0.5 mb-1.5">
              Analytics Profile & Business Impact
            </h2>
            <p className="text-xs text-zinc-800 text-justify">{summary.tailoredText}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-zinc-50 p-3 rounded-lg border border-zinc-200">
            {prioritizedSkills.map((cat, i) => (
              <div key={i} className="text-xs">
                <span className="font-bold text-emerald-950 block">{cat.categoryName}</span>
                <span className="text-zinc-700 text-[11px]">{cat.skills.join(" | ")}</span>
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-900 border-b border-emerald-200 pb-0.5 mb-2">
              Commercial Experience & Analytics Deliverables
            </h2>
            {experience.map((emp) => (
              <div key={emp.id} className="mb-3">
                <div className="flex justify-between font-bold text-xs text-zinc-900">
                  <span>{emp.jobTitle} — {emp.company}</span>
                  <span className="text-zinc-600 font-normal">{emp.startDate} - {emp.endDate}</span>
                </div>
                <ul className="list-disc list-outside pl-4 text-xs space-y-1 mt-1 text-zinc-800">
                  {emp.bullets.map((b) => (
                    <li key={b.id}>{b.tailoredText}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-900 border-b border-emerald-200 pb-0.5 mb-2">
              Analytical Projects & Dashboards
            </h2>
            {projects.filter((p) => p.isIncluded).map((proj) => (
              <div key={proj.id} className="mb-2 text-xs">
                <span className="font-bold text-zinc-900">{proj.title}</span>
                <span className="text-zinc-500 text-[11px]"> ({proj.technologies.join(", ")})</span>
                <ul className="list-disc list-outside pl-4 text-zinc-800 space-y-0.5">
                  {proj.bullets.map((b, bi) => (
                    <li key={bi}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-900 border-b border-emerald-200 pb-0.5 mb-1">
                Education
              </h2>
              {education.map((e, i) => (
                <div key={i} className="text-xs">
                  <strong>{e.degree}</strong> ({e.dates})
                  <div className="text-[11px] text-zinc-600">{e.institution}</div>
                </div>
              ))}
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-900 border-b border-emerald-200 pb-0.5 mb-1">
                Accreditations
              </h2>
              {certifications.map((c, i) => (
                <div key={i} className="text-xs">• {c}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
