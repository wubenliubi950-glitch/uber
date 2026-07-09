import type { Feedback } from "@/types/chat";

const ROWS: {
  key: keyof Feedback;
  label: string;
  className: string;
}[] = [
  { key: "good", label: "🟢 Good", className: "text-emerald-700 dark:text-emerald-400" },
  { key: "fix", label: "🔧 Fix", className: "text-rose-700 dark:text-rose-400" },
  { key: "natural", label: "💬 Natural", className: "text-sky-700 dark:text-sky-400" },
  { key: "next", label: "❓ Next", className: "text-violet-700 dark:text-violet-400" },
];

export default function FeedbackCard({ feedback }: { feedback: Feedback }) {
  const rows = ROWS.filter((r) => feedback[r.key]);
  if (rows.length === 0) return null;

  return (
    <div className="mt-2 space-y-1.5 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-700 dark:bg-slate-800/60">
      {rows.map((r) => (
        <div key={r.key} className="leading-snug">
          <span className={`font-bold ${r.className}`}>{r.label}</span>
          <span className="mx-1 text-slate-400">·</span>
          <span className="text-slate-800 dark:text-slate-100">
            {feedback[r.key]}
          </span>
        </div>
      ))}
    </div>
  );
}
