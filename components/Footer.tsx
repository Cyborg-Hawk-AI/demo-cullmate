import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-surface-800/50">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
            C
          </div>
          <span className="font-display text-sm font-semibold text-zinc-300">CullMate</span>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-400">
          <Link href="/demo" className="transition-colors hover:text-brand-400">
            Demo
          </Link>
          <Link href="/developers" className="transition-colors hover:text-brand-400">
            Developers
          </Link>
          <Link href="/research" className="transition-colors hover:text-brand-400">
            How we found this idea
          </Link>
        </nav>
        <p className="text-xs text-zinc-500">© 2026 CullMate · Mock demo by Idea Miner</p>
      </div>
    </footer>
  );
}
