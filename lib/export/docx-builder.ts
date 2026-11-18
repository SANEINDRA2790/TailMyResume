import { TailoredResumeDocument } from "../types/tailored-resume";

/**
 * Builds a valid Microsoft Word XML (WordprocessingML) document.
 * Fully compatible with Microsoft Word, LibreOffice, Google Docs, and ATS parsers.
 */
export function buildWordXmlDocument(doc: TailoredResumeDocument): string {
  const { contact, summary, prioritizedSkills, experience, projects, education, certifications } = doc;

  const escapeXml = (unsafe: string) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  };

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<?mso-application progid="Word.Document"?>
<w:wordDocument xmlns:w="http://schemas.microsoft.com/office/word/2003/wordml"
                xmlns:v="urn:schemas-microsoft-com:vml"
                xmlns:w10="urn:schemas-microsoft-com:office:word"
                xmlns:sl="http://schemas.microsoft.com/office/word/2003/wordml/status"
                xml:space="preserve">
  <w:styles>
    <w:style w:type="paragraph" w:default="on" w:styleId="Normal">
      <w:name w:val="Normal"/>
      <w:rPr>
        <w:rFonts w:ascii="Calibri" w:h-ansi="Calibri"/>
        <w:sz w:val="22"/>
        <w:color w:val="222222"/>
      </w:rPr>
    </w:style>
    <w:style w:type="paragraph" w:styleId="Heading1">
      <w:name w:val="heading 1"/>
      <w:pPr>
        <w:spacing w:before="240" w:after="80"/>
        <w:pBdr>
          <w:bottom w:val="single" w:sz="12" w:space="4" w:color="333333"/>
        </w:pBdr>
      </w:pPr>
      <w:rPr>
        <w:rFonts w:ascii="Calibri" w:h-ansi="Calibri"/>
        <w:b/>
        <w:sz w:val="26"/>
        <w:color w:val="111111"/>
      </w:rPr>
    </w:style>
  </w:styles>

  <w:body>
    <!-- Header: Name & Contact -->
    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
        <w:spacing w:after="60"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
          <w:sz w:val="36"/>
          <w:color w:val="111111"/>
        </w:rPr>
        <w:t>${escapeXml(contact.fullName.toUpperCase())}</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
        <w:spacing w:after="160"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
          <w:sz w:val="22"/>
          <w:color w:val="444444"/>
        </w:rPr>
        <w:t>${escapeXml(contact.professionalTitle)}</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
        <w:spacing w:after="240"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:sz w:val="18"/>
          <w:color w:val="555555"/>
        </w:rPr>
        <w:t>${escapeXml(contact.location)}  |  ${escapeXml(contact.email)}  |  ${escapeXml(contact.phone)}  |  ${escapeXml(contact.linkedInUrl || "")}</w:t>
      </w:r>
    </w:p>

    <!-- Professional Summary -->
    <w:p>
      <w:pPr>
        <w:pStyle w:val="Heading1"/>
      </w:pPr>
      <w:r>
        <w:t>PROFESSIONAL SUMMARY</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:pPr>
        <w:spacing w:after="160"/>
      </w:pPr>
      <w:r>
        <w:t>${escapeXml(summary.tailoredText)}</w:t>
      </w:r>
    </w:p>

    <!-- Technical Skills -->
    <w:p>
      <w:pPr>
        <w:pStyle w:val="Heading1"/>
      </w:pPr>
      <w:r>
        <w:t>TECHNICAL &amp; CORE COMPETENCIES</w:t>
      </w:r>
    </w:p>
    ${prioritizedSkills
      .map(
        (cat) => `
    <w:p>
      <w:pPr>
        <w:spacing w:after="60"/>
      </w:pPr>
      <w:r>
        <w:rPr><w:b/></w:rPr>
        <w:t>${escapeXml(cat.categoryName)}: </w:t>
      </w:r>
      <w:r>
        <w:t>${escapeXml(cat.skills.join(" • "))}</w:t>
      </w:r>
    </w:p>`
      )
      .join("")}

    <!-- Professional Experience -->
    <w:p>
      <w:pPr>
        <w:pStyle w:val="Heading1"/>
      </w:pPr>
      <w:r>
        <w:t>PROFESSIONAL EXPERIENCE</w:t>
      </w:r>
    </w:p>
    ${experience
      .map(
        (emp) => `
    <w:p>
      <w:pPr>
        <w:spacing w:before="120" w:after="40"/>
      </w:pPr>
      <w:r>
        <w:rPr><w:b/></w:rPr>
        <w:t>${escapeXml(emp.jobTitle)} — ${escapeXml(emp.company)}</w:t>
      </w:r>
      <w:r>
        <w:rPr><w:color w:val="666666"/></w:rPr>
        <w:t>  (${escapeXml(emp.startDate)} – ${escapeXml(emp.endDate)} | ${escapeXml(emp.location)})</w:t>
      </w:r>
    </w:p>
    ${emp.bullets
      .map(
        (b) => `
    <w:p>
      <w:pPr>
        <w:ind w:left="360" w:hanging="240"/>
        <w:spacing w:after="40"/>
      </w:pPr>
      <w:r><w:t>• </w:t></w:r>
      <w:r><w:t>${escapeXml(b.tailoredText)}</w:t></w:r>
    </w:p>`
      )
      .join("")}`
      )
      .join("")}

    <!-- Key Implementations & Projects -->
    <w:p>
      <w:pPr>
        <w:pStyle w:val="Heading1"/>
      </w:pPr>
      <w:r>
        <w:t>KEY IMPLEMENTATIONS &amp; PROJECTS</w:t>
      </w:r>
    </w:p>
    ${projects
      .filter((p) => p.isIncluded)
      .map(
        (proj) => `
    <w:p>
      <w:pPr>
        <w:spacing w:before="100" w:after="40"/>
      </w:pPr>
      <w:r>
        <w:rPr><w:b/></w:rPr>
        <w:t>${escapeXml(proj.title)} (${escapeXml(proj.role)})</w:t>
      </w:r>
    </w:p>
    ${proj.bullets
      .map(
        (b) => `
    <w:p>
      <w:pPr>
        <w:ind w:left="360" w:hanging="240"/>
        <w:spacing w:after="40"/>
      </w:pPr>
      <w:r><w:t>• </w:t></w:r>
      <w:r><w:t>${escapeXml(b)}</w:t></w:r>
    </w:p>`
      )
      .join("")}`
      )
      .join("")}

    <!-- Education -->
    <w:p>
      <w:pPr>
        <w:pStyle w:val="Heading1"/>
      </w:pPr>
      <w:r>
        <w:t>EDUCATION &amp; CERTIFICATIONS</w:t>
      </w:r>
    </w:p>
    ${education
      .map(
        (edu) => `
    <w:p>
      <w:pPr><w:spacing w:after="40"/></w:pPr>
      <w:r><w:rPr><w:b/></w:rPr><w:t>${escapeXml(edu.degree)} — ${escapeXml(edu.institution)}</w:t></w:r>
      <w:r><w:t> (${escapeXml(edu.dates)})</w:t></w:r>
    </w:p>`
      )
      .join("")}
    ${certifications
      .map(
        (c) => `
    <w:p>
      <w:pPr><w:spacing w:after="40"/></w:pPr>
      <w:r><w:t>• ${escapeXml(c)}</w:t></w:r>
    </w:p>`
      )
      .join("")}

    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134"/>
    </w:sectPr>
  </w:body>
</w:wordDocument>`;
}
