import { NextRequest, NextResponse } from "next/server";
import { processCareerAssistantQuery } from "@/lib/services/ai-assistant";
import { MasterProfile } from "@/lib/types/profile";
import { AssistantMessage } from "@/lib/types/assistant";
import { ParsedJobDescription } from "@/lib/types/job";
import { GlobalJobListing } from "@/lib/types/global-job";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { profile, activeJob, history, userQuery } = body as {
      profile: MasterProfile;
      activeJob?: ParsedJobDescription | GlobalJobListing | null;
      history: AssistantMessage[];
      userQuery: string;
    };

    if (!profile || !userQuery) {
      return NextResponse.json(
        { error: "Candidate profile and user query are required." },
        { status: 400 }
      );
    }

    const response = await processCareerAssistantQuery({
      profile,
      activeJob,
      history: history || [],
      userQuery,
    });

    return NextResponse.json({ success: true, ...response });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An error occurred in AI Career Assistant" },
      { status: 500 }
    );
  }
}
