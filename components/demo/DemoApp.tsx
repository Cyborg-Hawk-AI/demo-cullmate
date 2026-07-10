"use client";

import { useState } from "react";
import DashboardView from "./DashboardView";
import IngestionView from "./IngestionView";
import DuplicatesView from "./DuplicatesView";
import ScoringView from "./ScoringView";
import GalleryView from "./GalleryView";
import CatalogView from "./CatalogView";
import DevNote from "@/components/DevNote";

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "ingest", label: "RAW Ingestion", icon: "📥" },
  { id: "duplicates", label: "Duplicate Groups", icon: "🔀" },
  { id: "scoring", label: "AI Scoring", icon: "✨" },
  { id: "gallery", label: "Gallery Export", icon: "🖼️" },
  { id: "catalog", label: "Catalog Sync", icon: "🔗" },
] as const;

export type TabId = (typeof TABS)[number]["id"];

export default function DemoApp() {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [selectedWeddingId, setSelectedWeddingId] = useState("w-001");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-[calc(100vh-57px)]">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-16"} shrink-0 border-r border-white/10 bg-surface-800/50 transition-all duration-300`}
      >
        <div className="flex items-center justify-between border-b border-white/5 p-3">
          {sidebarOpen && (
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">Workflow</span>
          )}
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded p-1 text-zinc-400 hover:bg-white/5 hover:text-white"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>
        <nav className="space-y-1 p-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                activeTab === tab.id
                  ? "bg-brand-600/20 text-brand-300"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              {sidebarOpen && <span>{tab.label}</span>}
            </button>
          ))}
        </nav>
        {sidebarOpen && (
          <div className="mt-4 border-t border-white/5 p-3">
            <div className="flex items-center gap-1">
              <p className="text-xs text-zinc-500">Click any (i) icon for production notes</p>
              <DevNote note="DEV NOTE badges explain how each control would work in a real deployment with GPU queues, S3 storage, and Stripe billing." />
            </div>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-6">
        {activeTab === "dashboard" && (
          <DashboardView
            selectedWeddingId={selectedWeddingId}
            onSelectWedding={setSelectedWeddingId}
            onNavigate={setActiveTab}
          />
        )}
        {activeTab === "ingest" && (
          <IngestionView
            selectedWeddingId={selectedWeddingId}
            onSelectWedding={setSelectedWeddingId}
          />
        )}
        {activeTab === "duplicates" && (
          <DuplicatesView
            selectedWeddingId={selectedWeddingId}
            onSelectWedding={setSelectedWeddingId}
          />
        )}
        {activeTab === "scoring" && (
          <ScoringView
            selectedWeddingId={selectedWeddingId}
            onSelectWedding={setSelectedWeddingId}
          />
        )}
        {activeTab === "gallery" && (
          <GalleryView
            selectedWeddingId={selectedWeddingId}
            onSelectWedding={setSelectedWeddingId}
          />
        )}
        {activeTab === "catalog" && (
          <CatalogView
            selectedWeddingId={selectedWeddingId}
            onSelectWedding={setSelectedWeddingId}
          />
        )}
      </main>
    </div>
  );
}
