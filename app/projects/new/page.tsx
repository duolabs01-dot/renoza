"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Bath, BedDouble, Check, Home, ImagePlus, Lamp, Paintbrush, Sofa, Upload } from "lucide-react";
import type { ComponentType } from "react";
import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { BudgetRange, OwnershipType, ProjectPhoto, RenovationGoal, RoomType } from "@/lib/types";
import { BUDGET_LABELS, BUDGET_OPTIONS, GOAL_LABELS, GOAL_OPTIONS, ROOM_TYPE_LABELS, ROOM_TYPES } from "@/lib/types";
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

export default function NewProjectPage() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const fileRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [roomType, setRoomType] = useState<RoomType>("kitchen");
  const [ownership, setOwnership] = useState<OwnershipType>("own");
  const [roomSize, setRoomSize] = useState("");
  const [budget, setBudget] = useState<BudgetRange>("15k-50k");
  const [goals, setGoals] = useState<RenovationGoal[]>(["paint", "flooring"]);
  const [photos, setPhotos] = useState<ProjectPhoto[]>([]);

  const completion = useMemo(() => {
    let score = 0;
    if (name.trim()) score += 1;
    if (location.trim()) score += 1;
    if (roomSize.trim()) score += 1;
    if (goals.length) score += 1;
    return Math.round((score / 4) * 100);
  }, [goals.length, location, name, roomSize]);

  const canContinue = step === 0 ? name.trim() && location.trim() : step === 1 ? roomSize.trim() : step === 2 ? goals.length > 0 : true;

  const go = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  const toggleGoal = (goal: RenovationGoal) => {
    setGoals((current) => current.includes(goal) ? current.filter((item) => item !== goal) : [...current, goal]);
  };

  const addPhotos = (files: FileList | null) => {
    if (!files) return;
    const next = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, 5 - photos.length)
      .map((file) => ({
        id: `${file.name}-${file.lastModified}`,
        name: file.name,
        size: file.size,
        type: file.type,
        previewUrl: URL.createObjectURL(file),
      }));
    setPhotos((current) => [...current, ...next].slice(0, 5));
  };

  const submit = () => {
    setSubmitting(true);
    window.setTimeout(() => {
      const input = { name, location, room_type: roomType, ownership_type: ownership, room_size: roomSize, budget_range: budget, goals, photos };
      router.push(`/projects/mock-${Date.now()}?data=${encodeURIComponent(JSON.stringify(input))}`);
    }, 1600);
  };

  if (submitting) {
    return (
      <main className="grid min-h-[calc(100vh-4rem)] place-items-center px-6">
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="mx-auto mb-7 grid h-20 w-20 place-items-center rounded-[26px] bg-petrol-dark shadow-2xl shadow-petrol-dark/25">
            <LogoMark size={62} inverse />
          </div>
          <h1 className="font-display text-4xl font-semibold text-charcoal">Analysing your space...</h1>
          <p className="mt-3 text-sm text-charcoal-light">Checking local cost ranges, renovation risks, and contractor brief language.</p>
          <div className="mx-auto mt-8 h-1 w-72 overflow-hidden rounded-full bg-canvas-dark">
            <motion.div className="h-full bg-petrol-dark" initial={{ x: "-100%" }} animate={{ x: "100%" }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }} />
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-4rem)]">
      <div className="container-page grid gap-10 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:py-16">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow mb-4">New plan</p>
          <h1 className="font-display text-5xl font-semibold leading-tight text-charcoal">
            Tell us enough to protect the budget.
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
          <div className="border-b border-charcoal/10 bg-white px-5 py-4 sm:px-8">
            <div className="flex items-center justify-between gap-3">
              {steps.map((label, index) => (
                <button key={label} type="button" onClick={() => go(index)} className="flex min-w-0 items-center gap-2">
                  <span className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold ${index <= step ? "bg-petrol-dark text-white" : "bg-canvas-dark text-charcoal-light"}`}>
                    {index < step ? <Check className="h-4 w-4" /> : index + 1}
                  </span>
                  <span className={`hidden text-xs font-bold uppercase tracking-[0.12em] sm:block ${index === step ? "text-petrol-dark" : "text-charcoal-light"}`}>{label}</span>
                </button>
              ))}
            </div>
          </div>

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
                {step === 0 ? (
                  <div>
                    <h2 className="font-display text-4xl font-semibold text-charcoal">Project details</h2>
                    <p className="mt-2 text-sm text-charcoal-light">Name the renovation and place it in South African reality.</p>
                    <div className="mt-8 grid gap-5">
                      <label className="block">
                        <span className="text-sm font-bold text-charcoal">Project name</span>
                        <input value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full rounded-2xl border border-charcoal/10 bg-white px-5 py-4 text-base outline-none ring-petrol-light transition focus:ring-4" placeholder="Kitchen upgrade - Sunninghill" />
                      </label>
                      <label className="block">
                        <span className="text-sm font-bold text-charcoal">City or province</span>
                        <input value={location} onChange={(e) => setLocation(e.target.value)} className="mt-2 w-full rounded-2xl border border-charcoal/10 bg-white px-5 py-4 text-base outline-none ring-petrol-light transition focus:ring-4" placeholder="Johannesburg, Gauteng" />
                      </label>
                    </div>
                  </div>
                ) : null}

                {step === 1 ? (
                  <div>
                    <h2 className="font-display text-4xl font-semibold text-charcoal">Room and budget</h2>
                    <p className="mt-2 text-sm text-charcoal-light">Select the room, ownership, budget, and approximate size.</p>
                    <div className="mt-8 grid gap-7">
                      <div className="grid gap-3 sm:grid-cols-4">
                        {ROOM_TYPES.map((room) => {
                          const Icon = roomIcons[room];
                          const selected = roomType === room;
                          return (
                            <motion.button key={room} type="button" whileHover={{ y: -2 }} onClick={() => setRoomType(room)} className={`rounded-2xl border p-4 text-left transition ${selected ? "border-petrol-dark bg-petrol-light/18" : "border-charcoal/10 bg-white"}`}>
                              <Icon className={`mb-5 h-6 w-6 ${selected ? "text-petrol-dark" : "text-charcoal-light"}`} />
                              <span className="text-sm font-bold text-charcoal">{ROOM_TYPE_LABELS[room]}</span>
                            </motion.button>
                          );
                        })}
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {(["own", "rent"] as OwnershipType[]).map((item) => (
                          <button key={item} type="button" onClick={() => setOwnership(item)} className={`rounded-2xl border px-5 py-4 text-left font-bold ${ownership === item ? "border-petrol-dark bg-petrol-dark text-white" : "border-charcoal/10 bg-white text-charcoal"}`}>
                            {item === "own" ? "I own this property" : "I rent this property"}
                          </button>
                        ))}
                      </div>
                      <label>
                        <span className="text-sm font-bold text-charcoal">Approximate room size</span>
                        <input value={roomSize} onChange={(e) => setRoomSize(e.target.value)} className="mt-2 w-full rounded-2xl border border-charcoal/10 bg-white px-5 py-4 outline-none ring-petrol-light transition focus:ring-4" placeholder="4m x 5m or approx. 20m2" />
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {BUDGET_OPTIONS.map((item) => (
                          <button key={item} type="button" onClick={() => setBudget(item)} className={`rounded-full px-4 py-2 text-sm font-bold transition ${budget === item ? "bg-petrol-dark text-white" : "bg-white text-charcoal-light ring-1 ring-charcoal/10"}`}>
                            {BUDGET_LABELS[item]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}

                {step === 2 ? (
                  <div>
                    <h2 className="font-display text-4xl font-semibold text-charcoal">Renovation goals</h2>
                    <p className="mt-2 text-sm text-charcoal-light">Choose every job you want included in the contractor scope.</p>
                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                      {GOAL_OPTIONS.map((goal) => {
                        const Icon = goalIcons[goal] ?? Home;
                        const selected = goals.includes(goal);
                        return (
                          <motion.button key={goal} type="button" whileTap={{ scale: 0.98 }} onClick={() => toggleGoal(goal)} className={`relative rounded-2xl border p-5 text-left transition ${selected ? "border-petrol-dark bg-petrol-light/18" : "border-charcoal/10 bg-white"}`}>
                            <Icon className={`mb-5 h-6 w-6 ${selected ? "text-petrol-dark" : "text-charcoal-light"}`} />
                            <span className="font-bold text-charcoal">{GOAL_LABELS[goal]}</span>
                            <AnimatePresence>
                              {selected ? (
                                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute right-4 top-4 grid h-7 w-7 place-items-center rounded-full bg-petrol-dark text-white">
                                  <Check className="h-4 w-4" />
                                </motion.span>
                              ) : null}
                            </AnimatePresence>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                {step === 3 ? (
                  <div>
                    <h2 className="font-display text-4xl font-semibold text-charcoal">Room photos</h2>
                    <p className="mt-2 text-sm text-charcoal-light">Add up to 5 photos. For now they are previewed locally and carried into the mock plan.</p>
                    <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => addPhotos(e.target.files)} />
                    <button type="button" onClick={() => fileRef.current?.click()} className="mt-8 grid w-full place-items-center rounded-[28px] border-2 border-dashed border-petrol-light bg-petrol-light/12 px-6 py-14 text-center transition hover:bg-petrol-light/20">
                      <Upload className="mb-4 h-9 w-9 text-petrol-dark" />
                      <span className="font-bold text-petrol-dark">Click to browse photos</span>
                      <span className="mt-1 text-sm text-charcoal-light">JPG, PNG or HEIC screenshots from WhatsApp</span>
                    </button>
                    {photos.length ? (
                      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
                        {photos.map((photo) => (
                          <motion.div key={photo.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="aspect-square overflow-hidden rounded-2xl bg-canvas-dark">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={photo.previewUrl} alt={photo.name} className="h-full w-full object-cover" />
                          </motion.div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between border-t border-charcoal/10 bg-white px-5 py-5 sm:px-8">
            <button type="button" disabled={step === 0} onClick={() => go(step - 1)} className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-charcoal-light disabled:opacity-30">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            {step < steps.length - 1 ? (
              <button type="button" disabled={!canContinue} onClick={() => go(step + 1)} className="inline-flex items-center gap-2 rounded-full bg-petrol-dark px-6 py-3 text-sm font-bold text-white disabled:bg-canvas-dark disabled:text-charcoal-light">
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button type="button" onClick={submit} className="inline-flex items-center gap-2 rounded-full bg-petrol-dark px-6 py-3 text-sm font-bold text-white">
                Generate plan <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
