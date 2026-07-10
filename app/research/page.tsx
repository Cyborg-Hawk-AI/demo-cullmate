import Link from "next/link";
import research from "@/RESEARCH.json";

const checklistItems = [
  { key: "ten_plus_posts_same_pain", label: "10+ posts with this pain" },
  { key: "paying_for_inferior_solution", label: "Paying for inferior solution" },
  { key: "reachable_channel", label: "Reachable channel" },
  { key: "mvp_under_4_weeks", label: "MVP < 4 weeks" },
  { key: "price_point_high_enough", label: "Price point high enough" },
  { key: "hair_on_fire", label: "Hair-on-fire problem" },
  { key: "can_presell", label: "Can pre-sell" },
  { key: "fewer_than_3_competitors", label: "< 3 competitors" },
  { key: "low_maintenance_ops", label: "Low-maintenance ops (mailbox money)" },
] as const;

export default function ResearchPage() {
  const { idea, pain_points } = research;
  const checklist = idea.checklist as Record<string, boolean>;

  return (
    <main className="min-h-screen">
      <nav className="border-b border-white/10 bg-surface-900/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">C</div>
            <span className="font-display font-bold">CullMate</span>
          </Link>
          <Link href="/demo" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500">
            Try Demo
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-12">
          <p className="text-sm font-medium uppercase tracking-wider text-brand-400">Research Report</p>
          <h1 className="mt-2 font-display text-4xl font-bold">How we found this idea</h1>
          <p className="mt-4 text-zinc-400">
            Cluster: {idea.cluster} · Rubric score: {idea.weighted_total}/130 · Validation: {idea.checklist_passed}/9 checks passed
          </p>
        </div>

        {/* Origin story */}
        <section className="mb-12 rounded-2xl border border-white/10 bg-surface-700/30 p-6">
          <h2 className="font-display text-2xl font-bold">Why this exists</h2>
          <p className="mt-4 leading-relaxed text-zinc-300">{idea.origin_story}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-white/10 p-4">
              <p className="text-xs text-zinc-500">Target customer</p>
              <p className="mt-1 text-sm text-zinc-300">{idea.target_customer}</p>
            </div>
            <div className="rounded-lg border border-white/10 p-4">
              <p className="text-xs text-zinc-500">Go-to-market</p>
              <p className="mt-1 text-sm text-zinc-300">{idea.gtm_channel}</p>
            </div>
          </div>
        </section>

        {/* Competitive landscape */}
        <section className="mb-12 rounded-2xl border border-white/10 bg-surface-700/30 p-6">
          <h2 className="font-display text-2xl font-bold">Competitive landscape</h2>
          <p className="mt-4 text-zinc-300">{idea.competitive_landscape}</p>
          <div className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
            <p className="text-sm text-amber-300">
              <strong>Unfair advantage:</strong> {idea.unfair_advantage}
            </p>
          </div>
        </section>

        {/* Automation playbook */}
        <section className="mb-12 rounded-2xl border border-white/10 bg-surface-700/30 p-6">
          <h2 className="font-display text-2xl font-bold">How this business runs itself</h2>
          <p className="mt-2 text-sm text-zinc-500">The &quot;mailbox money&quot; automation plan</p>
          <p className="mt-4 leading-relaxed text-zinc-300">{idea.automation_playbook}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-white/10 p-4 text-center">
              <p className="text-2xl font-bold text-brand-400">~{idea.maintenance_hours_per_week}h</p>
              <p className="text-xs text-zinc-500">Owner time/week at maturity</p>
            </div>
            <div className="rounded-lg border border-white/10 p-4 text-center">
              <p className="text-2xl font-bold text-brand-400">{idea.price_point}</p>
              <p className="text-xs text-zinc-500">Flat subscription pricing</p>
            </div>
            <div className="rounded-lg border border-white/10 p-4 text-center">
              <p className="text-2xl font-bold text-brand-400">8-16+ wks</p>
              <p className="text-xs text-zinc-500">MVP estimate</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-zinc-400">{idea.mvp_estimate}</p>
        </section>

        {/* Validation checklist */}
        <section className="mb-12 rounded-2xl border border-white/10 bg-surface-700/30 p-6">
          <h2 className="font-display text-2xl font-bold">
            Validation checklist ({idea.checklist_passed}/9)
          </h2>
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            {checklistItems.map((item) => (
              <div
                key={item.key}
                className={`flex items-center gap-3 rounded-lg border p-3 ${
                  checklist[item.key]
                    ? "border-emerald-500/20 bg-emerald-500/5"
                    : "border-white/5 bg-surface-800/30"
                }`}
              >
                <span className={checklist[item.key] ? "text-emerald-400" : "text-zinc-600"}>
                  {checklist[item.key] ? "✓" : "✗"}
                </span>
                <span className={`text-sm ${checklist[item.key] ? "text-zinc-200" : "text-zinc-500"}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Source pain points */}
        <section className="mb-12">
          <h2 className="font-display text-2xl font-bold">Source pain points</h2>
          <p className="mt-2 text-sm text-zinc-500">Real posts and articles that surfaced this opportunity</p>
          <div className="mt-6 space-y-4">
            {pain_points.slice(0, 10).map((point, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-surface-700/50 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-zinc-200">{point.title}</h3>
                    {point.snippet && (
                      <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                        {point.snippet.slice(0, 300)}
                        {point.snippet.length > 300 ? "..." : ""}
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 rounded-full bg-surface-600 px-2 py-0.5 text-xs text-zinc-500">
                    {point.source}
                  </span>
                </div>
                <a
                  href={point.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-sm text-brand-400 hover:underline"
                >
                  {point.url}
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* About Idea Miner */}
        <section className="rounded-2xl border border-white/10 bg-surface-700/30 p-6">
          <h2 className="font-display text-2xl font-bold">About this program</h2>
          <p className="mt-4 leading-relaxed text-zinc-300">
            This demo was auto-built by the <strong>Idea Miner</strong> pipeline: a twice-daily research program
            that mines Reddit, Hacker News, Stack Exchange, and GitHub for real people describing real pain,
            scores the opportunities, and automatically ships a working mock of every idea that passes validation
            (&gt;=8/9 checks, momentum not declining, not previously built). The bar for every idea:
            low-maintenance recurring revenue that a solo owner can run in a few hours a week.
          </p>
          <p className="mt-4 text-sm text-zinc-500">
            Generated by Idea Miner run 2026-07-10-pm on 2026-07-10 22:56 UTC
          </p>
        </section>

        <div className="mt-12 text-center">
          <Link href="/demo" className="inline-block rounded-xl bg-brand-600 px-8 py-3 font-semibold text-white hover:bg-brand-500">
            See the Interactive Demo →
          </Link>
        </div>
      </div>
    </main>
  );
}
