"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, Circle } from "lucide-react";
import { generateSnaggingList, getSnaggingGroupLabel } from "@/lib/snag";
import type { RenovationGoal, RoomType } from "@/lib/types";

interface Props {
  goals: RenovationGoal[];
  roomType: RoomType;
  projectId: string;
}

export default function SnaggingList({ goals, roomType, projectId }: Props) {
  const items = generateSnaggingList(goals, roomType);
  const storageKey = `snag_${projectId}`;

  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setChecked(JSON.parse(saved));
    } catch { /* ignore */ }
  }, [storageKey]);

  function toggle(id: string) {
    setChecked(prev => {
      const next = { ...prev, [id]: !prev[id] };
      try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }

  function toggleTip(id: string) {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  }

  if (items.length === 0) return (
    <p className="text-sm text-charcoal-light">No snagging items for the selected goals.</p>
  );

  // Group by goal
  const groupMap = new Map<string, typeof items>();
  for (const item of items) {
    const key = item.goal;
    if (!groupMap.has(key)) groupMap.set(key, []);
    groupMap.get(key)!.push(item);
  }

  const checkedCount = items.filter(i => checked[i.id]).length;
  const total = items.length;
  const pct = Math.round((checkedCount / total) * 100);
  const allDone = checkedCount === total;

  return (
    <div className="snag-print-target">
      {/* Progress */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-semibold text-charcoal">
            {allDone
              ? "All items signed off ✓"
              : `${checkedCount} of ${total} items signed off`}
          </p>
          <span className="text-sm font-bold text-petrol-dark">{pct}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-canvas-dark">
          <div
            className="h-full rounded-full bg-petrol-mid transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {allDone && (
        <div className="mb-5 flex items-center gap-3 rounded-2xl bg-petrol-light/20 px-4 py-3 text-sm font-semibold text-petrol-dark">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          All snagging items cleared. You&apos;re ready to sign off on the final invoice.
        </div>
      )}

      {/* Groups */}
      <div className="space-y-5">
        {Array.from(groupMap.entries()).map(([goalKey, groupItems]) => (
          <div key={goalKey}>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-charcoal-light">
              {getSnaggingGroupLabel(goalKey)}
            </p>
            <div className="space-y-2">
              {groupItems.map(item => {
                const isChecked = !!checked[item.id];
                const isExpanded = !!expanded[item.id];
                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl border transition-colors ${
                      isChecked ? "border-petrol-light/40 bg-petrol-light/10" : "border-canvas-dark bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-3 px-4 py-3">
                      <button
                        onClick={() => toggle(item.id)}
                        className="mt-0.5 shrink-0 text-petrol-mid hover:text-petrol-dark print:hidden"
                        aria-label={isChecked ? "Uncheck" : "Check"}
                      >
                        {isChecked
                          ? <CheckCircle2 className="h-5 w-5" />
                          : <Circle className="h-5 w-5 text-charcoal-light/40" />}
                      </button>
                      {/* Print checkbox */}
                      <div className="hidden h-4 w-4 shrink-0 border border-charcoal print:block print:mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start gap-2">
                          <p className={`text-sm font-semibold leading-snug ${
                            isChecked ? "text-charcoal-light line-through" : "text-charcoal"
                          }`}>
                            {item.label}
                          </p>
                          {item.critical && (
                            <span className="mt-0.5 flex shrink-0 items-center gap-1 rounded-full bg-clay/10 px-2 py-0.5 text-[10px] font-bold text-clay">
                              <AlertTriangle className="h-3 w-3" /> Critical
                            </span>
                          )}
                        </div>
                        {isExpanded && (
                          <p className="mt-1.5 text-xs leading-5 text-charcoal-light print:block">
                            {item.tip}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => toggleTip(item.id)}
                        className="shrink-0 text-charcoal-light/40 hover:text-charcoal-light print:hidden"
                        aria-label={isExpanded ? "Hide tip" : "Show tip"}
                      >
                        {isExpanded
                          ? <ChevronUp className="h-4 w-4" />
                          : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Print styles scoped to this component */}
      <style>{`
        @media print {
          body > * { display: none !important; }
          .snag-print-target {
            display: block !important;
            position: fixed; top: 0; left: 0; right: 0;
            padding: 32px; background: white;
          }
        }
      `}</style>
    </div>
  );
}
