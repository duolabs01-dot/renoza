import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { compareContractorQuotes } from "@/lib/mock-ai";
import { buildComparePrompt } from "@/lib/prompts";
import { quoteComparisonSchema } from "@/lib/schemas";

export const runtime = "edge";

export async function POST(req: Request) {
  const { quotes } = (await req.json()) as { quotes: string[] };

  try {
    const { object } = await generateObject({
      model: google("gemini-2.0-flash"),
      schema: quoteComparisonSchema,
      prompt: buildComparePrompt(quotes),
    });
    return Response.json(object);
  } catch (err) {
    console.error("[compare-quotes] Gemini error, falling back to mock:", err);
    return Response.json(compareContractorQuotes({ quotes }));
  }
}
