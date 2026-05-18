import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { generateRenovationPlan } from "@/lib/mock-ai";
import { buildPlanPrompt } from "@/lib/prompts";
import { renovationPlanSchema } from "@/lib/schemas";
import type { ProjectInput } from "@/lib/types";

export const runtime = "edge";

export async function POST(req: Request) {
  const input = (await req.json()) as ProjectInput;

  try {
    const { object } = await generateObject({
      model: google("gemini-2.0-flash"),
      schema: renovationPlanSchema,
      prompt: buildPlanPrompt(input),
    });
    return Response.json(object);
  } catch (err) {
    console.error("[generate-plan] Gemini error, falling back to mock:", err);
    return Response.json(generateRenovationPlan(input));
  }
}
