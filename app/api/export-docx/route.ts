import { NextRequest, NextResponse } from "next/server";
import { buildWordXmlDocument } from "@/lib/export/docx-builder";
import { TailoredResumeDocument } from "@/lib/types/tailored-resume";

export async function POST(req: NextRequest) {
  try {
    const document = (await req.json()) as TailoredResumeDocument;
    if (!document || !document.contact) {
      return NextResponse.json({ error: "Invalid resume document" }, { status: 400 });
    }

    const xmlContent = buildWordXmlDocument(document);

    // Format clean professional filename
    const cleanName = document.contact.fullName.replace(/\s+/g, "_");
    const cleanRole = document.targetRole.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).replace(/\s+/g, "_");
    const cleanCountry = document.targetCountry.toUpperCase();
    const filename = `${cleanName}_${cleanRole}_${cleanCountry}_Resume.doc`;

    return new NextResponse(xmlContent, {
      status: 200,
      headers: {
        "Content-Type": "application/msword; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to generate document" },
      { status: 500 }
    );
  }
}
