"use client";

import { useState, useRef, useEffect } from "react";

type DevNoteProps = {
  note: string;
  className?: string;
};

export default function DevNote({ note, className = "" }: DevNoteProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className={`relative inline-flex ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-5 w-5 items-center justify-center rounded-full border border-brand-500/40 bg-brand-500/10 text-[10px] font-bold text-brand-400 transition-colors hover:bg-brand-500/20"
        aria-label="Developer note"
        title="DEV NOTE"
      >
        i
      </button>
      {open && (
        <div className="absolute left-1/2 top-full z-50 mt-2 w-72 -translate-x-1/2 animate-fade-in rounded-lg border border-brand-500/30 bg-surface-700 p-3 shadow-xl">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-brand-400">DEV NOTE</p>
          <p className="text-xs leading-relaxed text-zinc-300">{note}</p>
        </div>
      )}
    </div>
  );
}
