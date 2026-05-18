import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { calculatePlan, buildFallbackNarrative } from "@/lib/pricing";
import { buildNarrativePrompt } from "@/lib/prompts";
import { narrativeSchema } from "@/lib/schemas";
import type { ProjectInput, RenovationPlan } from "@/lib/types";

export const runtime = "edge";

export async function POST(req: Request) {
  const input = (await req.json()) as ProjectInput;
  const calculated = calculatePlan(input);

  try {
    const { object: narrative } = await generateObject({
      model: google("gemini-2.0-flash"),
      schema: narrativeSchema,
      prompt: buildNarrativePrompt(input, calculated),
    });
    const plan: RenovationPlan = { ...calculated, ...narrative };
    return Response.json(plan);
  } catch (err) {
    console.error("[generate-plan] Gemini error, using fallback narrative:", err);
    const plan: RenovationPlan = { ...calculated, ...buildFallbackNarrative(input, calculated) };
    return Response.json(plan);
  }
}
