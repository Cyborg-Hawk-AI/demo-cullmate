"use client";

import { useState } from "react";
import {
  WEDDINGS,
  ACTIVITY_FEED,
  MONTHLY_STATS,
  PROCESSING_CHART,
  formatDate,
  statusLabel,
  statusColor,
} from "@/lib/mock-data";
import DevNote from "@/components/DevNote";
import { useToast } from "@/components/Toast";
import type { TabId } from "./DemoApp";

type Props = {
  selectedWeddingId: string;
  onSelectWedding: (id: string) => void;
  onNavigate: (tab: TabId) => void;
};

export default function DashboardView({ selectedWeddingId, onSelectWedding, onNavigate }: Props) {
  const { showToast } = useToast();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "progress" | "raws">("date");
  const [showNewModal, setShowNewModal] = useState(false);
  const [newCouple, setNewCouple] = useState("");
  const [newVenue, setNewVenue] = useState("");

  const filtered = WEDDINGS.filter((w) => statusFilter === "all" || w.status === statusFilter).sort(
    (a, b) => {
      if (sortBy === "date") return b.date.localeCompare(a.date);
      if (sortBy === "progress") return b.progress - a.progress;
      return b.rawCount - a.rawCount;
    }
  );

  const selected = WEDDINGS.find((w) => w.id === selectedWeddingId);

  const maxWeddings = Math.max(...PROCESSING_CHART.map((d) => d.weddings));

  function handleCreateWedding() {
    if (!newCouple.trim()) return;
    showToast(`Wedding "${newCouple}" queued for processing`, "success");
    setShowNewModal(false);
    setNewCouple("");
    setNewVenue("");
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Processing Dashboard</h1>
          <p className="text-sm text-zinc-400">Mitchell Wedding Co. · June 2026 season</p>
        </div>
        <div className="flex items-center gap-2">
          <DevNote note="Production: Dashboard aggregates job status from a Postgres queue table updated by GPU workers via webhooks. Real-time updates via WebSocket or SSE." />
          <button
            type="button"
            onClick={() => setShowNewModal(true)}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500"
          >
            + New Wedding
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Weddings This Month", value: MONTHLY_STATS.weddingsProcessed, note: "Counted from completed pipeline jobs in billing period." },
          { label: "RAWs Processed", value: MONTHLY_STATS.totalRaws.toLocaleString(), note: "S3 object count across all ingestion buckets." },
          { label: "Hours Saved", value: MONTHLY_STATS.hoursSaved, note: "Estimated: (manual_avg - ai_avg) × weddings. Manual avg = 6hrs." },
          { label: "Avg Cull Time", value: MONTHLY_STATS.avgCullTime, note: "p50 GPU pipeline duration from ingest-complete to scoring-complete." },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-white/10 bg-surface-700/50 p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-zinc-500">{stat.label}</p>
              <DevNote note={stat.note} />
            </div>
            <p className="mt-2 font-display text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chart */}
        <div className="rounded-xl border border-white/10 bg-surface-700/50 p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Monthly Processing Volume</h2>
            <DevNote note="Production: Chart data from analytics warehouse (e.g. ClickHouse) aggregating job completions by month." />
          </div>
          <div className="flex h-40 items-end gap-3">
            {PROCESSING_CHART.map((d) => (
              <div key={d.month} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-gradient-to-t from-brand-600 to-brand-400 transition-all hover:from-brand-500 hover:to-brand-300"
                  style={{ height: `${(d.weddings / maxWeddings) * 100}%`, minHeight: "8px" }}
                  title={`${d.weddings} weddings, ${d.hoursSaved}h saved`}
                />
                <span className="text-xs text-zinc-500">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity feed */}
        <div className="rounded-xl border border-white/10 bg-surface-700/50 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Activity Feed</h2>
            <DevNote note="Production: Event stream from pipeline stages — ingestion, grouping, scoring, export — pushed to activity log via EventBridge." />
          </div>
          <div className="max-h-48 space-y-3 overflow-y-auto">
            {ACTIVITY_FEED.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.weddingId) onSelectWedding(item.weddingId);
                  showToast(`Selected: ${item.message.slice(0, 50)}...`, "info");
                }}
                className="block w-full rounded-lg border border-white/5 bg-surface-800/50 p-2.5 text-left transition-colors hover:border-brand-500/20"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      item.type === "success"
                        ? "bg-emerald-400"
                        : item.type === "warning"
                          ? "bg-amber-400"
                          : item.type === "processing"
                            ? "bg-blue-400 animate-pulse"
                            : "bg-zinc-400"
                    }`}
                  />
                  <span className="text-[10px] text-zinc-500">{item.time}</span>
                </div>
                <p className="mt-1 text-xs text-zinc-300">{item.message}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Wedding table */}
      <div className="rounded-xl border border-white/10 bg-surface-700/50">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 p-4">
          <h2 className="font-semibold">Weddings</h2>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-white/10 bg-surface-800 px-3 py-1.5 text-sm text-zinc-300"
            >
              <option value="all">All statuses</option>
              <option value="complete">Complete</option>
              <option value="scoring">AI Scoring</option>
              <option value="grouping">Grouping</option>
              <option value="queued">Queued</option>
              <option value="review">Needs Review</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="rounded-lg border border-white/10 bg-surface-800 px-3 py-1.5 text-sm text-zinc-300"
            >
              <option value="date">Sort by date</option>
              <option value="progress">Sort by progress</option>
              <option value="raws">Sort by RAW count</option>
            </select>
            <DevNote note="Production: Table queries weddings table with filters. Pagination via cursor. Click row opens wedding detail." />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left text-xs text-zinc-500">
                <th className="p-3 font-medium">Couple</th>
                <th className="p-3 font-medium">Date</th>
                <th className="p-3 font-medium">RAWs</th>
                <th className="p-3 font-medium">Selected</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium">Progress</th>
                <th className="p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((w) => (
                <tr
                  key={w.id}
                  onClick={() => onSelectWedding(w.id)}
                  className={`cursor-pointer border-b border-white/5 transition-colors hover:bg-white/5 ${
                    selectedWeddingId === w.id ? "bg-brand-600/10" : ""
                  }`}
                >
                  <td className="p-3">
                    <p className="font-medium text-zinc-200">{w.couple}</p>
                    <p className="text-xs text-zinc-500">{w.venue}</p>
                  </td>
                  <td className="p-3 text-zinc-400">{formatDate(w.date)}</td>
                  <td className="p-3 text-zinc-300">{w.rawCount.toLocaleString()}</td>
                  <td className="p-3 text-zinc-300">
                    {w.selectedCount > 0 ? w.selectedCount : "—"}
                  </td>
                  <td className="p-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColor(w.status)}`}>
                      {statusLabel(w.status)}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-surface-600">
                        <div
                          className="h-full rounded-full bg-brand-500 transition-all"
                          style={{ width: `${w.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-zinc-500">{w.progress}%</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectWedding(w.id);
                        if (w.status === "complete" || w.status === "review") onNavigate("gallery");
                        else if (w.status === "scoring") onNavigate("scoring");
                        else if (w.status === "grouping") onNavigate("duplicates");
                        else onNavigate("ingest");
                      }}
                      className="rounded px-2 py-1 text-xs text-brand-400 hover:bg-brand-500/10"
                    >
                      Open →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected wedding detail */}
      {selected && (
        <div className="rounded-xl border border-brand-500/20 bg-brand-500/5 p-5">
          <h3 className="font-semibold text-brand-300">Selected: {selected.couple}</h3>
          <div className="mt-3 grid gap-4 sm:grid-cols-4">
            <div>
              <p className="text-xs text-zinc-500">Sharpness Avg</p>
              <p className="text-lg font-bold">{selected.sharpnessAvg > 0 ? `${selected.sharpnessAvg}%` : "—"}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Eyes Open Rate</p>
              <p className="text-lg font-bold">{selected.eyesOpenRate > 0 ? `${selected.eyesOpenRate}%` : "—"}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Expression Score</p>
              <p className="text-lg font-bold">{selected.expressionScore > 0 ? `${selected.expressionScore}%` : "—"}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Duplicate Groups</p>
              <p className="text-lg font-bold">{selected.duplicateGroups || "—"}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={() => onNavigate("ingest")} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs hover:bg-white/5">View Ingestion</button>
            <button type="button" onClick={() => onNavigate("duplicates")} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs hover:bg-white/5">View Duplicates</button>
            <button type="button" onClick={() => onNavigate("scoring")} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs hover:bg-white/5">View Scoring</button>
            <button type="button" onClick={() => onNavigate("gallery")} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs hover:bg-white/5">View Gallery</button>
          </div>
        </div>
      )}

      {/* New wedding modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md animate-slide-up rounded-xl border border-white/10 bg-surface-700 p-6">
            <h3 className="font-display text-lg font-bold">New Wedding</h3>
            <p className="mt-1 text-sm text-zinc-400">Create a new processing job for a wedding shoot.</p>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs text-zinc-500">Couple names</label>
                <input
                  type="text"
                  value={newCouple}
                  onChange={(e) => setNewCouple(e.target.value)}
                  placeholder="e.g. Anna & Chris Park"
                  className="mt-1 w-full rounded-lg border border-white/10 bg-surface-800 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-500">Venue</label>
                <input
                  type="text"
                  value={newVenue}
                  onChange={(e) => setNewVenue(e.target.value)}
                  placeholder="e.g. The Ritz-Carlton, Half Moon Bay"
                  className="mt-1 w-full rounded-lg border border-white/10 bg-surface-800 px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setShowNewModal(false)} className="rounded-lg px-4 py-2 text-sm text-zinc-400 hover:text-white">Cancel</button>
              <button type="button" onClick={handleCreateWedding} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500">Create & Queue</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
