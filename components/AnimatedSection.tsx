"use client";

import { motion, useReducedMotion } from "framer-motion";

type Props = {
  children?: React.ReactNode;
  className?: string;
  delay?: number;
  id?: string;
  style?: React.CSSProperties;
};

export default function AnimatedSection({
  children,
  className = "",
  delay = 0,
  id,
  style,
}: Props) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      id={id}
      className={className}
      style={style}
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.section>
  );
}
