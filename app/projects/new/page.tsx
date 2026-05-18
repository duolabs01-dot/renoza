"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Bath, BedDouble, Check, Home, ImagePlus, Lamp,
  Paintbrush, Sofa, Upload, X,
} from "lucide-react";
import type { ComponentType } from "react";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type {
  BudgetRange, CompassDirection, FloorPlanUpload, OwnershipType,
  ProjectPhoto, RenovationGoal, RoomType,
} from "@/lib/types";
import {
  BUDGET_LABELS, BUDGET_OPTIONS, GOAL_LABELS, GOAL_OPTIONS,
  ROOM_TYPE_LABELS, ROOM_TYPES,
} from "@/lib/types";
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

const COMPASS_DIRECTIONS: CompassDirection[] = [
  "north", "northeast", "east", "southeast",
  "south", "southwest", "west", "northwest",
];

const steps = ["Project", "Room", "Goals", "Scope Sketch", "Photos"];

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
  const floorPlanRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(0);
  const [editId, setEditId] = useState<string | null>(null);

  // Project fields
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [roomType, setRoomType] = useState<RoomType>("kitchen");
  const [ownership, setOwnership] = useState<OwnershipType>("own");
  const [roomSize, setRoomSize] = useState("");
  const [budget, setBudget] = useState<BudgetRange>("15k-50k");
  const [goals, setGoals] = useState<RenovationGoal[]>(["paint", "flooring"]);
  const [photos, setPhotos] = useState<ProjectPhoto[]>([]);

  // New fields
  const [includeFengShui, setIncludeFengShui] = useState(false);
  const [compassDirection, setCompassDirection] = useState<CompassDirection | "">("");
  const [floorPlan, setFloorPlan] = useState<FloorPlanUpload | null>(null);
  const [analyzingFloorPlan, setAnalyzingFloorPlan] = useState(false);

  // Pre-fill from edit param
  useEffect(() => {
    const eid = searchParams.get("edit");
    if (!eid) return;
    getProject(eid).then((stored) => {
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
      setIncludeFengShui(!!input.include_feng_shui);
      setCompassDirection(input.compass_direction ?? "");
      setFloorPlan(input.floor_plan ? { name: input.floor_plan.name, analysis: input.floor_plan.analysis } : null);
    });
  }, [searchParams]);

  // Pre-fill from BallparkEstimator URL params (?room=&goals=&city=)
  useEffect(() => {
    const eid = searchParams.get("edit");
    if (eid) return; // edit mode takes precedence
    const roomParam = searchParams.get("room") as RoomType | null;
    const goalsParam = searchParams.get("goals");
    const cityParam = searchParams.get("city");
    if (!roomParam && !goalsParam && !cityParam) return;

    queueMicrotask(() => {
      if (roomParam && ROOM_TYPES.includes(roomParam)) {
        setRoomType(roomParam);
        setName((prev) => prev || `${ROOM_TYPE_LABELS[roomParam]} renovation`);
      }
      if (goalsParam) {
        const parsed = goalsParam
          .split(",")
          .filter((g) => GOAL_OPTIONS.includes(g as RenovationGoal)) as RenovationGoal[];
        if (parsed.length > 0) setGoals(parsed);
      }
      if (cityParam) setLocation(decodeURIComponent(cityParam));
      // If room + goals are pre-filled, skip to step 1 (Room details)
      if (roomParam && goalsParam) setStep(1);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    step === 0 ? !!(name.trim() && location.trim())
    : step === 1 ? !!roomSize.trim()
    : step === 2 ? goals.length > 0
    : true; // Scope Sketch (step 3) and Photos (step 4) are optional

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

  const handleFloorPlanUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      alert("Please upload a JPG, PNG, or WebP image.");
      return;
    }

    setAnalyzingFloorPlan(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      try {
        const res = await fetch("/api/analyze-floor-plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageBase64: base64,
            mimeType: file.type,
            input: { room_type: roomType, location, room_size: roomSize },
          }),
        });
        if (!res.ok) {
          throw new Error("Floor plan analysis failed");
        }
        const analysis = await res.json();
        setFloorPlan({ name: file.name, analysis });
      } catch {
        setFloorPlan({ name: file.name });
      } finally {
        setAnalyzingFloorPlan(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeFloorPlan = () => {
    setFloorPlan(null);
    if (floorPlanRef.current) floorPlanRef.current.value = "";
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
      include_feng_shui: includeFengShui || undefined,
      compass_direction: (includeFengShui && compassDirection) ? compassDirection as CompassDirection : undefined,
      floor_plan: floorPlan ? { name: floorPlan.name, analysis: floorPlan.analysis } : undefined,
    };

    try {
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const plan = await res.json();

      if (editId) {
        await updateProject(editId, { input, plan });
        router.push(`/projects/${editId}`);
      } else {
        const id = await saveProject(input, plan);
        router.push(`/projects/${id}`);
      }
    } catch {
      const { generateRenovationPlan } = await import("@/lib/mock-ai");
      const plan = generateRenovationPlan(input);
      if (editId) {
        await updateProject(editId, { input, plan });
        router.push(`/projects/${editId}`);
      } else {
        const id = await saveProject(input, plan);
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
            {editId ? "Let's sharpen the plan." : "Five minutes now. Thousands saved later."}
          </h1>
          <p className="mt-5 max-w-md text-base leading-8 text-charcoal-light">
            Tell us the room, the budget, and what needs doing. We&apos;ll build a plan and a WhatsApp brief that puts you in control before the first call.
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
            <div className="flex items-center justify-between gap-2">
              {steps.map((label, index) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => go(index)}
                  className="flex min-w-0 items-center gap-1.5"
                >
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold ${
                      index <= step ? "bg-petrol-dark text-white" : "bg-canvas-dark text-charcoal-light"
                    }`}
                  >
                    {index < step ? <Check className="h-3.5 w-3.5" /> : index + 1}
                  </span>
                  <span
                    className={`hidden text-xs font-bold uppercase tracking-[0.10em] sm:block ${
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

                {/* ── Step 0: Project ── */}
                {step === 0 && (
                  <div>
                    <h2 className="font-display text-3xl font-semibold text-charcoal sm:text-4xl">What&apos;s the job?</h2>
                    <p className="mt-2 text-sm text-charcoal-light">Give it a name and tell us where you are — SA prices vary a lot by city.</p>
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

                {/* ── Step 1: Room ── */}
                {step === 1 && (
                  <div>
                    <h2 className="font-display text-3xl font-semibold text-charcoal sm:text-4xl">The room and your budget</h2>
                    <p className="mt-2 text-sm text-charcoal-light">Pick the room type and be honest about size — it&apos;s what separates a ballpark from a real number.</p>
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

                      {/* Spatial harmony toggle */}
                      <div className="rounded-2xl border border-charcoal/10 bg-white p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-bold text-charcoal">Add spatial harmony guidance</p>
                            <p className="mt-1 text-sm text-charcoal-light">
                              Feng shui analysis for the room — colours, energy flow, and placement tips that actually make sense.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIncludeFengShui((v) => !v)}
                            className={`relative mt-0.5 h-7 w-12 shrink-0 rounded-full transition-colors ${
                              includeFengShui ? "bg-petrol-dark" : "bg-charcoal/20"
                            }`}
                            aria-label="Toggle spatial harmony guidance"
                          >
                            <span
                              className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                                includeFengShui ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>

                        {/* Compass direction — only when enabled */}
                        {includeFengShui && (
                          <div className="mt-5 border-t border-charcoal/8 pt-5">
                            <p className="mb-3 text-sm font-bold text-charcoal">
                              Which direction does this room primarily face?
                            </p>
                            <div className="grid grid-cols-3 gap-2">
                              {COMPASS_DIRECTIONS.map((dir) => (
                                <button
                                  key={dir}
                                  type="button"
                                  onClick={() => setCompassDirection(compassDirection === dir ? "" : dir)}
                                  className={`rounded-xl px-3 py-2 text-xs font-bold capitalize transition ${
                                    compassDirection === dir
                                      ? "bg-petrol-dark text-white"
                                      : "bg-canvas-dark text-charcoal-light hover:text-charcoal"
                                  }`}
                                >
                                  {dir}
                                </button>
                              ))}
                              <button
                                type="button"
                                onClick={() => setCompassDirection(compassDirection === "unknown" ? "" : "unknown")}
                                className={`rounded-xl px-3 py-2 text-xs font-bold transition ${
                                  compassDirection === "unknown"
                                    ? "bg-petrol-dark text-white"
                                    : "bg-canvas-dark text-charcoal-light hover:text-charcoal"
                                }`}
                              >
                                I don&apos;t know
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Step 2: Goals ── */}
                {step === 2 && (
                  <div>
                    <h2 className="font-display text-3xl font-semibold text-charcoal sm:text-4xl">What needs doing?</h2>
                    <p className="mt-2 text-sm text-charcoal-light">Pick everything you want in scope. Miss something here and it won&apos;t end up in the brief.</p>
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

                {/* ── Step 3: Scope Sketch ── */}
                {step === 3 && (
                  <div>
                    <h2 className="font-display text-3xl font-semibold text-charcoal sm:text-4xl">Got a floor plan?</h2>
                    <p className="mt-2 text-sm text-charcoal-light">
                      A photo, sketch, or hand-drawn plan helps catch what words miss — we&apos;ll pull out features, risks, and dimensions automatically.
                    </p>
                    <p className="mt-1 text-xs text-charcoal-light/70">
                      Used only to improve this plan. We store the analysis notes, not the raw image.
                    </p>

                    <input
                      ref={floorPlanRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => handleFloorPlanUpload(e.target.files)}
                    />

                    {/* Upload zone */}
                    {!floorPlan && !analyzingFloorPlan && (
                      <button
                        type="button"
                        onClick={() => floorPlanRef.current?.click()}
                        className="mt-8 grid w-full place-items-center rounded-[28px] border-2 border-dashed border-petrol-light bg-petrol-light/12 px-6 py-14 text-center transition hover:bg-petrol-light/20"
                      >
                        <Upload className="mb-4 h-9 w-9 text-petrol-dark" />
                        <span className="font-bold text-petrol-dark">Drop your floor plan here</span>
                        <span className="mt-1.5 text-sm text-charcoal-light">JPG, PNG, or WebP — photo of a drawing works fine</span>
                      </button>
                    )}

                    {/* Analysing */}
                    {analyzingFloorPlan && (
                      <div className="mt-8 grid place-items-center rounded-[28px] bg-canvas-dark py-16">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-petrol-light border-t-petrol-dark" />
                        <p className="mt-4 text-sm text-charcoal-light">Reading your floor plan…</p>
                      </div>
                    )}

                    {/* Analysis result */}
                    {floorPlan && floorPlan.analysis && !analyzingFloorPlan && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 rounded-2xl border border-charcoal/10 bg-white p-5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-bold text-charcoal">{floorPlan.name}</p>
                            <p className="mt-0.5 text-xs text-petrol-mid">Analysis complete</p>
                          </div>
                          <button
                            type="button"
                            onClick={removeFloorPlan}
                            className="rounded-full p-1.5 hover:bg-canvas-dark"
                            aria-label="Remove floor plan"
                          >
                            <X className="h-4 w-4 text-charcoal-light" />
                          </button>
                        </div>

                        <div className="mt-4 grid gap-3">
                          {floorPlan.analysis.visible_features.length > 0 && (
                            <div>
                              <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.10em] text-charcoal-light">
                                Detected features
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {floorPlan.analysis.visible_features.slice(0, 6).map((f, i) => (
                                  <span key={i} className="rounded-full bg-canvas-dark px-3 py-1 text-xs text-charcoal">
                                    {f}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {floorPlan.analysis.structural_concerns.length > 0 && (
                            <div>
                              <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.10em] text-clay">
                                Concerns noted
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {floorPlan.analysis.structural_concerns.map((c, i) => (
                                  <span key={i} className="rounded-full bg-clay-50 px-3 py-1 text-xs text-clay-700">
                                    {c}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          <p className="text-xs italic text-charcoal-light">{floorPlan.analysis.ai_notes}</p>
                        </div>
                      </motion.div>
                    )}

                    {/* Skip hint */}
                    {!floorPlan && !analyzingFloorPlan && (
                      <p className="mt-4 text-center text-xs text-charcoal-light">
                        No floor plan? No problem — skip this and we&apos;ll work from what you told us.
                      </p>
                    )}
                  </div>
                )}

                {/* ── Step 4: Photos ── */}
                {step === 4 && (
                  <div>
                    <h2 className="font-display text-3xl font-semibold text-charcoal sm:text-4xl">Show us the room</h2>
                    <p className="mt-2 text-sm text-charcoal-light">Photos let us flag visible problems before a contractor charges to &ldquo;discover&rdquo; them. Up to 5, optional.</p>
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
                        <span className="font-bold text-petrol-dark">Add photos of the room</span>
                        <span className="mt-1 text-sm text-charcoal-light">JPG, PNG or HEIC — up to 5, completely optional</span>
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
