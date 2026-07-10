import Link from "next/link";

const features = [
  {
    title: "RAW Ingestion & Duplicate Grouping",
    description:
      "Drop 4,000+ NEF/CR3 files. CullMate clusters burst sequences and near-duplicates in minutes, not hours.",
    icon: "📥",
  },
  {
    title: "AI Best-Shot Selection",
    description:
      "Sharpness, eyes-open detection, and expression scoring pick the keeper from every burst automatically.",
    icon: "✨",
  },
  {
    title: "Client-Ready Gallery Export",
    description:
      "One click exports a branded gallery ZIP with watermarked proofs and full-res selects ready to deliver.",
    icon: "🖼️",
  },
  {
    title: "Lightroom & Capture One Sync",
    description:
      "Picks, ratings, and color labels write back to your .lrcat or .cocatalog — no re-importing.",
    icon: "🔗",
  },
  {
    title: "Per-Wedding Dashboard",
    description:
      "Track every wedding's pipeline: ingestion → grouping → scoring → export. Know exactly where you stand.",
    icon: "📊",
  },
  {
    title: "Unlimited Processing",
    description:
      "Flat $49/month. No per-image fees. Shoot 50 weddings a year without watching the meter.",
    icon: "♾️",
  },
];

export default function HomePage() {
  return (
    <main>
      {/* Nav */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-surface-900/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white">
              C
            </div>
            <span className="font-display text-lg font-bold">CullMate</span>
          </Link>
          <div className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">
            <a href="#features" className="transition-colors hover:text-white">Features</a>
            <a href="#pricing" className="transition-colors hover:text-white">Pricing</a>
            <Link href="/research" className="transition-colors hover:text-white">Research</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/demo"
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-500"
            >
              Try Demo
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-brand-600/10 blur-3xl" />
          <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-purple-600/5 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-brand-400" />
            Built for wedding photographers shooting 20–50 weddings/year
          </div>
          <h1 className="font-display text-5xl font-bold leading-tight tracking-tight md:text-7xl">
            Cull 4,000 RAWs in{" "}
            <span className="gradient-text">22 minutes</span>
            <br />
            instead of 6 hours
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
            CullMate uses AI to ingest wedding RAW files, group duplicates, score every frame for
            sharpness and expression, and export a client-ready gallery — automatically.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/demo"
              className="rounded-xl bg-brand-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-600/25 transition-all hover:bg-brand-500 hover:shadow-brand-500/30"
            >
              Launch Interactive Demo
            </Link>
            <Link
              href="/developers"
              className="rounded-xl border border-white/10 px-8 py-3.5 text-base font-semibold text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
            >
              Developer Docs
            </Link>
          </div>
          <div className="mt-16 grid grid-cols-3 gap-8 border-t border-white/5 pt-12">
            {[
              { value: "3,847", label: "RAWs per wedding avg" },
              { value: "22 min", label: "AI cull time" },
              { value: "6 hrs", label: "saved per wedding" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-3xl font-bold text-white md:text-4xl">{stat.value}</p>
                <p className="mt-1 text-sm text-zinc-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-white/5 bg-surface-800/30 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold md:text-4xl">Everything you need after the shoot</h2>
            <p className="mt-4 text-zinc-400">From SD card to client gallery — fully automated pipeline.</p>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="card-hover rounded-2xl border border-white/10 bg-surface-700/50 p-6"
              >
                <span className="text-3xl">{feature.icon}</span>
                <h3 className="mt-4 font-display text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center font-display text-3xl font-bold md:text-4xl">How it works</h2>
          <div className="mt-16 grid gap-8 md:grid-cols-4">
            {[
              { step: "01", title: "Upload RAWs", desc: "Drag your NEF/CR3 folder or sync from Lightroom" },
              { step: "02", title: "AI Groups & Scores", desc: "Duplicates clustered, every frame scored on 3 axes" },
              { step: "03", title: "Review Picks", desc: "Approve AI selections or override in the dashboard" },
              { step: "04", title: "Export Gallery", desc: "Client-ready ZIP + catalog sync in one click" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-brand-500/30 bg-brand-500/10 font-display text-sm font-bold text-brand-400">
                  {item.step}
                </div>
                <h3 className="mt-4 font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-zinc-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-white/5 bg-surface-800/30 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold md:text-4xl">Simple, unlimited pricing</h2>
            <p className="mt-4 text-zinc-400">No per-image fees. No surprise bills after a 5,000-frame wedding.</p>
          </div>
          <div className="mx-auto mt-12 max-w-md">
            <div className="rounded-2xl border border-brand-500/30 bg-gradient-to-b from-brand-500/10 to-transparent p-8 text-center">
              <p className="text-sm font-medium uppercase tracking-wider text-brand-400">Pro Plan</p>
              <div className="mt-4 flex items-baseline justify-center gap-1">
                <span className="font-display text-5xl font-bold">$49</span>
                <span className="text-zinc-400">/month</span>
              </div>
              <ul className="mt-8 space-y-3 text-left text-sm text-zinc-300">
                {[
                  "Unlimited RAW processing",
                  "AI duplicate grouping",
                  "Best-shot scoring (sharpness, eyes, expression)",
                  "Client gallery export",
                  "Lightroom & Capture One sync",
                  "Per-wedding dashboard",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <svg className="h-4 w-4 shrink-0 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/demo"
                className="mt-8 block w-full rounded-xl bg-brand-600 py-3 text-center font-semibold text-white transition-colors hover:bg-brand-500"
              >
                Try the Demo First
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Stop stabbing your eyes out over culling
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            See the full interactive demo with realistic wedding data, AI scoring, and gallery export.
          </p>
          <Link
            href="/demo"
            className="mt-8 inline-block rounded-xl bg-brand-600 px-10 py-4 text-lg font-semibold text-white shadow-lg shadow-brand-600/25 transition-all hover:bg-brand-500"
          >
            Open Interactive Demo →
          </Link>
        </div>
      </section>
    </main>
  );
}
