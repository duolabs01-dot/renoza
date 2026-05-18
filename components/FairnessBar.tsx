"use client";

import { useEffect, useRef, useState } from "react";

function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 100) { setInView(true); return; }
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.unobserve(el); }
    }, { rootMargin: "100px 0px 100px 0px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView] as const;
}

export default function FairnessBar({ score }: { score: number }) {
  const [ref, inView] = useInView();
  const labels = ["Risky", "Iffy", "Fair", "Solid"];
  const labelIdx = score < 0.3 ? 0 : score < 0.5 ? 1 : score < 0.7 ? 2 : 3;
  return (
    <div ref={ref}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 12, color: "var(--muted)" }}>Risky</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--charcoal)" }}>{labels[labelIdx]}</span>
        <span style={{ fontSize: 12, color: "var(--muted)" }}>Solid</span>
      </div>
      <div className="fairness-track">
        <div className="fairness-dot" style={{ left: inView ? `${score * 100}%` : "0%" }} />
      </div>
    </div>
  );
}
