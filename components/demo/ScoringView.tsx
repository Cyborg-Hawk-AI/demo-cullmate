"use client";

import { useState } from "react";
import { WEDDINGS, SCORE_DISTRIBUTION } from "@/lib/mock-data";
import DevNote from "@/components/DevNote";
import { useToast } from "@/components/Toast";

type Props = {
  selectedWeddingId: string;
  onSelectWedding: (id: string) => void;
};

type ScoredShot = {
  id: string;
  filename: string;
  sharpness: number;
  eyesOpen: boolean;
  expression: number;
  composite: number;
  flagged: boolean;
  approved: boolean;
};

const INITIAL_SHOTS: ScoredShot[] = [
  { id: "sc-1", filename: "DSC_4823.NEF", sharpness: 96, eyesOpen: true, expression: 94, composite: 95, flagged: false, approved: true },
  { id: "sc-2", filename: "DSC_5103.NEF", sharpness: 94, eyesOpen: true, expression: 91, composite: 93, flagged: false, approved: true },
  { id: "sc-3", filename: "DSC_5201.NEF", sharpness: 88, eyesOpen: false, expression: 85, composite: 72, flagged: true, approved: false },
  { id: "sc-4", filename: "DSC_5302.NEF", sharpness: 91, eyesOpen: true, expression: 78, composite: 86, flagged: false, approved: true },
  { id: "sc-5", filename: "DSC_5401.NEF", sharpness: 92, eyesOpen: true, expression: 88, composite: 90, flagged: false, approved: true },
  { id: "sc-6", filename: "DSC_5502.NEF", sharpness: 67, eyesOpen: true, expression: 82, composite: 71, flagged: true, approved: false },
  { id: "sc-7", filename: "DSC_5603.NEF", sharpness: 95, eyesOpen: true, expression: 92, composite: 94, flagged: false, approved: true },
  { id: "sc-8", filename: "DSC_5701.NEF", sharpness: 89, eyesOpen: true, expression: 76, composite: 84, flagged: false, approved: false },
];

export default function ScoringView({ selectedWeddingId, onSelectWedding }: Props) {
  const { showToast } = useToast();
  const [shots, setShots] = useState(INITIAL_SHOTS);
  const [filter, setFilter] = useState<"all" | "approved" | "flagged">("all");
  const [sortField, setSortField] = useState<"composite" | "sharpness" | "expression">("composite");
  const [threshold, setThreshold] = useState(80);
  const [selectedShot, setSelectedShot] = useState<ScoredShot | null>(null);
  const [scoring, setScoring] = useState(false);
  const [progress, setProgress] = useState(67);

  const wedding = WEDDINGS.find((w) => w.id === selectedWeddingId);

  const filtered = shots
    .filter((s) => {
      if (filter === "approved") return s.approved;
      if (filter === "flagged") return s.flagged;
      return true;
    })
    .sort((a, b) => b[sortField] - a[sortField]);

  function toggleApproval(id: string) {
    setShots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, approved: !s.approved, flagged: false } : s))
    );
    showToast("Shot approval updated", "success");
  }

  function runScoring() {
    setScoring(true);
    let p = progress;
    const interval = setInterval(() => {
      p += 5;
      setProgress(Math.min(p, 100));
      if (p >= 100) {
        clearInterval(interval);
        setScoring(false);
        showToast("AI scoring complete — 412 picks selected", "success");
      }
    }, 150);
  }

  const maxCount = Math.max(...SCORE_DISTRIBUTION.map((d) => d.count));

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">AI Best-Shot Scoring</h1>
          <p className="text-sm text-zinc-400">Sharpness · Eyes Open · Expression — {wedding?.couple}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedWeddingId}
            onChange={(e) => onSelectWedding(e.target.value)}
            className="rounded-lg border border-white/10 bg-surface-700 px-3 py-2 text-sm"
          >
            {WEDDINGS.map((w) => (
              <option key={w.id} value={w.id}>{w.couple}</option>
            ))}
          </select>
          <DevNote note="Production: Three ONNX models on GPU — Laplacian variance (sharpness), MediaPipe face mesh (eyes), custom expression classifier trained on wedding data. Composite = weighted sum." />
        </div>
      </div>

      {/* Scoring progress */}
      {(wedding?.status === "scoring" || scoring) && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-amber-300">AI Scoring in progress...</span>
            <span className="text-sm text-amber-400">{progress}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-600">
            <div className="h-full rounded-full bg-amber-500 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-xs text-zinc-500">Processing 2,913 frames on A10G GPU · ETA 6 min</p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Score distribution */}
        <div className="rounded-xl border border-white/10 bg-surface-700/50 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Score Distribution</h2>
            <DevNote note="Production: Histogram from scoring_results table. Threshold slider updates pick count in real-time via API." />
          </div>
          <div className="space-y-2">
            {SCORE_DISTRIBUTION.map((d) => (
              <div key={d.label} className="flex items-center gap-2">
                <span className="w-12 text-xs text-zinc-500">{d.label}</span>
                <div className="flex-1 h-4 overflow-hidden rounded bg-surface-600">
                  <div
                    className="h-full rounded bg-gradient-to-r from-brand-600 to-brand-400"
                    style={{ width: `${(d.count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="w-8 text-xs text-zinc-400">{d.count}</span>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <label className="text-xs text-zinc-500">Pick threshold: {threshold}</label>
            <input
              type="range"
              min={60}
              max={95}
              value={threshold}
              onChange={(e) => {
                setThreshold(Number(e.target.value));
                showToast(`Threshold set to ${e.target.value} — ${shots.filter((s) => s.composite >= Number(e.target.value)).length} picks`, "info");
              }}
              className="mt-1 w-full accent-brand-500"
            />
          </div>
        </div>

        {/* Model weights */}
        <div className="rounded-xl border border-white/10 bg-surface-700/50 p-5 lg:col-span-2">
          <h2 className="mb-4 font-semibold">Scoring Model Weights</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Sharpness", weight: 35, desc: "Laplacian variance on face ROI", color: "bg-emerald-500" },
              { label: "Eyes Open", weight: 30, desc: "EAR threshold via face landmarks", color: "bg-blue-500" },
              { label: "Expression", weight: 35, desc: "Smile/neutral classifier v2.3", color: "bg-purple-500" },
            ].map((m) => (
              <div key={m.label} className="rounded-lg border border-white/10 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{m.label}</span>
                  <span className="text-sm text-brand-400">{m.weight}%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-600">
                  <div className={`h-full rounded-full ${m.color}`} style={{ width: `${m.weight}%` }} />
                </div>
                <p className="mt-2 text-xs text-zinc-500">{m.desc}</p>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={runScoring}
            disabled={scoring}
            className="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500 disabled:opacity-50"
          >
            {scoring ? "Scoring..." : "Re-run AI Scoring"}
          </button>
        </div>
      </div>

      {/* Shots table */}
      <div className="rounded-xl border border-white/10 bg-surface-700/50">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 p-4">
          <div className="flex gap-2">
            {(["all", "approved", "flagged"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-lg px-3 py-1.5 text-xs capitalize ${
                  filter === f ? "bg-brand-600/20 text-brand-300" : "text-zinc-400 hover:bg-white/5"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value as typeof sortField)}
            className="rounded-lg border border-white/10 bg-surface-800 px-3 py-1.5 text-xs"
          >
            <option value="composite">Sort by composite</option>
            <option value="sharpness">Sort by sharpness</option>
            <option value="expression">Sort by expression</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left text-xs text-zinc-500">
                <th className="p-3">File</th>
                <th className="p-3">Sharpness</th>
                <th className="p-3">Eyes</th>
                <th className="p-3">Expression</th>
                <th className="p-3">Composite</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((shot) => (
                <tr
                  key={shot.id}
                  onClick={() => setSelectedShot(shot)}
                  className="cursor-pointer border-b border-white/5 hover:bg-white/5"
                >
                  <td className="p-3 font-mono text-xs">{shot.filename}</td>
                  <td className="p-3">
                    <span className={shot.sharpness >= 90 ? "text-emerald-400" : shot.sharpness >= 75 ? "text-amber-400" : "text-red-400"}>
                      {shot.sharpness}
                    </span>
                  </td>
                  <td className="p-3">{shot.eyesOpen ? "✓ Open" : "✗ Closed"}</td>
                  <td className="p-3">{shot.expression}</td>
                  <td className="p-3 font-bold">{shot.composite}</td>
                  <td className="p-3">
                    {shot.flagged ? (
                      <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-400">Flagged</span>
                    ) : shot.approved ? (
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400">Approved</span>
                    ) : (
                      <span className="rounded-full bg-zinc-500/10 px-2 py-0.5 text-xs text-zinc-400">Pending</span>
                    )}
                  </td>
                  <td className="p-3">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); toggleApproval(shot.id); }}
                      className="rounded px-2 py-1 text-xs text-brand-400 hover:bg-brand-500/10"
                    >
                      {shot.approved ? "Reject" : "Approve"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shot detail modal */}
      {selectedShot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg animate-slide-up rounded-xl border border-white/10 bg-surface-700 p-6">
            <h3 className="font-mono text-lg font-bold">{selectedShot.filename}</h3>
            <div className="mt-4 flex aspect-video items-center justify-center rounded-lg bg-surface-600 text-6xl">📷</div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg bg-surface-800 p-3">
                <p className="text-xs text-zinc-500">Sharpness</p>
                <p className="text-xl font-bold text-emerald-400">{selectedShot.sharpness}</p>
              </div>
              <div className="rounded-lg bg-surface-800 p-3">
                <p className="text-xs text-zinc-500">Eyes</p>
                <p className="text-xl font-bold">{selectedShot.eyesOpen ? "Open" : "Closed"}</p>
              </div>
              <div className="rounded-lg bg-surface-800 p-3">
                <p className="text-xs text-zinc-500">Expression</p>
                <p className="text-xl font-bold text-blue-400">{selectedShot.expression}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setSelectedShot(null)} className="rounded-lg px-4 py-2 text-sm text-zinc-400">Close</button>
              <button
                type="button"
                onClick={() => { toggleApproval(selectedShot.id); setSelectedShot(null); }}
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm text-white"
              >
                {selectedShot.approved ? "Reject Pick" : "Approve Pick"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
