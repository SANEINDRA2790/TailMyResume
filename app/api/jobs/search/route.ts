import { NextRequest, NextResponse } from "next/server";
import { searchGlobalJobs } from "@/lib/services/job-discovery";
import { JobSearchFilters } from "@/lib/types/global-job";
import { MasterProfile } from "@/lib/types/profile";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { filters, profile } = body as {
      filters: JobSearchFilters;
      profile?: MasterProfile;
    };

    const results = await searchGlobalJobs(filters || { page: 1, pageSize: 10 }, profile);
    return NextResponse.json({ success: true, ...results });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to search global jobs" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("query") || undefined;
    const country = searchParams.get("country") || "all";
    const remoteType = searchParams.get("remoteType") || "all";
    const experienceLevel = searchParams.get("experienceLevel") || "all";
    const employmentType = searchParams.get("employmentType") || "all";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

    const filters: JobSearchFilters = {
      query,
      country,
      remoteType,
      experienceLevel,
      employmentType,
      page,
      pageSize,
    };

    const results = await searchGlobalJobs(filters);
    return NextResponse.json({ success: true, ...results });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
