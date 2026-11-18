import { NextRequest, NextResponse } from "next/server";
import { generateTailoredResumeDocument } from "@/lib/services/resume-optimizer";
import { callGeminiEnhanceSummary } from "@/lib/services/gemini";
import { MasterProfile, CareerCategory, TargetCountry } from "@/lib/types/profile";
import { ParsedJobDescription } from "@/lib/types/job";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { profile, job, targetRole, targetCountry } = body as {
      profile: MasterProfile;
      job: ParsedJobDescription;
      targetRole: CareerCategory;
      targetCountry: TargetCountry;
    };

    if (!profile || !job || !targetRole || !targetCountry) {
      return NextResponse.json(
        { error: "Missing required parameters: profile, job, targetRole, targetCountry" },
        { status: 400 }
      );
    }

    // 1. Generate base tailored document deterministically
    const tailoredDoc = generateTailoredResumeDocument(profile, job, targetRole, targetCountry);

    // 2. Check for LLM enhancement if GEMINI_API_KEY is configured
    try {
      const llmResult = await callGeminiEnhanceSummary({
        masterSummary: profile.professionalSummary.baseText,
        targetRole,
        targetCountry,
        companyName: job.companyName,
        jobKeywords: job.extractedKeywords,
      });

      if (llmResult?.enhancedSummary) {
        tailoredDoc.summary.tailoredText = llmResult.enhancedSummary;
        tailoredDoc.summary.alignmentRationale = llmResult.keywordRationale || tailoredDoc.summary.alignmentRationale;
      }
    } catch {
      // Deterministic engine is already in place
    }

    return NextResponse.json({ success: true, document: tailoredDoc });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to generate tailored resume" },
      { status: 500 }
    );
  }
}
