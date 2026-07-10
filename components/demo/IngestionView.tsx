"use client";

import { useState } from "react";
import { WEDDINGS } from "@/lib/mock-data";
import DevNote from "@/components/DevNote";
import { useToast } from "@/components/Toast";

type Props = {
  selectedWeddingId: string;
  onSelectWedding: (id: string) => void;
};

const MOCK_FILES = [
  { name: "DSC_4801.NEF", size: "24.3 MB", status: "uploaded" },
  { name: "DSC_4802.NEF", size: "24.1 MB", status: "uploaded" },
  { name: "DSC_4803.NEF", size: "24.5 MB", status: "uploaded" },
  { name: "DSC_4804.NEF", size: "24.2 MB", status: "processing" },
  { name: "DSC_4805.NEF", size: "24.4 MB", status: "queued" },
  { name: "DSC_4806.NEF", size: "24.0 MB", status: "queued" },
  { name: "IMG_2201.CR3", size: "31.2 MB", status: "uploaded" },
  { name: "IMG_2202.CR3", size: "31.5 MB", status: "uploaded" },
];

export default function IngestionView({ selectedWeddingId, onSelectWedding }: Props) {
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [uploadProgress, setUploadProgress] = useState(78);
  const [dragOver, setDragOver] = useState(false);
  const [source, setSource] = useState<"folder" | "lightroom" | "capture-one">("folder");
  const [ingesting, setIngesting] = useState(false);

  const wedding = WEDDINGS.find((w) => w.id === selectedWeddingId);

  function simulateUpload() {
    setIngesting(true);
    setStep(2);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 8;
      setUploadProgress(Math.min(progress, 100));
      if (progress >= 100) {
        clearInterval(interval);
        setIngesting(false);
        setStep(3);
        showToast("2,913 RAW files ingested successfully", "success");
      }
    }, 200);
  }

  function handleDrop() {
    setDragOver(false);
    simulateUpload();
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">RAW Ingestion</h1>
          <p className="text-sm text-zinc-400">Upload and validate wedding RAW files</p>
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
          <DevNote note="Production: Multipart upload to S3 via presigned URLs. EXIF validation, duplicate filename detection, and RAW format verification (NEF, CR3, ARW) on ingest." />
        </div>
      </div>

      {/* Wizard steps */}
      <div className="flex items-center gap-2">
        {["Select Source", "Upload RAWs", "Validate & Queue"].map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => setStep(i + 1)}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors ${
              step === i + 1 ? "bg-brand-600/20 text-brand-300" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
              step > i + 1 ? "bg-brand-600 text-white" : step === i + 1 ? "border border-brand-500 text-brand-400" : "border border-zinc-600 text-zinc-500"
            }`}>
              {step > i + 1 ? "✓" : i + 1}
            </span>
            {label}
          </button>
        ))}
      </div>

      {step === 1 && (
        <div className="rounded-xl border border-white/10 bg-surface-700/50 p-6">
          <h2 className="font-semibold">Choose ingestion source</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {([
              { id: "folder" as const, label: "Local Folder", desc: "Drag & drop NEF/CR3 folder", icon: "📁" },
              { id: "lightroom" as const, label: "Lightroom Catalog", desc: "Import from .lrcat", icon: "🎨" },
              { id: "capture-one" as const, label: "Capture One", desc: "Import from .cocatalog", icon: "📷" },
            ]).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSource(opt.id)}
                className={`rounded-xl border p-4 text-left transition-all ${
                  source === opt.id ? "border-brand-500/50 bg-brand-500/10" : "border-white/10 hover:border-white/20"
                }`}
              >
                <span className="text-2xl">{opt.icon}</span>
                <p className="mt-2 font-medium">{opt.label}</p>
                <p className="text-xs text-zinc-500">{opt.desc}</p>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setStep(2)}
            className="mt-6 rounded-lg bg-brand-600 px-6 py-2 text-sm font-medium text-white hover:bg-brand-500"
          >
            Continue →
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); handleDrop(); }}
            className={`rounded-xl border-2 border-dashed p-12 text-center transition-colors ${
              dragOver ? "border-brand-500 bg-brand-500/10" : "border-white/20 bg-surface-700/50"
            }`}
          >
            <p className="text-4xl">📥</p>
            <p className="mt-4 font-medium">Drop RAW files here for {wedding?.couple}</p>
            <p className="mt-1 text-sm text-zinc-500">NEF, CR3, ARW · Max 10,000 files per wedding</p>
            <button
              type="button"
              onClick={simulateUpload}
              disabled={ingesting}
              className="mt-6 rounded-lg bg-brand-600 px-6 py-2 text-sm font-medium text-white hover:bg-brand-500 disabled:opacity-50"
            >
              {ingesting ? "Uploading..." : "Simulate Upload"}
            </button>
            <DevNote note="Production: tus.io resumable uploads to S3. Client-side checksum verification. Progress via XHR upload events." className="ml-2" />
          </div>

          {ingesting && (
            <div className="rounded-xl border border-white/10 bg-surface-700/50 p-4">
              <div className="flex items-center justify-between text-sm">
                <span>Uploading {wedding?.rawCount.toLocaleString()} files...</span>
                <span className="text-brand-400">{uploadProgress}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-600">
                <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          )}

          <div className="rounded-xl border border-white/10 bg-surface-700/50">
            <div className="border-b border-white/5 p-3">
              <h3 className="text-sm font-medium">File Queue</h3>
            </div>
            <div className="max-h-48 overflow-y-auto">
              {MOCK_FILES.map((f) => (
                <div key={f.name} className="flex items-center justify-between border-b border-white/5 px-4 py-2 text-sm">
                  <span className="font-mono text-zinc-300">{f.name}</span>
                  <span className="text-zinc-500">{f.size}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${
                    f.status === "uploaded" ? "bg-emerald-500/10 text-emerald-400" :
                    f.status === "processing" ? "bg-blue-500/10 text-blue-400" :
                    "bg-zinc-500/10 text-zinc-400"
                  }`}>
                    {f.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-6">
          <h2 className="font-semibold text-emerald-300">✓ Ingestion Complete</h2>
          <p className="mt-2 text-sm text-zinc-400">
            {wedding?.rawCount.toLocaleString()} RAW files validated and queued for duplicate grouping.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-surface-800/50 p-3">
              <p className="text-xs text-zinc-500">Valid RAWs</p>
              <p className="text-xl font-bold text-emerald-400">{wedding?.rawCount.toLocaleString()}</p>
            </div>
            <div className="rounded-lg bg-surface-800/50 p-3">
              <p className="text-xs text-zinc-500">Corrupt / Skipped</p>
              <p className="text-xl font-bold">3</p>
            </div>
            <div className="rounded-lg bg-surface-800/50 p-3">
              <p className="text-xs text-zinc-500">Total Size</p>
              <p className="text-xl font-bold">89.4 GB</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => showToast("GPU duplicate grouping job queued", "info")}
            className="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500"
          >
            Start Duplicate Grouping →
          </button>
        </div>
      )}
    </div>
  );
}
