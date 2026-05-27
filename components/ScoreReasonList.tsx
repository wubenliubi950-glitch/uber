interface Props {
  reasons: string[];
  cautions?: string[];
}

export default function ScoreReasonList({ reasons, cautions }: Props) {
  return (
    <div className="space-y-4">
      <section className="rounded-2xl border-2 border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-800">
        <h2 className="text-lg font-black">判定理由</h2>
        {reasons.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            判定理由はありません。
          </p>
        ) : (
          <ul className="mt-2 list-disc space-y-1 pl-5 text-base">
            {reasons.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        )}
      </section>
      {cautions && cautions.length > 0 && (
        <section className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-950">
          <h2 className="text-lg font-black">注意点</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-base">
            {cautions.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
