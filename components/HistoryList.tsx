"use client";

import type { Decision, DeliveryRecord } from "@/types/delivery";
import { TIME_OF_DAY_LABELS } from "@/types/delivery";

interface Props {
  records: DeliveryRecord[];
  onDelete?: (id: string) => void;
}

const BADGE: Record<Decision, string> = {
  go: "bg-emerald-600 text-white",
  maybe: "bg-amber-400 text-amber-950",
  skip: "bg-rose-600 text-white",
};

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return iso;
  }
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export default function HistoryList({ records, onDelete }: Props) {
  if (records.length === 0) {
    return (
      <p className="rounded-2xl border-2 border-dashed border-slate-300 p-6 text-center text-slate-600 dark:border-slate-700 dark:text-slate-400">
        まだ判定履歴はありません。
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {records.map((r) => (
        <li
          key={r.id}
          className="rounded-2xl border-2 border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-800"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-slate-600 dark:text-slate-400">
              {formatDate(r.createdAt)}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-black ${BADGE[r.decision]}`}
            >
              {r.decisionLabel}
            </span>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
            <Cell label="報酬" value={`¥${r.rewardYen}`} />
            <Cell label="予想" value={`${r.estimatedMinutes}分`} />
            <Cell label="距離" value={`${r.distanceKm}km`} />
          </div>
          <div className="mt-2 text-sm">
            <span className="font-bold">店舗：</span>
            {r.pickupName || "-"}
          </div>
          <div className="text-sm">
            <span className="font-bold">配達先：</span>
            {r.dropoffArea || "-"}
          </div>
          <div className="text-sm">
            <span className="font-bold">時間帯：</span>
            {TIME_OF_DAY_LABELS[r.timeOfDay]}
            {r.isRain ? " / 雨" : ""}
          </div>
          <div className="mt-2 rounded-lg bg-slate-100 px-3 py-2 text-sm dark:bg-slate-700">
            <div>
              <span className="font-bold">受けた？：</span>
              {r.accepted === undefined
                ? "未記録"
                : r.accepted
                  ? "受けた"
                  : "受けなかった"}
            </div>
            <div>
              <span className="font-bold">実際の時間：</span>
              {r.actualMinutes !== undefined ? `${r.actualMinutes}分` : "未記録"}
            </div>
            {r.actualMemo && (
              <div>
                <span className="font-bold">実績メモ：</span>
                {r.actualMemo}
              </div>
            )}
          </div>
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(r.id)}
              className="mt-3 text-sm font-bold text-rose-700 underline dark:text-rose-400"
            >
              この履歴を削除
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-100 px-2 py-1 text-center dark:bg-slate-700">
      <div className="text-xs opacity-70">{label}</div>
      <div className="font-bold">{value}</div>
    </div>
  );
}
