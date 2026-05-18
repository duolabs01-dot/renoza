import type { ProjectInput, RenovationPlan, SavedProject, StoredProject } from "./types";
import { supabase, isSupabaseEnabled } from "./supabase";

const STORAGE_KEY = "renoza_projects";
const SESSION_KEY = "renoza_session_id";

// ─── Session ID (anonymous user identifier) ───────────────────────────────────

function getSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  try {
    let sid = window.localStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = crypto.randomUUID();
      window.localStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  } catch {
    return "unknown";
  }
}

// ─── localStorage helpers ─────────────────────────────────────────────────────

function lsReadAll(): StoredProject[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredProject[]) : [];
  } catch {
    return [];
  }
}

function lsWriteAll(projects: StoredProject[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch {
    // localStorage quota exceeded — fail silently
  }
}

function lsWrite(project: StoredProject): void {
  const all = lsReadAll();
  const idx = all.findIndex((p) => p.id === project.id);
  if (idx >= 0) {
    all[idx] = project;
  } else {
    all.unshift(project);
  }
  lsWriteAll(all);
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function saveProject(input: ProjectInput, plan: RenovationPlan): Promise<string> {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const stored: StoredProject = { id, input, plan, created_at: now, updated_at: now };

  // Always write to localStorage first (instant, offline-safe)
  lsWrite(stored);

  // Sync to Supabase in background — fire-and-forget, never blocks localStorage
  if (isSupabaseEnabled && supabase) {
    const sessionId = getSessionId();
    void (async () => {
      try {
        const { error } = await supabase.from("projects").upsert({
          id, session_id: sessionId, input, plan, created_at: now, updated_at: now,
        });
        if (error) console.warn("[storage] Supabase save failed:", error.message);
      } catch (err) {
        console.warn("[storage] Supabase upsert threw:", err);
      }
    })();
  }

  return id;
}

export async function updateProject(
  id: string,
  updates: Partial<Pick<StoredProject, "input" | "plan">>,
): Promise<void> {
  const updated_at = new Date().toISOString();

  // Update localStorage
  const all = lsReadAll();
  const idx = all.findIndex((p) => p.id === id);
  if (idx !== -1) {
    all[idx] = { ...all[idx], ...updates, updated_at };
    lsWriteAll(all);
  }

  // Sync to Supabase in background
  if (isSupabaseEnabled && supabase) {
    void (async () => {
      try {
        const { error } = await supabase.from("projects").update({ ...updates, updated_at }).eq("id", id);
        if (error) console.warn("[storage] Supabase update failed:", error.message);
      } catch (err) {
        console.warn("[storage] Supabase update threw:", err);
      }
    })();
  }
}

export async function deleteProject(id: string): Promise<void> {
  lsWriteAll(lsReadAll().filter((p) => p.id !== id));

  if (isSupabaseEnabled && supabase) {
    void (async () => {
      try {
        const { error } = await supabase.from("projects").delete().eq("id", id);
        if (error) console.warn("[storage] Supabase delete failed:", error.message);
      } catch (err) {
        console.warn("[storage] Supabase delete threw:", err);
      }
    })();
  }
}

export async function getProject(id: string): Promise<StoredProject | null> {
  // Try localStorage first (fast)
  const local = lsReadAll().find((p) => p.id === id);
  if (local) return local;

  // Fall back to Supabase (handles shared links / other devices)
  if (isSupabaseEnabled && supabase) {
    const { data, error } = await supabase
      .from("projects")
      .select("id, input, plan, created_at, updated_at")
      .eq("id", id)
      .single();
    if (!error && data) {
      const stored = data as StoredProject;
      lsWrite(stored); // cache locally
      return stored;
    }
  }

  return null;
}

export async function getAllProjects(): Promise<StoredProject[]> {
  if (isSupabaseEnabled && supabase) {
    const sessionId = getSessionId();
    const { data, error } = await supabase
      .from("projects")
      .select("id, input, plan, created_at, updated_at")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      // Merge remote into localStorage for offline access
      const remote = data as StoredProject[];
      lsWriteAll(remote);
      return remote;
    }
  }

  // Fallback to localStorage
  return lsReadAll().sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

export function toSavedProject(stored: StoredProject): SavedProject {
  return {
    id: stored.id,
    name: stored.input.name,
    location: stored.input.location,
    room_type: stored.input.room_type,
    budget_range: stored.input.budget_range,
    goals: stored.input.goals,
    created_at: stored.created_at,
    status: "planned",
    estimated_cost_range: stored.plan.estimated_cost_range,
    photo_count: stored.input.photos?.length ?? 0,
  };
}
