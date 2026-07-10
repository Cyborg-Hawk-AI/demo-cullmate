"use client";

import { useState } from "react";
import { WEDDINGS, DUPLICATE_GROUPS } from "@/lib/mock-data";
import DevNote from "@/components/DevNote";
import { useToast } from "@/components/Toast";

type Props = {
  selectedWeddingId: string;
  onSelectWedding: (id: string) => void;
};

export default function DuplicatesView({ selectedWeddingId, onSelectWedding }: Props) {
  const { showToast } = useToast();
  const [expandedGroup, setExpandedGroup] = useState<string | null>("dg-001");
  const [sceneFilter, setSceneFilter] = useState("all");
  const [groups, setGroups] = useState(DUPLICATE_GROUPS);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const wedding = WEDDINGS.find((w) => w.id === selectedWeddingId);
  const weddingGroups = groups.filter((g) => g.weddingId === selectedWeddingId);
  const scenes = Array.from(new Set(weddingGroups.map((g) => g.scene)));
  const filtered = sceneFilter === "all" ? weddingGroups : weddingGroups.filter((g) => g.scene === sceneFilter);

  function selectBestShot(groupId: string, shotId: string) {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              bestShotId: shotId,
              shots: g.shots.map((s) => ({ ...s, selected: s.id === shotId })),
            }
          : g
      )
    );
    showToast("Best shot updated for duplicate group", "success");
  }

  function approveAll() {
    showToast(`Approved AI picks for ${filtered.length} duplicate groups`, "success");
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Duplicate Grouping</h1>
          <p className="text-sm text-zinc-400">
            {wedding?.duplicateGroups || weddingGroups.length} burst sequences · {wedding?.couple}
          </p>
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
          <select
            value={sceneFilter}
            onChange={(e) => setSceneFilter(e.target.value)}
            className="rounded-lg border border-white/10 bg-surface-700 px-3 py-2 text-sm"
          >
            <option value="all">All scenes</option>
            {scenes.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <div className="flex rounded-lg border border-white/10">
            <button type="button" onClick={() => setViewMode("grid")} className={`px-3 py-1.5 text-xs ${viewMode === "grid" ? "bg-brand-600/20 text-brand-300" : "text-zinc-400"}`}>Grid</button>
            <button type="button" onClick={() => setViewMode("list")} className={`px-3 py-1.5 text-xs ${viewMode === "list" ? "bg-brand-600/20 text-brand-300" : "text-zinc-400"}`}>List</button>
          </div>
          <DevNote note="Production: Perceptual hashing + temporal clustering on GPU. Groups stored in Postgres with shot metadata. CLIP embeddings for scene labeling." />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button type="button" onClick={approveAll} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500">
          Approve All AI Picks
        </button>
        <button
          type="button"
          onClick={() => showToast("Re-running duplicate detection with stricter threshold", "info")}
          className="rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
        >
          Re-run Grouping
        </button>
      </div>

      <div className={viewMode === "grid" ? "grid gap-4 md:grid-cols-2" : "space-y-3"}>
        {filtered.map((group) => (
          <div key={group.id} className="rounded-xl border border-white/10 bg-surface-700/50 overflow-hidden">
            <button
              type="button"
              onClick={() => setExpandedGroup(expandedGroup === group.id ? null : group.id)}
              className="flex w-full items-center justify-between p-4 text-left hover:bg-white/5"
            >
              <div>
                <p className="font-medium">{group.scene}</p>
                <p className="text-xs text-zinc-500">{group.count} similar shots · Best: {group.shots.find((s) => s.selected)?.filename}</p>
              </div>
              <span className="text-zinc-500">{expandedGroup === group.id ? "▼" : "▶"}</span>
            </button>

            {expandedGroup === group.id && (
              <div className="border-t border-white/5 p-4">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {group.shots.map((shot) => (
                    <button
                      key={shot.id}
                      type="button"
                      onClick={() => selectBestShot(group.id, shot.id)}
                      className={`rounded-lg border p-3 text-left transition-all ${
                        shot.selected
                          ? "border-brand-500 bg-brand-500/10 ring-1 ring-brand-500/50"
                          : "border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex aspect-[3/2] items-center justify-center rounded bg-surface-600 text-2xl">
                        {shot.selected ? "⭐" : "📷"}
                      </div>
                      <p className="mt-2 font-mono text-xs text-zinc-300">{shot.filename}</p>
                      <div className="mt-1 flex flex-wrap gap-1 text-[10px]">
                        <span className={`rounded px-1 ${shot.sharpness >= 90 ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-500/20 text-zinc-400"}`}>
                          Sharp {shot.sharpness}
                        </span>
                        <span className={`rounded px-1 ${shot.eyesOpen ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                          {shot.eyesOpen ? "Eyes ✓" : "Blink"}
                        </span>
                        <span className="rounded bg-blue-500/20 px-1 text-blue-400">Expr {shot.expression}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-xl border border-white/10 bg-surface-700/50 p-8 text-center">
          <p className="text-zinc-400">No duplicate groups yet for this wedding.</p>
          <button
            type="button"
            onClick={() => showToast("Duplicate grouping queued on GPU cluster", "info")}
            className="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-sm text-white"
          >
            Start Grouping
          </button>
        </div>
      )}
    </div>
  );
}
