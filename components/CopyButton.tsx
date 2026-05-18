"use client";

import { Check, Copy } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

export default function CopyButton({
  text,
  label = "Copy",
}: {
  text: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);
  const reduceMotion = useReducedMotion();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <motion.button
      type="button"
      onClick={handleCopy}
      whileHover={reduceMotion ? undefined : { scale: 1.02 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      className="inline-flex items-center gap-2 rounded-full border border-petrol-light/45 bg-white px-4 py-2 text-sm font-semibold text-petrol-dark shadow-sm transition-colors hover:bg-petrol-light/10"
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="copied"
            className="inline-flex items-center gap-2"
            initial={reduceMotion ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
          >
            <Check className="h-4 w-4" />
            Copied
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            className="inline-flex items-center gap-2"
            initial={reduceMotion ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
          >
            <Copy className="h-4 w-4" />
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
