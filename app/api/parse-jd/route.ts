import { NextRequest, NextResponse } from "next/server";
import { parseJobDescriptionText } from "@/lib/services/jd-parser";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      const { rawText, jobTitle, companyName, location, jobUrl, referenceNumber } = body;

      if (!rawText || typeof rawText !== "string") {
        return NextResponse.json(
          { error: "Valid job description text is required." },
          { status: 400 }
        );
      }

      const parsed = parseJobDescriptionText(rawText, {
        jobTitle,
        companyName,
        location,
        jobUrl,
        referenceNumber,
      });

      return NextResponse.json({ success: true, job: parsed });
    }

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      const jobTitle = (formData.get("jobTitle") as string) || undefined;
      const companyName = (formData.get("companyName") as string) || undefined;
      const location = (formData.get("location") as string) || undefined;

      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }

      const buffer = await file.arrayBuffer();
      const text = new TextDecoder("utf-8").decode(buffer);

      const parsed = parseJobDescriptionText(text, {
        jobTitle,
        companyName,
        location,
      });

      return NextResponse.json({ success: true, job: parsed });
    }

    return NextResponse.json(
      { error: "Unsupported Content-Type. Send JSON or multipart/form-data." },
      { status: 415 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to parse job description" },
      { status: 500 }
    );
  }
}
