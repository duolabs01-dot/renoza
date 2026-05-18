"use client";

import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleCopy}
      className="mt-3 text-xs font-medium text-petrol-700 underline underline-offset-2 hover:text-petrol-900"
    >
      {copied ? "Copied!" : "Copy to clipboard"}
    </button>
  );
}
