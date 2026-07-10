import Link from "next/link";

const features = [
  {
    name: "Per-Wedding Processing Dashboard",
    location: "/demo → Dashboard tab",
    tryIt: "Click wedding rows, filter by status, sort by date/progress/RAWs, click activity feed items, create a new wedding via '+ New Wedding' modal",
  },
  {
    name: "Automated RAW Ingestion",
    location: "/demo → RAW Ingestion tab",
    tryIt: "Walk through the 3-step wizard: select source (folder/Lightroom/Capture One), simulate upload via drag-drop or button, view file queue",
  },
  {
    name: "Duplicate Grouping",
    location: "/demo → Duplicate Groups tab",
    tryIt: "Expand groups, click shots to change best pick, filter by scene, toggle grid/list view, approve all AI picks",
  },
  {
    name: "AI Best-Shot Selection",
    location: "/demo → AI Scoring tab",
    tryIt: "Adjust threshold slider, filter approved/flagged, approve/reject shots, click rows for detail modal, re-run scoring",
  },
  {
    name: "Client-Ready Gallery Export",
    location: "/demo → Gallery Export tab",
    tryIt: "Filter by category, toggle grid/masonry, click photos for detail, export via modal (ZIP/Pixieset/ShootProof), toggle watermark",
  },
  {
    name: "Lightroom/Capture One Integration",
    location: "/demo → Catalog Sync tab",
    tryIt: "Switch platform, edit catalog path, run individual sync actions, full catalog sync, view sync log",
  },
];

export default function DevelopersPage() {
  return (
    <main className="min-h-screen">
      <nav className="border-b border-white/10 bg-surface-900/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">C</div>
            <span className="font-display font-bold">CullMate</span>
          </Link>
          <Link href="/demo" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500">
            Open Demo
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-12">
          <p className="text-sm font-medium uppercase tracking-wider text-brand-400">Developer Documentation</p>
          <h1 className="mt-2 font-display text-4xl font-bold">Feature Reference</h1>
          <p className="mt-4 max-w-2xl text-zinc-400">
            Every feature in the interactive demo, what it does, where to try it, and how it would work in production.
            All demo controls use hardcoded React state — no backend, no API keys, no environment variables.
          </p>
        </div>

        {/* Architecture overview */}
        <section className="mb-12 rounded-2xl border border-white/10 bg-surface-700/30 p-6">
          <h2 className="font-display text-xl font-bold">Production Architecture (not implemented)</h2>
          <div className="mt-4 grid gap-4 text-sm md:grid-cols-2">
            <div className="rounded-lg border border-white/10 p-4">
              <h3 className="font-semibold text-brand-300">Frontend</h3>
              <p className="mt-2 text-zinc-400">Next.js App Router + React. Real-time job status via WebSocket/SSE. Desktop agent (Electron) for catalog sync.</p>
            </div>
            <div className="rounded-lg border border-white/10 p-4">
              <h3 className="font-semibold text-brand-300">Backend</h3>
              <p className="mt-2 text-zinc-400">Python/FastAPI. Job queue (Celery + Redis). Postgres for weddings, shots, scores. S3 for RAW storage.</p>
            </div>
            <div className="rounded-lg border border-white/10 p-4">
              <h3 className="font-semibold text-brand-300">AI Pipeline</h3>
              <p className="mt-2 text-zinc-400">GPU workers on AWS/Replicate. ONNX models for sharpness, eyes-open, expression. Perceptual hashing for duplicate grouping.</p>
            </div>
            <div className="rounded-lg border border-white/10 p-4">
              <h3 className="font-semibold text-brand-300">Billing & Ops</h3>
              <p className="mt-2 text-zinc-400">Stripe subscriptions ($49/mo). Self-serve onboarding. FAQ bot for support. ~18 hrs/week owner time for model maintenance.</p>
            </div>
          </div>
        </section>

        {/* Feature list */}
        <section className="space-y-6">
          <h2 className="font-display text-2xl font-bold">Demo Features</h2>
          {features.map((feature, i) => (
            <div key={feature.name} className="rounded-xl border border-white/10 bg-surface-700/50 p-6">
              <div className="flex items-start gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-600/20 text-sm font-bold text-brand-400">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <h3 className="font-display text-lg font-semibold">{feature.name}</h3>
                  <p className="mt-1 text-sm text-brand-400">{feature.location}</p>

                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    <div className="rounded-lg bg-surface-800/50 p-3">
                      <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">What it does</p>
                      <p className="mt-1 text-sm text-zinc-300">
                        {feature.name === "Per-Wedding Processing Dashboard" && "Central hub tracking every wedding's pipeline from ingestion through export. Shows stats, activity feed, and per-wedding progress."}
                        {feature.name === "Automated RAW Ingestion" && "Accepts NEF/CR3/ARW files via folder upload or catalog import. Validates format, checksums, and queues for processing."}
                        {feature.name === "Duplicate Grouping" && "Clusters burst sequences and near-duplicates using perceptual hashing. AI picks the best shot from each group."}
                        {feature.name === "AI Best-Shot Selection" && "Scores every frame on sharpness (Laplacian variance), eyes-open (face landmarks), and expression (custom classifier). Composite score determines picks."}
                        {feature.name === "Client-Ready Gallery Export" && "Generates resized JPEGs from RAW picks with optional watermark. Exports as ZIP or pushes to Pixieset/ShootProof."}
                        {feature.name === "Lightroom/Capture One Integration" && "Writes star ratings, color labels, and collections back to .lrcat or .cocatalog files via desktop agent."}
                      </p>
                    </div>
                    <div className="rounded-lg bg-surface-800/50 p-3">
                      <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Try it</p>
                      <p className="mt-1 text-sm text-zinc-300">{feature.tryIt}</p>
                    </div>
                    <div className="rounded-lg bg-surface-800/50 p-3">
                      <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Mocked vs Real</p>
                      <p className="mt-1 text-sm text-zinc-300">
                        <span className="text-amber-400">Mocked:</span> All data is hardcoded in{" "}
                        <code className="rounded bg-surface-600 px-1 text-xs">lib/mock-data.ts</code>.
                        Upload/scoring/sync simulate progress with timers.
                        <br /><br />
                        <span className="text-emerald-400">Real:</span>{" "}
                        {feature.name === "Per-Wedding Processing Dashboard" && "Postgres + WebSocket for live job status. EventBridge activity stream."}
                        {feature.name === "Automated RAW Ingestion" && "S3 multipart upload via presigned URLs. EXIF validation Lambda."}
                        {feature.name === "Duplicate Grouping" && "GPU cluster running pHash + temporal clustering. Results in Postgres."}
                        {feature.name === "AI Best-Shot Selection" && "ONNX models on A10G instances. Scores stored per-frame in scoring_results table."}
                        {feature.name === "Client-Ready Gallery Export" && "Lambda JPEG generation + S3 ZIP. Pixieset/ShootProof API integration."}
                        {feature.name === "Lightroom/Capture One Integration" && "Electron desktop agent writing XMP sidecars and catalog SQLite."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Data flow */}
        <section className="mt-12 rounded-2xl border border-white/10 bg-surface-700/30 p-6">
          <h2 className="font-display text-xl font-bold">Intended Data Flow</h2>
          <pre className="mt-4 overflow-x-auto rounded-lg bg-surface-900 p-4 text-xs leading-relaxed text-zinc-400">
{`1. UPLOAD     Client → presigned S3 URL → RAW files land in s3://cullmate-raws/{wedding_id}/
2. INGEST     S3 event → Lambda validates EXIF → creates job in Redis queue
3. GROUP      GPU worker reads RAWs → pHash clustering → writes duplicate_groups table
4. SCORE      GPU worker runs 3 ONNX models per frame → writes scoring_results table
5. REVIEW     Photographer approves/overrides picks in dashboard → updates picks table
6. EXPORT     Lambda generates JPEGs → S3 gallery bucket → shareable link or Pixieset API
7. SYNC       Desktop agent reads picks → writes ratings to .lrcat / .cocatalog
8. BILLING    Stripe webhook on subscription.created → enables processing for account`}
          </pre>
        </section>

        {/* DEV NOTE badges */}
        <section className="mt-12 rounded-2xl border border-brand-500/20 bg-brand-500/5 p-6">
          <h2 className="font-display text-xl font-bold text-brand-300">DEV NOTE Tooltips</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Throughout the demo, small <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-brand-500/40 bg-brand-500/10 text-[10px] font-bold text-brand-400">i</span> icons
            appear beside major controls. Click them to see production implementation notes for that specific feature.
          </p>
        </section>

        <div className="mt-12 text-center">
          <Link href="/demo" className="inline-block rounded-xl bg-brand-600 px-8 py-3 font-semibold text-white hover:bg-brand-500">
            Launch Interactive Demo →
          </Link>
        </div>
      </div>
    </main>
  );
}
