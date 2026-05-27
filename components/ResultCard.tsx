import type { Decision, DeliveryScoreResult } from "@/types/delivery";

interface Props {
  result: DeliveryScoreResult;
}

const DECISION_STYLES: Record<Decision, string> = {
  go: "bg-emerald-500 text-white dark:bg-emerald-600",
  maybe: "bg-amber-400 text-amber-950 dark:bg-amber-500 dark:text-amber-950",
  skip: "bg-rose-500 text-white dark:bg-rose-600",
};

export default function ResultCard({ result }: Props) {
  return (
    <section
      className={`rounded-3xl px-5 py-6 shadow-md ${DECISION_STYLES[result.decision]}`}
    >
      <p className="text-sm font-bold uppercase tracking-wider opacity-90">
        判定結果
      </p>
      <p className="mt-1 text-4xl font-black leading-tight">
        {result.decisionLabel}
      </p>
      <div className="mt-4 grid grid-cols-3 gap-2 text-sm font-bold">
        <Stat label="スコア" value={`${result.score}/100`} />
        <Stat
          label="時給換算"
          value={result.hourlyRate > 0 ? `¥${result.hourlyRate}/h` : "-"}
        />
        <Stat
          label="¥/km"
          value={result.yenPerKm > 0 ? `¥${result.yenPerKm}` : "-"}
        />
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-black/15 px-3 py-2 text-center">
      <div className="text-xs opacity-90">{label}</div>
      <div className="text-lg font-black">{value}</div>
    </div>
  );
}
