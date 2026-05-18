"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus, Home } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { getAllProjects, toSavedProject } from "@/lib/storage";
import { ROOM_TYPE_LABELS, STATUS_LABELS, BUDGET_LABELS } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { SavedProject, ProjectStatus } from "@/lib/types";

const STATUS_STYLES: Record<ProjectStatus, string> = {
  draft: "bg-canvas-dark text-charcoal-light border-0",
  planned: "bg-petrol-light/20 text-petrol-dark border-0",
  "in-progress": "bg-yellow-100 text-yellow-800 border-0",
  complete: "bg-green-100 text-green-800 border-0",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-ZA", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function ProjectCard({ project }: { project: SavedProject }) {
  return (
    <Link href={`/projects/${project.id}`} className="block">
      <Card className="card-hover h-full border-canvas-dark bg-white transition-shadow">
        <CardContent className="flex h-full flex-col gap-4 p-5">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-semibold text-charcoal">
                {project.name}
              </p>
              <p className="mt-0.5 text-sm text-charcoal-light">{project.location}</p>
            </div>
            <Badge className={STATUS_STYLES[project.status]}>
              {STATUS_LABELS[project.status]}
            </Badge>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-canvas-dark bg-canvas px-3 py-1 text-xs font-medium text-charcoal-light">
              {ROOM_TYPE_LABELS[project.room_type]}
            </span>
            <span className="rounded-full border border-canvas-dark bg-canvas px-3 py-1 text-xs font-medium text-charcoal-light">
              {BUDGET_LABELS[project.budget_range]}
            </span>
            {project.photo_count ? (
              <span className="rounded-full border border-canvas-dark bg-canvas px-3 py-1 text-xs font-medium text-charcoal-light">
                {project.photo_count} photo{project.photo_count !== 1 ? "s" : ""}
              </span>
            ) : null}
          </div>

          {/* Footer */}
          <div className="mt-auto flex items-center justify-between border-t border-canvas-dark pt-4">
            {project.estimated_cost_range ? (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-charcoal-light/60">
                  Estimated
                </p>
                <p className="text-sm font-bold text-petrol-dark">
                  {project.estimated_cost_range}
                </p>
              </div>
            ) : (
              <p className="text-sm italic text-charcoal-light/60">No estimate yet</p>
            )}
            <p className="text-xs text-charcoal-light/60">{formatDate(project.created_at)}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

const FILTERS: Array<{ value: ProjectStatus | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "planned", label: "Planned" },
  { value: "in-progress", label: "In Progress" },
  { value: "complete", label: "Complete" },
];

export default function ProjectsDashboard() {
  const [filter, setFilter] = useState<ProjectStatus | "all">("all");
  const [allProjects, setAllProjects] = useState<SavedProject[]>([]);

  useEffect(() => {
    getAllProjects().then((projects) => {
      setAllProjects(projects.map(toSavedProject));
    });
  }, []);

  const projects = filter === "all" ? allProjects : allProjects.filter((p) => p.status === filter);

  return (
    <main className="min-h-[calc(100vh-3.5rem)]">
      <div className="container-page py-6 sm:py-10">

        {/* Page header */}
        <AnimatedSection>
          <div className="flex items-start justify-between gap-4 sm:items-center">
            <div>
              <p className="eyebrow mb-2">My Plans</p>
              <h1 className="font-display text-3xl font-semibold text-charcoal sm:text-4xl">
                Every room you&apos;ve sorted.
              </h1>
            </div>
            <Link href="/projects/new" className="inline-flex shrink-0 items-center gap-1.5 rounded-2xl bg-petrol-dark px-4 py-2.5 text-sm font-semibold text-white hover:bg-petrol-mid">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New plan</span>
              <span className="sm:hidden">New</span>
            </Link>
          </div>
        </AnimatedSection>

        {/* Filter chips — horizontally scrollable on mobile */}
        <AnimatedSection delay={0.05}>
          <div className="-mx-4 mt-6 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <div className="flex gap-2 pb-1">
              {FILTERS.map((f) => {
                const active = filter === f.value;
                const count = f.value !== "all" ? allProjects.filter((p) => p.status === f.value).length : null;
                return (
                  <button
                    key={f.value}
                    onClick={() => setFilter(f.value)}
                    className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                      active
                        ? "bg-petrol-dark text-white shadow-sm"
                        : "bg-white text-charcoal-light border border-charcoal/10 hover:border-petrol-dark/30 hover:text-petrol-dark"
                    }`}
                  >
                    {f.label}
                    {count !== null && (
                      <span className={`text-xs ${active ? "text-petrol-light" : "text-charcoal-light/50"}`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </AnimatedSection>

        {/* Project grid */}
        <div className="mt-6">
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, i) => (
                <AnimatedSection key={project.id} delay={i * 0.06}>
                  <ProjectCard project={project} />
                </AnimatedSection>
              ))}
            </div>
          ) : (
            /* Empty state */
            <AnimatedSection delay={0.1}>
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-5 grid h-16 w-16 place-items-center rounded-3xl border border-canvas-dark bg-canvas">
                  <Home className="h-7 w-7 text-charcoal-light/40" />
                </div>
                <p className="text-lg font-semibold text-charcoal">
                  {filter === "all" ? "No plans yet." : `Nothing ${STATUS_LABELS[filter as ProjectStatus].toLowerCase()}.`}
                </p>
                <p className="mt-2 max-w-sm text-sm leading-6 text-charcoal-light">
                  {filter === "all"
                    ? "Three minutes from now you could have a Rand range, a risk list, and a contractor brief ready to send."
                    : "Try a different filter — or start fresh."}
                </p>
                {filter === "all" && (
                  <Link href="/projects/new" className="mt-6 inline-flex items-center rounded-2xl bg-petrol-dark px-5 py-3 text-sm font-semibold text-white hover:bg-petrol-mid">
                    Build my first plan
                  </Link>
                )}
              </div>
            </AnimatedSection>
          )}
        </div>

      </div>
    </main>
  );
}
