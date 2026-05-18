"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AnimatedSection from "@/components/AnimatedSection";
import { getMockSavedProjects } from "@/lib/mock-ai";
import { ROOM_TYPE_LABELS, STATUS_LABELS, BUDGET_LABELS } from "@/lib/types";
import type { SavedProject, ProjectStatus } from "@/lib/types";

const STATUS_COLORS: Record<ProjectStatus, { bg: string; color: string }> = {
  draft:       { bg: "var(--canvas-dark)", color: "var(--muted)" },
  planned:     { bg: "var(--petrol-100)", color: "var(--petrol-800)" },
  "in-progress": { bg: "#fef9c3", color: "#854d0e" },
  complete:    { bg: "#dcfce7", color: "#166534" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });
}

function ProjectCard({ project, onClick }: { project: SavedProject; onClick: () => void }) {
  const sc = STATUS_COLORS[project.status];
  return (
    <div
      onClick={onClick}
      className="card-hover"
      style={{
        background: "white", borderRadius: 14, padding: 24,
        border: "1px solid var(--canvas-dark)", cursor: "pointer",
        display: "flex", flexDirection: "column", gap: 16,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 16, fontWeight: 600, color: "var(--charcoal)", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {project.name}
          </p>
          <p style={{ fontSize: 13, color: "var(--muted)" }}>{project.location}</p>
        </div>
        <span style={{
          fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
          background: sc.bg, color: sc.color, whiteSpace: "nowrap", flexShrink: 0,
        }}>
          {STATUS_LABELS[project.status]}
        </span>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <span style={{ fontSize: 12, padding: "3px 10px", borderRadius: 20, background: "var(--canvas)", border: "1px solid var(--canvas-dark)", color: "var(--charcoal-light)" }}>
          {ROOM_TYPE_LABELS[project.room_type]}
        </span>
        <span style={{ fontSize: 12, padding: "3px 10px", borderRadius: 20, background: "var(--canvas)", border: "1px solid var(--canvas-dark)", color: "var(--charcoal-light)" }}>
          {BUDGET_LABELS[project.budget_range]}
        </span>
        {project.photo_count ? (
          <span style={{ fontSize: 12, padding: "3px 10px", borderRadius: 20, background: "var(--canvas)", border: "1px solid var(--canvas-dark)", color: "var(--charcoal-light)" }}>
            {project.photo_count} photo{project.photo_count !== 1 ? "s" : ""}
          </span>
        ) : null}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: "1px solid var(--canvas-dark)" }}>
        {project.estimated_cost_range ? (
          <div>
            <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", marginBottom: 2 }}>Estimated</p>
            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--petrol-700)" }}>{project.estimated_cost_range}</p>
          </div>
        ) : (
          <p style={{ fontSize: 13, color: "var(--muted)", fontStyle: "italic" }}>No estimate yet</p>
        )}
        <p style={{ fontSize: 12, color: "var(--muted)" }}>{formatDate(project.created_at)}</p>
      </div>
    </div>
  );
}

export default function ProjectsDashboard() {
  const router = useRouter();
  const [filter, setFilter] = useState<ProjectStatus | "all">("all");
  const allProjects = getMockSavedProjects();
  const projects = filter === "all" ? allProjects : allProjects.filter((p) => p.status === filter);

  const filters: Array<{ value: ProjectStatus | "all"; label: string }> = [
    { value: "all", label: "All" },
    { value: "draft", label: "Draft" },
    { value: "planned", label: "Planned" },
    { value: "in-progress", label: "In Progress" },
    { value: "complete", label: "Complete" },
  ];

  return (
    <div className="page-enter" style={{ minHeight: "80vh", padding: "48px 24px", maxWidth: 1100, margin: "0 auto" }}>

      {/* Header */}
      <AnimatedSection>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--petrol-600)", marginBottom: 8 }}>
              My Projects
            </p>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 3.5vw, 36px)", fontWeight: 700, color: "var(--charcoal)", lineHeight: 1.2 }}>
              Your renovation plans
            </h1>
          </div>
          <button
            onClick={() => router.push("/projects/new")}
            className="btn-scale"
            style={{
              padding: "12px 24px", borderRadius: 10, background: "var(--petrol-700)",
              color: "white", fontSize: 14, fontWeight: 600, whiteSpace: "nowrap",
            }}
          >
            + New plan
          </button>
        </div>
      </AnimatedSection>

      {/* Filter tabs */}
      <AnimatedSection delay={0.05}>
        <div style={{ display: "flex", gap: 2, borderBottom: "1px solid var(--canvas-dark)", marginBottom: 28 }}>
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              style={{
                padding: "8px 16px", fontSize: 13,
                fontWeight: filter === f.value ? 600 : 400,
                color: filter === f.value ? "var(--petrol-700)" : "var(--muted)",
                borderBottom: filter === f.value ? "2px solid var(--petrol-700)" : "2px solid transparent",
                background: "none", marginBottom: -1, transition: "all 0.2s", whiteSpace: "nowrap",
              }}
            >
              {f.label}
              {f.value !== "all" && (
                <span style={{ marginLeft: 6, fontSize: 11, color: "var(--muted)" }}>
                  ({allProjects.filter((p) => p.status === f.value).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </AnimatedSection>

      {/* Project grid */}
      {projects.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {projects.map((project, i) => (
            <AnimatedSection key={project.id} delay={i * 0.07}>
              <ProjectCard
                project={project}
                onClick={() => router.push(`/projects/${project.id}`)}
              />
            </AnimatedSection>
          ))}
        </div>
      ) : (
        /* Empty state */
        <AnimatedSection delay={0.1}>
          <div style={{ textAlign: "center", padding: "80px 24px" }}>
            <div style={{
              width: 64, height: 64, borderRadius: 16, background: "var(--canvas)",
              border: "1px solid var(--canvas-dark)",
              display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px",
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <p style={{ fontSize: 17, fontWeight: 600, color: "var(--charcoal)", marginBottom: 8 }}>
              {filter === "all" ? "No projects yet" : `No ${STATUS_LABELS[filter as ProjectStatus].toLowerCase()} projects`}
            </p>
            <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 24, maxWidth: 320, margin: "0 auto 24px" }}>
              {filter === "all"
                ? "Start by creating your first renovation plan. It only takes a few minutes."
                : "Try selecting a different filter above."}
            </p>
            {filter === "all" && (
              <button
                onClick={() => router.push("/projects/new")}
                className="btn-scale"
                style={{
                  padding: "12px 28px", borderRadius: 10, background: "var(--petrol-700)",
                  color: "white", fontSize: 14, fontWeight: 600,
                }}
              >
                Create my first plan →
              </button>
            )}
          </div>
        </AnimatedSection>
      )}
    </div>
  );
}
