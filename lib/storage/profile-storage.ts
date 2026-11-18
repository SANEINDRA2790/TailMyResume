"use client";

import { MasterProfile } from "../types/profile";
import { ParsedJobDescription, JobRequirement } from "../types/job";
import { TailoredResumeDocument } from "../types/tailored-resume";
import { TrackedApplication, GlobalJobListing } from "../types/global-job";
import { initialMasterProfile } from "./seed-data";

const DB_NAME = "tailmyresume_db";
const DB_VERSION = 2;
const STORE_PROFILE = "master_profile";
const STORE_JOBS = "job_descriptions";
const STORE_RESUMES = "tailored_resumes";
const STORE_APPLICATIONS = "job_applications";

const LOCAL_STORAGE_KEY_PROFILE = "tmr_master_profile";
const LOCAL_STORAGE_KEY_JOBS = "tmr_saved_jobs";
const LOCAL_STORAGE_KEY_RESUMES = "tmr_tailored_resumes";
const LOCAL_STORAGE_KEY_APPLICATIONS = "tmr_tracked_applications";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

// Open IndexedDB with Promise wrapper
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!isBrowser() || !window.indexedDB) {
      return reject(new Error("IndexedDB not available in current environment"));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_PROFILE)) {
        db.createObjectStore(STORE_PROFILE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(STORE_JOBS)) {
        db.createObjectStore(STORE_JOBS, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(STORE_RESUMES)) {
        db.createObjectStore(STORE_RESUMES, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(STORE_APPLICATIONS)) {
        db.createObjectStore(STORE_APPLICATIONS, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export class StorageService {
  /**
   * Load the active Master Profile. If none exists, initializes with seed data.
   */
  static async getMasterProfile(): Promise<MasterProfile> {
    if (!isBrowser()) return initialMasterProfile;

    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_PROFILE, "readonly");
        const store = tx.objectStore(STORE_PROFILE);
        const req = store.get("active_profile");

        req.onsuccess = () => {
          if (req.result && req.result.data) {
            resolve(req.result.data);
          } else {
            // Fallback to localStorage check before initializing with seed
            const local = localStorage.getItem(LOCAL_STORAGE_KEY_PROFILE);
            if (local) {
              try {
                const parsed = JSON.parse(local);
                this.saveMasterProfile(parsed);
                resolve(parsed);
                return;
              } catch {
                // fall through
              }
            }
            // Initialize with seed data
            this.saveMasterProfile(initialMasterProfile);
            resolve(initialMasterProfile);
          }
        };

        req.onerror = () => {
          resolve(this.getFallbackMasterProfile());
        };
      });
    } catch {
      return this.getFallbackMasterProfile();
    }
  }

  private static getFallbackMasterProfile(): MasterProfile {
    if (!isBrowser()) return initialMasterProfile;
    const item = localStorage.getItem(LOCAL_STORAGE_KEY_PROFILE);
    if (item) {
      try {
        return JSON.parse(item);
      } catch {
        // ignore error
      }
    }
    return initialMasterProfile;
  }

  /**
   * Save the updated Master Profile.
   */
  static async saveMasterProfile(profile: MasterProfile): Promise<void> {
    if (!isBrowser()) return;

    profile.updatedAt = new Date().toISOString();

    // Mirror to localStorage for immediate resilience
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_PROFILE, JSON.stringify(profile));
    } catch {
      // ignore quota errors
    }

    try {
      const db = await openDB();
      const tx = db.transaction(STORE_PROFILE, "readwrite");
      const store = tx.objectStore(STORE_PROFILE);
      store.put({ id: "active_profile", data: profile });
    } catch {
      // localStorage is already updated
    }
  }

  /**
   * Reset profile to the initial authentic seed data.
   */
  static async resetToDefaultProfile(): Promise<MasterProfile> {
    await this.saveMasterProfile(initialMasterProfile);
    return initialMasterProfile;
  }

  /**
   * Export profile as JSON string for backup.
   */
  static exportProfileAsJSON(profile: MasterProfile): string {
    return JSON.stringify(profile, null, 2);
  }

  /**
   * Import profile from JSON string.
   */
  static async importProfileFromJSON(jsonString: string): Promise<MasterProfile> {
    const parsed = JSON.parse(jsonString) as MasterProfile;
    if (!parsed.contact || !parsed.skills || !parsed.employmentHistory) {
      throw new Error("Invalid Master Profile JSON structure.");
    }
    await this.saveMasterProfile(parsed);
    return parsed;
  }

  // --- JOB DESCRIPTIONS STORAGE ---

  static async getSavedJobs(): Promise<ParsedJobDescription[]> {
    if (!isBrowser()) return [];
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_JOBS, "readonly");
        const store = tx.objectStore(STORE_JOBS);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve(this.getFallbackJobs());
      });
    } catch {
      return this.getFallbackJobs();
    }
  }

  private static getFallbackJobs(): ParsedJobDescription[] {
    if (!isBrowser()) return [];
    const item = localStorage.getItem(LOCAL_STORAGE_KEY_JOBS);
    return item ? JSON.parse(item) : [];
  }

  static async saveJob(job: ParsedJobDescription): Promise<void> {
    if (!isBrowser()) return;
    try {
      const jobs = await this.getSavedJobs();
      const filtered = jobs.filter((j) => j.id !== job.id);
      filtered.unshift(job);
      localStorage.setItem(LOCAL_STORAGE_KEY_JOBS, JSON.stringify(filtered));

      const db = await openDB();
      const tx = db.transaction(STORE_JOBS, "readwrite");
      const store = tx.objectStore(STORE_JOBS);
      store.put(job);
    } catch {
      // localStorage handled
    }
  }

  static async deleteJob(id: string): Promise<void> {
    if (!isBrowser()) return;
    try {
      const jobs = await this.getSavedJobs();
      const filtered = jobs.filter((j) => j.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY_JOBS, JSON.stringify(filtered));

      const db = await openDB();
      const tx = db.transaction(STORE_JOBS, "readwrite");
      const store = tx.objectStore(STORE_JOBS);
      store.delete(id);
    } catch {
      // fallback
    }
  }

  // --- TAILORED RESUMES STORAGE ---

  static async getTailoredResumes(): Promise<TailoredResumeDocument[]> {
    if (!isBrowser()) return [];
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_RESUMES, "readonly");
        const store = tx.objectStore(STORE_RESUMES);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve(this.getFallbackResumes());
      });
    } catch {
      return this.getFallbackResumes();
    }
  }

  private static getFallbackResumes(): TailoredResumeDocument[] {
    if (!isBrowser()) return [];
    const item = localStorage.getItem(LOCAL_STORAGE_KEY_RESUMES);
    return item ? JSON.parse(item) : [];
  }

  static async saveTailoredResume(resume: TailoredResumeDocument): Promise<void> {
    if (!isBrowser()) return;
    resume.updatedAt = new Date().toISOString();
    try {
      const resumes = await this.getTailoredResumes();
      const filtered = resumes.filter((r) => r.id !== resume.id);
      filtered.unshift(resume);
      localStorage.setItem(LOCAL_STORAGE_KEY_RESUMES, JSON.stringify(filtered));

      const db = await openDB();
      const tx = db.transaction(STORE_RESUMES, "readwrite");
      const store = tx.objectStore(STORE_RESUMES);
      store.put(resume);
    } catch {
      // fallback handled
    }
  }

  static async deleteTailoredResume(id: string): Promise<void> {
    if (!isBrowser()) return;
    try {
      const resumes = await this.getTailoredResumes();
      const filtered = resumes.filter((r) => r.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY_RESUMES, JSON.stringify(filtered));

      const db = await openDB();
      const tx = db.transaction(STORE_RESUMES, "readwrite");
      const store = tx.objectStore(STORE_RESUMES);
      store.delete(id);
    } catch {
      // fallback
    }
  }

  // --- APPLICATION TRACKER STORAGE ---

  static async getTrackedApplications(): Promise<TrackedApplication[]> {
    if (!isBrowser()) return [];
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_APPLICATIONS, "readonly");
        const store = tx.objectStore(STORE_APPLICATIONS);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve(this.getFallbackApplications());
      });
    } catch {
      return this.getFallbackApplications();
    }
  }

  private static getFallbackApplications(): TrackedApplication[] {
    if (!isBrowser()) return [];
    const item = localStorage.getItem(LOCAL_STORAGE_KEY_APPLICATIONS);
    return item ? JSON.parse(item) : [];
  }

  static async saveTrackedApplication(app: TrackedApplication): Promise<void> {
    if (!isBrowser()) return;
    app.updatedAt = new Date().toISOString();
    try {
      const list = await this.getTrackedApplications();
      const filtered = list.filter((a) => a.id !== app.id);
      filtered.unshift(app);
      localStorage.setItem(LOCAL_STORAGE_KEY_APPLICATIONS, JSON.stringify(filtered));

      const db = await openDB();
      const tx = db.transaction(STORE_APPLICATIONS, "readwrite");
      const store = tx.objectStore(STORE_APPLICATIONS);
      store.put(app);
    } catch {
      // fallback handled
    }
  }

  static async deleteTrackedApplication(id: string): Promise<void> {
    if (!isBrowser()) return;
    try {
      const list = await this.getTrackedApplications();
      const filtered = list.filter((a) => a.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY_APPLICATIONS, JSON.stringify(filtered));

      const db = await openDB();
      const tx = db.transaction(STORE_APPLICATIONS, "readwrite");
      const store = tx.objectStore(STORE_APPLICATIONS);
      store.delete(id);
    } catch {
      // fallback
    }
  }

  /**
   * Seamless bridge: converts a GlobalJobListing into a ParsedJobDescription
   * so the candidate can immediately run gap matrix analysis and tailoring!
   */
  static convertGlobalJobToParsedJD(job: GlobalJobListing): ParsedJobDescription {
    const mandatory: JobRequirement[] = job.requiredSkills.map((skill) => ({
      id: `req-${Math.random().toString(36).substring(2, 9)}`,
      name: skill,
      category: "technical_skill",
      isMandatory: true,
      importance: "high",
      contextExcerpt: `Required for ${job.title} at ${job.company}`,
    }));

    const desirable: JobRequirement[] = (job.preferredSkills || []).map((skill) => ({
      id: `req-des-${Math.random().toString(36).substring(2, 9)}`,
      name: skill,
      category: "framework",
      isMandatory: false,
      importance: "medium",
      contextExcerpt: `Preferred competence for ${job.title}`,
    }));

    return {
      id: `job-from-discovery-${job.id}`,
      rawText: job.description,
      parsedAt: new Date().toISOString(),
      jobTitle: job.title,
      companyName: job.company,
      location: job.location,
      jobUrl: job.applicationUrl,
      seniorityLevel: job.experienceLevel === "Senior" || job.experienceLevel === "Lead" ? job.experienceLevel : "Mid",
      requiredExperienceYears: job.experienceLevel === "Senior" ? 5 : job.experienceLevel === "Lead" ? 7 : 3,
      industryDomain: "Technology / Enterprise",
      overviewSummary: job.description.slice(0, 280) + "...",
      mandatoryRequirements: mandatory,
      desirableRequirements: desirable,
      responsibilities: [
        `Deliver high-impact production deliverables for ${job.title}`,
        `Collaborate in cross-functional engineering, data, and product teams`,
        `Apply ${job.requiredSkills.slice(0, 3).join(", ")} to solve enterprise challenges`,
      ],
      extractedKeywords: Array.from(new Set([...job.requiredSkills, ...(job.preferredSkills || [])])),
    };
  }
}
