import type { ProjectInput, RenovationPlan, SavedProject, StoredProject } from "./types";

const STORAGE_KEY = "renoza_projects";

function readAll(): StoredProject[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredProject[]) : [];
  } catch {
    return [];
  }
}

function writeAll(projects: StoredProject[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch {
    // localStorage quota exceeded or unavailable — fail silently
  }
}

export function saveProject(input: ProjectInput, plan: RenovationPlan): string {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const stored: StoredProject = { id, input, plan, created_at: now, updated_at: now };
  const all = readAll();
  writeAll([stored, ...all]);
  return id;
}

export function getProject(id: string): StoredProject | null {
  return readAll().find((p) => p.id === id) ?? null;
}

export function getAllProjects(): StoredProject[] {
  return readAll().sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

export function updateProject(id: string, updates: Partial<Pick<StoredProject, "input" | "plan">>): void {
  const all = readAll();
  const idx = all.findIndex((p) => p.id === id);
  if (idx === -1) return;
  all[idx] = { ...all[idx], ...updates, updated_at: new Date().toISOString() };
  writeAll(all);
}

export function deleteProject(id: string): void {
  writeAll(readAll().filter((p) => p.id !== id));
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
