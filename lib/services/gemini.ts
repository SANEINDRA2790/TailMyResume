/**
 * Google Gemini API Client for Resume Optimization
 * Adheres strictly to anti-hallucination rules:
 * - Never invents work experience, companies, dates, metrics, or degrees.
 * - Rewrites bullet points for clarity, action verbs, and keyword alignment only.
 */

export interface GeminiEnhanceRequest {
  masterSummary: string;
  targetRole: string;
  targetCountry: string;
  companyName: string;
  jobKeywords: string[];
}

export interface GeminiEnhanceResponse {
  enhancedSummary: string;
  keywordRationale: string;
}

export async function callGeminiEnhanceSummary(
  params: GeminiEnhanceRequest
): Promise<GeminiEnhanceResponse | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Graceful fallback to deterministic engine
    return null;
  }

  const systemInstruction = `You are a professional ATS recruitment architect.
STRICT ANTI-HALLUCINATION RULES:
1. NEVER invent any past employer, company, employment date, degree, or certification.
2. NEVER invent numerical metrics or claim skills not in the provided input.
3. Optimize the tone, active voice, and terminology for ${params.targetCountry.toUpperCase()} recruitment standards.
4. Naturally weave in keywords: ${params.jobKeywords.join(", ")}.
5. Return JSON only with "enhancedSummary" and "keywordRationale".`;

  const userPrompt = `Candidate Base Summary: "${params.masterSummary}"
Target Role: "${params.targetRole}"
Target Company: "${params.companyName}"
Target Country: "${params.targetCountry}"`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `${systemInstruction}\n\n${userPrompt}` }],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!res.ok) return null;
    const data = await res.json();
    const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textOutput) return null;

    return JSON.parse(textOutput) as GeminiEnhanceResponse;
  } catch (error) {
    console.error("Gemini API call failed, falling back to deterministic engine:", error);
    return null;
  }
}
