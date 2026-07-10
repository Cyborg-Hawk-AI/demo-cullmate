"use client";

import { useState } from "react";
import { WEDDINGS, GALLERY_PHOTOS } from "@/lib/mock-data";
import DevNote from "@/components/DevNote";
import { useToast } from "@/components/Toast";

type Props = {
  selectedWeddingId: string;
  onSelectWedding: (id: string) => void;
};

export default function GalleryView({ selectedWeddingId, onSelectWedding }: Props) {
  const { showToast } = useToast();
  const [photos, setPhotos] = useState(GALLERY_PHOTOS);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [layout, setLayout] = useState<"grid" | "masonry">("grid");
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<"zip" | "pixieset" | "shootproof">("zip");
  const [watermark, setWatermark] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const wedding = WEDDINGS.find((w) => w.id === selectedWeddingId);
  const categories = Array.from(new Set(photos.map((p) => p.category)));
  const filtered = categoryFilter === "all" ? photos : photos.filter((p) => p.category === categoryFilter);

  function toggleExport(id: string) {
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, exported: !p.exported } : p)));
    showToast("Photo export selection updated", "info");
  }

  function handleExport() {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      setShowExportModal(false);
      setPhotos((prev) => prev.map((p) => ({ ...p, exported: true })));
      showToast(`Gallery exported: 412 images, 3.2 GB ${exportFormat.toUpperCase()}`, "success");
    }, 2000);
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Client Gallery Export</h1>
          <p className="text-sm text-zinc-400">{wedding?.couple} · {photos.length} selected images</p>
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
          <button
            type="button"
            onClick={() => setShowExportModal(true)}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500"
          >
            Export Gallery
          </button>
          <DevNote note="Production: Lambda generates resized JPEGs from RAW picks, applies watermark template, uploads to S3, creates shareable link. Integrations via Pixieset/ShootProof APIs." />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-white/10 bg-surface-700 px-3 py-1.5 text-sm"
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <div className="flex rounded-lg border border-white/10">
          <button type="button" onClick={() => setLayout("grid")} className={`px-3 py-1.5 text-xs ${layout === "grid" ? "bg-brand-600/20 text-brand-300" : "text-zinc-400"}`}>Grid</button>
          <button type="button" onClick={() => setLayout("masonry")} className={`px-3 py-1.5 text-xs ${layout === "masonry" ? "bg-brand-600/20 text-brand-300" : "text-zinc-400"}`}>Masonry</button>
        </div>
        <button
          type="button"
          onClick={() => {
            setPhotos((prev) => prev.map((p) => ({ ...p, exported: true })));
            showToast("All photos marked for export", "success");
          }}
          className="rounded-lg border border-white/10 px-3 py-1.5 text-xs hover:bg-white/5"
        >
          Select All
        </button>
      </div>

      {/* Gallery preview stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Total Picks", value: photos.length },
          { label: "Exported", value: photos.filter((p) => p.exported).length },
          { label: "Categories", value: categories.length },
          { label: "Est. Size", value: "3.2 GB" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-white/10 bg-surface-700/50 p-3 text-center">
            <p className="text-xs text-zinc-500">{s.label}</p>
            <p className="text-xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Photo grid */}
      <div className={layout === "grid" ? "grid gap-3 sm:grid-cols-3 lg:grid-cols-5" : "columns-2 gap-3 sm:columns-3 lg:columns-5"}>
        {filtered.map((photo) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => setSelectedPhoto(photo.id)}
            className={`group relative overflow-hidden rounded-lg border transition-all ${
              photo.exported ? "border-emerald-500/30" : "border-white/10 hover:border-brand-500/30"
            }`}
          >
            <div className={`flex items-center justify-center bg-surface-600 text-3xl ${layout === "masonry" ? "aspect-auto py-8" : "aspect-[3/2]"}`}>
              📷
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
              <p className="font-mono text-[10px] text-zinc-300">{photo.filename}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-400">{photo.category}</span>
                <span className="text-[10px] font-bold text-brand-400">{photo.score}</span>
              </div>
            </div>
            {photo.exported && (
              <div className="absolute right-1 top-1 rounded-full bg-emerald-500 px-1.5 py-0.5 text-[10px] text-white">✓</div>
            )}
          </button>
        ))}
      </div>

      {/* Photo detail */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-2xl animate-slide-up rounded-xl border border-white/10 bg-surface-700 p-6">
            {(() => {
              const photo = photos.find((p) => p.id === selectedPhoto);
              if (!photo) return null;
              return (
                <>
                  <div className="flex aspect-video items-center justify-center rounded-lg bg-surface-600 text-8xl">📷</div>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="font-mono font-bold">{photo.filename}</p>
                      <p className="text-sm text-zinc-400">{photo.category} · Score {photo.score}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleExport(photo.id)}
                      className={`rounded-lg px-4 py-2 text-sm ${
                        photo.exported ? "border border-emerald-500/30 text-emerald-400" : "bg-brand-600 text-white"
                      }`}
                    >
                      {photo.exported ? "Remove from Export" : "Add to Export"}
                    </button>
                  </div>
                  <button type="button" onClick={() => setSelectedPhoto(null)} className="mt-4 text-sm text-zinc-400 hover:text-white">Close</button>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Export modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md animate-slide-up rounded-xl border border-white/10 bg-surface-700 p-6">
            <h3 className="font-display text-lg font-bold">Export Client Gallery</h3>
            <p className="mt-1 text-sm text-zinc-400">Emma & James Chen · 412 images</p>

            <div className="mt-4 space-y-3">
              <p className="text-xs font-medium text-zinc-500">Export destination</p>
              {([
                { id: "zip" as const, label: "ZIP Download", desc: "Full-res JPEGs + web previews" },
                { id: "pixieset" as const, label: "Pixieset", desc: "Direct gallery upload via API" },
                { id: "shootproof" as const, label: "ShootProof", desc: "Client proofing gallery" },
              ]).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setExportFormat(opt.id)}
                  className={`block w-full rounded-lg border p-3 text-left ${
                    exportFormat === opt.id ? "border-brand-500/50 bg-brand-500/10" : "border-white/10"
                  }`}
                >
                  <p className="text-sm font-medium">{opt.label}</p>
                  <p className="text-xs text-zinc-500">{opt.desc}</p>
                </button>
              ))}

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={watermark}
                  onChange={(e) => setWatermark(e.target.checked)}
                  className="accent-brand-500"
                />
                Apply studio watermark
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setShowExportModal(false)} className="rounded-lg px-4 py-2 text-sm text-zinc-400">Cancel</button>
              <button
                type="button"
                onClick={handleExport}
                disabled={exporting}
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                {exporting ? "Exporting..." : "Start Export"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
