"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Bath, BedDouble, Check, Home, ImagePlus, Lamp, Paintbrush, Sofa, Upload, X } from "lucide-react";
import type { ComponentType } from "react";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { BudgetRange, OwnershipType, ProjectPhoto, RenovationGoal, RoomType } from "@/lib/types";
import { BUDGET_LABELS, BUDGET_OPTIONS, GOAL_LABELS, GOAL_OPTIONS, ROOM_TYPE_LABELS, ROOM_TYPES } from "@/lib/types";
import { saveProject, updateProject, getProject } from "@/lib/storage";
import { LogoMark } from "@/components/Logo";

const roomIcons: Record<RoomType, ComponentType<{ className?: string }>> = {
  kitchen: Home,
  bathroom: Bath,
  bedroom: BedDouble,
  lounge: Sofa,
  "dining-room": Home,
  "bathroom-en-suite": Bath,
  garage: Home,
  other: Lamp,
};

const goalIcons: Partial<Record<RenovationGoal, ComponentType<{ className?: string }>>> = {
  paint: Paintbrush,
  flooring: Home,
  tiling: Home,
  lighting: Lamp,
  cupboards: Home,
  plumbing: Bath,
  electrical: Lamp,
  "damp-repair": Home,
  "full-makeover": ImagePlus,
  "prepare-rental-sale": Home,
};

const steps = ["Project", "Room", "Goals", "Photos"];

const LOADING_MESSAGES = [
  "Analysing room type and goals…",
  "Checking South African price ranges…",
  "Building your contractor brief…",
  "Finalising your renovation plan…",
];

export default function NewProjectPage() {
  return (
    <Suspense>
      <NewProjectForm />
    </Suspense>
  );
}

function NewProjectForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reduceMotion = useReducedMotion();
  const fileRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(0);
  const [editId, setEditId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [roomType, setRoomType] = useState<RoomType>("kitchen");
  const [ownership, setOwnership] = useState<OwnershipType>("own");
  const [roomSize, setRoomSize] = useState("");
  const [budget, setBudget] = useState<BudgetRange>("15k-50k");
  const [goals, setGoals] = useState<RenovationGoal[]>(["paint", "flooring"]);
  const [photos, setPhotos] = useState<ProjectPhoto[]>([]);

  // Pre-fill from edit param
  useEffect(() => {
    const eid = searchParams.get("edit");
    if (!eid) return;
    const stored = getProject(eid);
    if (!stored) return;
    setEditId(eid);
    const { input } = stored;
    setName(input.name);
    setLocation(input.location);
    setRoomType(input.room_type);
    setOwnership(input.ownership_type);
    setRoomSize(input.room_size);
    setBudget(input.budget_range);
    setGoals(input.goals);
    setPhotos(input.photos ?? []);
  }, [searchParams]);

  // Cycle loading messages
  useEffect(() => {
    if (!submitting) return;
    const interval = setInterval(() => {
      setLoadingMsg((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [submitting]);

  const completion = useMemo(() => {
    let score = 0;
    if (name.trim()) score += 1;
    if (location.trim()) score += 1;
    if (roomSize.trim()) score += 1;
    if (goals.length) score += 1;
    return Math.round((score / 4) * 100);
  }, [goals.length, location, name, roomSize]);

  const canContinue =
    step === 0 ? name.trim() && location.trim()
    : step === 1 ? roomSize.trim()
    : step === 2 ? goals.length > 0
    : true;

  const go = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  const toggleGoal = (goal: RenovationGoal) => {
    setGoals((curr) =>
      curr.includes(goal) ? curr.filter((g) => g !== goal) : [...curr, goal],
    );
  };

  const addPhotos = (files: FileList | null) => {
    if (!files) return;
    const next = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, 5 - photos.length)
      .map((f) => ({
        id: `${f.name}-${f.lastModified}`,
        name: f.name,
        size: f.size,
        type: f.type,
        previewUrl: URL.createObjectURL(f),
      }));
    setPhotos((curr) => [...curr, ...next].slice(0, 5));
  };

  const removePhoto = (id: string) => {
    setPhotos((curr) => curr.filter((p) => p.id !== id));
  };

  const submit = async () => {
    setSubmitting(true);
    setLoadingMsg(0);

    const input = {
      name,
      location,
      room_type: roomType,
      ownership_type: ownership,
      room_size: roomSize,
      budget_range: budget,
      goals,
      photos,
    };

    try {
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const plan = await res.json();

      if (editId) {
        updateProject(editId, { input, plan });
        router.push(`/projects/${editId}`);
      } else {
        const id = saveProject(input, plan);
        router.push(`/projects/${id}`);
      }
    } catch {
      // Fallback: use mock AI
      const { generateRenovationPlan } = await import("@/lib/mock-ai");
      const plan = generateRenovationPlan(input);
      if (editId) {
        updateProject(editId, { input, plan });
        router.push(`/projects/${editId}`);
      } else {
        const id = saveProject(input, plan);
        router.push(`/projects/${id}`);
      }
    }
  };

  if (submitting) {
    return (
      <main className="grid min-h-[calc(100vh-4rem)] place-items-center px-6">
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="mx-auto mb-7 grid h-20 w-20 place-items-center rounded-[26px] bg-petrol-dark shadow-2xl shadow-petrol-dark/25">
            <LogoMark size={62} inverse />
          </div>
          <h1 className="font-display text-3xl font-semibold text-charcoal sm:text-4xl">
            {editId ? "Updating your plan…" : "Building your plan…"}
          </h1>
          <AnimatePresence mode="wait">
            <motion.p
              key={loadingMsg}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mt-3 text-sm text-charcoal-light"
            >
              {LOADING_MESSAGES[loadingMsg]}
            </motion.p>
          </AnimatePresence>
          <div className="mx-auto mt-8 h-1 w-72 overflow-hidden rounded-full bg-canvas-dark">
            <motion.div
              className="h-full bg-petrol-dark"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-4rem)]">
      <div className="container-page grid gap-10 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:py-16">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow mb-4">{editId ? "Edit plan" : "New plan"}</p>
          <h1 className="font-display text-4xl font-semibold leading-tight text-charcoal sm:text-5xl">
            {editId ? "Update your renovation plan." : "Tell us enough to protect the budget."}
          </h1>
          <p className="mt-5 max-w-md text-base leading-8 text-charcoal-light">
            Renoza works best when the brief is specific. We ask only what changes the plan: place, room, budget, goals, and photos.
          </p>
          <div className="mt-8 rounded-[28px] bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between text-xs font-bold uppercase tracking-[0.12em] text-charcoal-light">
              <span>Completion</span>
              <span>{completion}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-canvas-dark">
              <motion.div className="h-full rounded-full bg-petrol-dark" animate={{ width: `${completion}%` }} />
            </div>
          </div>
        </aside>

        <section className="premium-card overflow-hidden rounded-[36px]">
          {/* Step indicators */}
          <div className="border-b border-charcoal/10 bg-white px-5 py-4 sm:px-8">
            <div className="flex items-center justify-between gap-3">
              {steps.map((label, index) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => go(index)}
                  className="flex min-w-0 items-center gap-2"
                >
                  <span
                    className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold ${
                      index <= step ? "bg-petrol-dark text-white" : "bg-canvas-dark text-charcoal-light"
                    }`}
                  >
                    {index < step ? <Check className="h-4 w-4" /> : index + 1}
                  </span>
                  <span
                    className={`hidden text-xs font-bold uppercase tracking-[0.12em] sm:block ${
                      index === step ? "text-petrol-dark" : "text-charcoal-light"
                    }`}
                  >
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Step content */}
          <div className="min-h-[560px] p-5 sm:p-8">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                initial={reduceMotion ? false : { opacity: 0, x: direction * 28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, x: direction * -28 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              >
                {step === 0 && (
                  <div>
                    <h2 className="font-display text-3xl font-semibold text-charcoal sm:text-4xl">Project details</h2>
                    <p className="mt-2 text-sm text-charcoal-light">Name the renovation and place it in South African reality.</p>
                    <div className="mt-8 grid gap-5">
                      <label className="block">
                        <span className="text-sm font-bold text-charcoal">Project name</span>
                        <input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="mt-2 w-full rounded-2xl border border-charcoal/10 bg-white px-5 py-4 text-base outline-none ring-petrol-light transition focus:ring-4"
                          placeholder="Kitchen upgrade - Sunninghill"
                        />
                      </label>
                      <label className="block">
                        <span className="text-sm font-bold text-charcoal">City or province</span>
                        <input
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="mt-2 w-full rounded-2xl border border-charcoal/10 bg-white px-5 py-4 text-base outline-none ring-petrol-light transition focus:ring-4"
                          placeholder="Johannesburg, Gauteng"
                        />
                      </label>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div>
                    <h2 className="font-display text-3xl font-semibold text-charcoal sm:text-4xl">Room and budget</h2>
                    <p className="mt-2 text-sm text-charcoal-light">Select the room, ownership, budget, and approximate size.</p>
                    <div className="mt-8 grid gap-7">
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {ROOM_TYPES.map((room) => {
                          const Icon = roomIcons[room];
                          const selected = roomType === room;
                          return (
                            <motion.button
                              key={room}
                              type="button"
                              whileHover={{ y: -2 }}
                              onClick={() => setRoomType(room)}
                              className={`rounded-2xl border p-4 text-left transition ${
                                selected ? "border-petrol-dark bg-petrol-light/18" : "border-charcoal/10 bg-white"
                              }`}
                            >
                              <Icon className={`mb-3 h-6 w-6 ${selected ? "text-petrol-dark" : "text-charcoal-light"}`} />
                              <span className="text-sm font-bold text-charcoal">{ROOM_TYPE_LABELS[room]}</span>
                            </motion.button>
                          );
                        })}
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        {(["own", "rent"] as OwnershipType[]).map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => setOwnership(item)}
                            className={`rounded-2xl border px-5 py-4 text-left font-bold transition ${
                              ownership === item
                                ? "border-petrol-dark bg-petrol-dark text-white"
                                : "border-charcoal/10 bg-white text-charcoal"
                            }`}
                          >
                            {item === "own" ? "I own this property" : "I rent this property"}
                          </button>
                        ))}
                      </div>

                      <label>
                        <span className="text-sm font-bold text-charcoal">Approximate room size</span>
                        <input
                          value={roomSize}
                          onChange={(e) => setRoomSize(e.target.value)}
                          className="mt-2 w-full rounded-2xl border border-charcoal/10 bg-white px-5 py-4 text-base outline-none ring-petrol-light transition focus:ring-4"
                          placeholder="4m × 5m or approx. 20m²"
                        />
                      </label>

                      <div className="-mx-4 flex flex-wrap gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
                        {BUDGET_OPTIONS.map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => setBudget(item)}
                            className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${
                              budget === item
                                ? "bg-petrol-dark text-white"
                                : "bg-white text-charcoal-light ring-1 ring-charcoal/10"
                            }`}
                          >
                            {BUDGET_LABELS[item]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h2 className="font-display text-3xl font-semibold text-charcoal sm:text-4xl">Renovation goals</h2>
                    <p className="mt-2 text-sm text-charcoal-light">Choose every job you want included in the contractor scope.</p>
                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                      {GOAL_OPTIONS.map((goal) => {
                        const Icon = goalIcons[goal] ?? Home;
                        const selected = goals.includes(goal);
                        return (
                          <motion.button
                            key={goal}
                            type="button"
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleGoal(goal)}
                            className={`relative rounded-2xl border p-5 text-left transition ${
                              selected ? "border-petrol-dark bg-petrol-light/18" : "border-charcoal/10 bg-white"
                            }`}
                          >
                            <Icon className={`mb-4 h-6 w-6 ${selected ? "text-petrol-dark" : "text-charcoal-light"}`} />
                            <span className="font-bold text-charcoal">{GOAL_LABELS[goal]}</span>
                            <AnimatePresence>
                              {selected && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                  className="absolute right-4 top-4 grid h-7 w-7 place-items-center rounded-full bg-petrol-dark text-white"
                                >
                                  <Check className="h-4 w-4" />
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <h2 className="font-display text-3xl font-semibold text-charcoal sm:text-4xl">Room photos</h2>
                    <p className="mt-2 text-sm text-charcoal-light">Add up to 5 photos. Previewed locally and used to enrich the brief.</p>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => addPhotos(e.target.files)}
                    />
                    {photos.length < 5 && (
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="mt-8 grid w-full place-items-center rounded-[28px] border-2 border-dashed border-petrol-light bg-petrol-light/12 px-6 py-12 text-center transition hover:bg-petrol-light/20"
                      >
                        <Upload className="mb-4 h-9 w-9 text-petrol-dark" />
                        <span className="font-bold text-petrol-dark">Click to browse photos</span>
                        <span className="mt-1 text-sm text-charcoal-light">JPG, PNG or HEIC — up to 5 photos</span>
                      </button>
                    )}
                    {photos.length > 0 && (
                      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {photos.map((photo) => (
                          <motion.div
                            key={photo.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="group relative aspect-square overflow-hidden rounded-2xl bg-canvas-dark"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={photo.previewUrl} alt={photo.name} className="h-full w-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removePhoto(photo.id)}
                              className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-charcoal/70 text-white opacity-0 transition group-hover:opacity-100"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer nav */}
          <div className="flex items-center justify-between border-t border-charcoal/10 bg-white px-5 py-5 sm:px-8">
            <button
              type="button"
              disabled={step === 0}
              onClick={() => go(step - 1)}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-charcoal-light disabled:opacity-30"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            {step < steps.length - 1 ? (
              <button
                type="button"
                disabled={!canContinue}
                onClick={() => go(step + 1)}
                className="inline-flex items-center gap-2 rounded-full bg-petrol-dark px-6 py-3 text-sm font-bold text-white disabled:bg-canvas-dark disabled:text-charcoal-light"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                className="inline-flex items-center gap-2 rounded-full bg-petrol-dark px-6 py-3 text-sm font-bold text-white"
              >
                {editId ? "Update plan" : "Generate plan"} <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
