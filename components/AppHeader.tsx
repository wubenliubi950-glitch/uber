export default function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
      <div className="mx-auto flex max-w-xl items-center gap-2 px-4 py-3">
        <span className="text-lg font-black tracking-tight text-emerald-700 dark:text-emerald-400">
          英会話チューター
        </span>
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
          AI English Tutor
        </span>
      </div>
    </header>
  );
}
