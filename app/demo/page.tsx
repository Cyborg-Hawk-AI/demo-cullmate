"use client";

import Link from "next/link";
import { ToastProvider } from "@/components/Toast";
import DemoApp from "@/components/demo/DemoApp";

export default function DemoPage() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-surface-900">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-surface-900/95 backdrop-blur-xl">
          <div className="flex items-center justify-between px-4 py-3 lg:px-6">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
                  C
                </div>
                <span className="hidden font-display font-bold sm:inline">CullMate</span>
              </Link>
              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-300">
                Interactive Demo
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/developers" className="hidden text-sm text-zinc-400 transition-colors hover:text-white sm:block">
                Dev Docs
              </Link>
              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-surface-700 px-3 py-1.5">
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-brand-400 to-brand-600" />
                <span className="text-sm text-zinc-300">Sarah Mitchell</span>
              </div>
            </div>
          </div>
        </header>
        <DemoApp />
      </div>
    </ToastProvider>
  );
}
