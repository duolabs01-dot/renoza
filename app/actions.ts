"use server";

import { redirect } from "next/navigation";
import type { ProjectInput } from "@/lib/types";

// Placeholder — swap for real Supabase insert when DB is connected
export async function createProject(input: ProjectInput) {
  // Generate a mock project ID (replace with Supabase insert later)
  const mockId = `mock-${Date.now()}`;
  // Encode the input so the result page can render it without a DB
  const encoded = encodeURIComponent(JSON.stringify(input));
  redirect(`/projects/${mockId}?data=${encoded}`);
}
