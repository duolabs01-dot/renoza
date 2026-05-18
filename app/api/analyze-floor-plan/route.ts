import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { buildFloorPlanPrompt } from "@/lib/prompts";
import { floorPlanAnalysisSchema } from "@/lib/schemas";
import type { ProjectInput } from "@/lib/types";

export const runtime = "edge";

const MAX_BODY_BYTES = 10 * 1024 * 1024; // 10 MB

export async function POST(req: Request) {
  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return Response.json({ error: "Image too large (max 10 MB)" }, { status: 413 });
  }

  let body: { imageBase64?: string; mimeType?: string; input?: Partial<ProjectInput> };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { imageBase64, mimeType = "image/jpeg", input = {} } = body;

  if (!imageBase64 || imageBase64.length < 100) {
    return Response.json(safeFallback(input));
  }

  // Strip data URI prefix if present (e.g. "data:image/jpeg;base64,...")
  const base64Data = imageBase64.includes(",") ? imageBase64.split(",")[1] : imageBase64;

  try {
    const { object } = await generateObject({
      model: google("gemini-2.0-flash"),
      schema: floorPlanAnalysisSchema,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: buildFloorPlanPrompt(input) },
            {
              type: "image",
              image: base64Data,
              mediaType: (mimeType as "image/jpeg" | "image/png" | "image/webp"),
            },
          ],
        },
      ],
    });
    return Response.json(object);
  } catch (err) {
    console.error("[analyze-floor-plan] Gemini error:", err);
    return Response.json(safeFallback(input));
  }
}

function safeFallback(input: Partial<ProjectInput>) {
  return {
    room_type_detected: input.room_type ?? "unknown",
    estimated_dimensions: input.room_size ?? "not detected",
    visible_features: ["Image analysis unavailable — plan generated from your form inputs"],
    demolition_zones: [] as string[],
    renovation_scope_detected: [] as string[],
    structural_concerns: [] as string[],
    ai_notes: "Could not analyse the image. Your renovation plan will use the details you provided in the form.",
  };
}
