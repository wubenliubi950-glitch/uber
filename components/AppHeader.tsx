import Link from "next/link";

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
      <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="text-lg font-black tracking-tight text-emerald-700 dark:text-emerald-400"
        >
          配達判定
        </Link>
        <nav className="flex gap-3 text-sm font-bold">
          <Link
            href="/history"
            className="text-slate-700 hover:text-emerald-700 dark:text-slate-200 dark:hover:text-emerald-400"
          >
            履歴
          </Link>
          <Link
            href="/settings"
            className="text-slate-700 hover:text-emerald-700 dark:text-slate-200 dark:hover:text-emerald-400"
          >
            設定
          </Link>
        </nav>
      </div>
    </header>
  );
}
