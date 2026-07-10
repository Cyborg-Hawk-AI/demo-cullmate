"use client";

import { useState } from "react";
import { WEDDINGS } from "@/lib/mock-data";
import DevNote from "@/components/DevNote";
import { useToast } from "@/components/Toast";

type Props = {
  selectedWeddingId: string;
  onSelectWedding: (id: string) => void;
};

type SyncLog = {
  id: string;
  time: string;
  action: string;
  status: "success" | "pending" | "error";
};

const INITIAL_LOGS: SyncLog[] = [
  { id: "l-1", time: "14 min ago", action: "Wrote 412 picks with 5-star rating to Emma Chen Wedding.lrcat", status: "success" },
  { id: "l-2", time: "14 min ago", action: "Applied green color label to AI-approved selects", status: "success" },
  { id: "l-3", time: "1 hr ago", action: "Linked Capture One session: Priya Okonkwo.cosessiondb", status: "success" },
  { id: "l-4", time: "2 hr ago", action: "Syncing 2,913 ratings to Olivia Rivera.lrcat", status: "pending" },
];

export default function CatalogView({ selectedWeddingId, onSelectWedding }: Props) {
  const { showToast } = useToast();
  const [platform, setPlatform] = useState<"lightroom" | "capture-one" | "both">("lightroom");
  const [catalogPath, setCatalogPath] = useState("/Users/sarah/Lightroom/Emma Chen Wedding.lrcat");
  const [ratingStyle, setRatingStyle] = useState<"stars" | "colors" | "both">("both");
  const [syncing, setSyncing] = useState(false);
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [connected, setConnected] = useState(true);

  const wedding = WEDDINGS.find((w) => w.id === selectedWeddingId);

  function handleSync() {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      const newLog: SyncLog = {
        id: `l-${Date.now()}`,
        time: "Just now",
        action: `Synced ${wedding?.selectedCount || 412} picks to ${catalogPath.split("/").pop()}`,
        status: "success",
      };
      setLogs((prev) => [newLog, ...prev]);
      showToast("Catalog sync complete — picks written with ratings", "success");
    }, 2500);
  }

  function handleConnect() {
    setConnected(!connected);
    showToast(connected ? "Catalog disconnected" : "Catalog connected", connected ? "warning" : "success");
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Catalog Integration</h1>
          <p className="text-sm text-zinc-400">Lightroom & Capture One sync — {wedding?.couple}</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedWeddingId}
            onChange={(e) => onSelectWedding(e.target.value)}
            className="rounded-lg border border-white/10 bg-surface-700 px-3 py-2 text-sm"
          >
            {WEDDINGS.map((w) => (
              <option key={w.id} value={w.id}>{w.couple}</option>
            ))}
          </select>
          <DevNote note="Production: Desktop agent (Electron) or Lightroom plugin writes XMP sidecars and updates catalog SQLite. Capture One via COSession API. Cloud sync via signed webhook." />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Connection settings */}
        <div className="rounded-xl border border-white/10 bg-surface-700/50 p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Connection</h2>
            <span className={`rounded-full px-2 py-0.5 text-xs ${connected ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
              {connected ? "Connected" : "Disconnected"}
            </span>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <p className="text-xs text-zinc-500 mb-2">Platform</p>
              <div className="flex gap-2">
                {([
                  { id: "lightroom" as const, label: "Lightroom", icon: "🎨" },
                  { id: "capture-one" as const, label: "Capture One", icon: "📷" },
                  { id: "both" as const, label: "Both", icon: "🔗" },
                ]).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPlatform(p.id)}
                    className={`flex-1 rounded-lg border p-3 text-center text-sm ${
                      platform === p.id ? "border-brand-500/50 bg-brand-500/10" : "border-white/10"
                    }`}
                  >
                    <span className="text-lg">{p.icon}</span>
                    <p className="mt-1">{p.label}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-zinc-500">Catalog path</label>
              <input
                type="text"
                value={catalogPath}
                onChange={(e) => setCatalogPath(e.target.value)}
                className="mt-1 w-full rounded-lg border border-white/10 bg-surface-800 px-3 py-2 text-sm font-mono"
              />
            </div>

            <div>
              <p className="text-xs text-zinc-500 mb-2">Rating style</p>
              <select
                value={ratingStyle}
                onChange={(e) => setRatingStyle(e.target.value as typeof ratingStyle)}
                className="w-full rounded-lg border border-white/10 bg-surface-800 px-3 py-2 text-sm"
              >
                <option value="stars">Star ratings only (5-star picks)</option>
                <option value="colors">Color labels only (green = AI pick)</option>
                <option value="both">Stars + color labels</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleConnect}
                className={`flex-1 rounded-lg border px-4 py-2 text-sm ${
                  connected ? "border-red-500/30 text-red-400 hover:bg-red-500/10" : "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                }`}
              >
                {connected ? "Disconnect" : "Connect"}
              </button>
              <button
                type="button"
                onClick={() => showToast("Browsing for catalog file...", "info")}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
              >
                Browse...
              </button>
            </div>
          </div>
        </div>

        {/* Sync actions */}
        <div className="rounded-xl border border-white/10 bg-surface-700/50 p-5">
          <h2 className="font-semibold">Sync Actions</h2>
          <div className="mt-4 space-y-3">
            {[
              { label: "Write AI Picks", desc: "5-star rating on all approved selects", action: () => showToast("412 picks marked with 5 stars", "success") },
              { label: "Write Rejects", desc: "1-star on flagged/blink shots", action: () => showToast("2,435 rejects marked with 1 star", "info") },
              { label: "Apply Color Labels", desc: "Green = pick, Red = reject, Yellow = review", action: () => showToast("Color labels applied to all images", "success") },
              { label: "Create Collection", desc: "New 'CullMate Picks' collection in catalog", action: () => showToast("Collection 'CullMate Picks' created", "success") },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={item.action}
                className="flex w-full items-center justify-between rounded-lg border border-white/10 p-3 text-left hover:border-brand-500/20 hover:bg-white/5"
              >
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-zinc-500">{item.desc}</p>
                </div>
                <span className="text-brand-400">→</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleSync}
            disabled={syncing || !connected}
            className="mt-4 w-full rounded-lg bg-brand-600 py-2.5 text-sm font-medium text-white hover:bg-brand-500 disabled:opacity-50"
          >
            {syncing ? "Syncing to catalog..." : "Sync All to Catalog"}
          </button>
        </div>
      </div>

      {/* Sync log */}
      <div className="rounded-xl border border-white/10 bg-surface-700/50">
        <div className="border-b border-white/5 p-4">
          <h2 className="font-semibold">Sync Log</h2>
        </div>
        <div className="divide-y divide-white/5">
          {logs.map((log) => (
            <div key={log.id} className="flex items-center gap-3 p-4">
              <span
                className={`h-2 w-2 rounded-full ${
                  log.status === "success" ? "bg-emerald-400" : log.status === "pending" ? "bg-amber-400 animate-pulse" : "bg-red-400"
                }`}
              />
              <div className="flex-1">
                <p className="text-sm text-zinc-300">{log.action}</p>
                <p className="text-xs text-zinc-500">{log.time}</p>
              </div>
              <button
                type="button"
                onClick={() => showToast(`Log detail: ${log.action}`, "info")}
                className="text-xs text-brand-400 hover:underline"
              >
                Details
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Mapping reference */}
      <div className="rounded-xl border border-white/10 bg-surface-700/50 p-5">
        <h2 className="mb-3 font-semibold">Rating Mapping Reference</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left text-xs text-zinc-500">
                <th className="p-2">CullMate Status</th>
                <th className="p-2">Lightroom</th>
                <th className="p-2">Capture One</th>
              </tr>
            </thead>
            <tbody>
              {[
                { status: "AI Pick (approved)", lr: "★★★★★ + Green label", c1: "5 stars + Green tag" },
                { status: "Flagged for review", lr: "★★★ + Yellow label", c1: "3 stars + Yellow tag" },
                { status: "Rejected", lr: "★ + Red label", c1: "1 star + Red tag" },
                { status: "Duplicate (not best)", lr: "No rating", c1: "Unrated" },
              ].map((row) => (
                <tr key={row.status} className="border-b border-white/5">
                  <td className="p-2 text-zinc-300">{row.status}</td>
                  <td className="p-2 text-zinc-400">{row.lr}</td>
                  <td className="p-2 text-zinc-400">{row.c1}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
