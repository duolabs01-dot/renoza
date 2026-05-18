"use client";

import { motion, useReducedMotion } from "framer-motion";

type Props = {
  title: string;
  children: React.ReactNode;
  kicker?: string;
  className?: string;
  id?: string;
};

export default function SectionCard({ title, kicker, children, className = "", id }: Props) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      id={id}
      className={`premium-card rounded-[28px] p-5 sm:p-7 ${className}`}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      whileHover={reduceMotion ? undefined : { y: -3, boxShadow: "0 22px 70px rgba(45,45,45,0.10)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mb-5">
        {kicker ? <p className="eyebrow mb-2">{kicker}</p> : null}
        <h2 className="font-display text-2xl font-semibold leading-tight text-charcoal sm:text-3xl">
          {title}
        </h2>
      </div>
      {children}
    </motion.section>
  );
}
