import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { reviewContractorQuote } from "@/lib/mock-ai";
import { buildReviewPrompt } from "@/lib/prompts";
import { quoteReviewSchema } from "@/lib/schemas";

export const runtime = "edge";

export async function POST(req: Request) {
  const { quoteText } = (await req.json()) as { quoteText: string };

  try {
    const { object } = await generateObject({
      model: google("gemini-2.0-flash"),
      schema: quoteReviewSchema,
      prompt: buildReviewPrompt(quoteText),
    });
    return Response.json(object);
  } catch (err) {
    console.error("[review-quote] Gemini error, falling back to mock:", err);
    return Response.json(reviewContractorQuote(quoteText));
  }
}
