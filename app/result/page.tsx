"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ResultCard from "@/components/ResultCard";
import ScoreReasonList from "@/components/ScoreReasonList";
import MapLinks from "@/components/MapLinks";
import SafetyNotice from "@/components/SafetyNotice";
import {
  saveDeliveryRecord,
  updateDeliveryRecord,
} from "@/lib/storage";
import type {
  DeliveryInput,
  DeliveryRecord,
  DeliveryScoreResult,
} from "@/types/delivery";

const PENDING_KEY = "uber-eats-judge:pending-result";

interface PendingPayload {
  input: DeliveryInput;
  result: DeliveryScoreResult;
}

export default function ResultPage() {
  const [pending, setPending] = useState<PendingPayload | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [accepted, setAccepted] = useState<"yes" | "no" | "">("");
  const [actualMinutes, setActualMinutes] = useState<string>("");
  const [actualMemo, setActualMemo] = useState<string>("");
  const [actualSaved, setActualSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(PENDING_KEY);
      if (raw) setPending(JSON.parse(raw) as PendingPayload);
    } catch {
      // ignore
    }
  }, []);

  if (!pending) {
    return (
      <div className="space-y-4">
        <p className="rounded-2xl border-2 border-dashed border-slate-300 p-6 text-center text-slate-600 dark:border-slate-700 dark:text-slate-400">
          判定結果が見つかりませんでした。もう一度入力してください。
        </p>
        <Link
          href="/analyze"
          className="block rounded-2xl bg-emerald-600 px-6 py-4 text-center text-lg font-bold text-white dark:bg-emerald-500"
        >
          入力画面へ戻る
        </Link>
      </div>
    );
  }

  function handleSave() {
    if (!pending) return;
    if (savedId) return;
    const rec = saveDeliveryRecord({
      ...pending.input,
      ...pending.result,
    } as Omit<DeliveryRecord, "id" | "createdAt">);
    setSavedId(rec.id);
  }

  function handleActualSave() {
    if (!savedId) return;
    const patch: Partial<DeliveryRecord> = {};
    if (accepted) patch.accepted = accepted === "yes";
    if (actualMinutes) patch.actualMinutes = Number(actualMinutes) || undefined;
    if (actualMemo) patch.actualMemo = actualMemo;
    updateDeliveryRecord(savedId, patch);
    setActualSaved(true);
  }

  return (
    <div className="space-y-4">
      <ResultCard result={pending.result} />
      <SafetyNotice compact />
      <ScoreReasonList
        reasons={pending.result.reasons}
        cautions={pending.result.cautions}
      />
      <MapLinks
        pickupName={pending.input.pickupName}
        dropoffArea={pending.input.dropoffArea}
      />

      <section className="rounded-2xl border-2 border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-800">
        <h2 className="text-lg font-black">実績を記録する</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          先に「この案件を保存」してから記録してください。
        </p>
        <div className="mt-3 space-y-3">
          <div>
            <span className="block text-sm font-bold">受けましたか？</span>
            <div className="mt-1 flex gap-2">
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="radio"
                  name="accepted"
                  checked={accepted === "yes"}
                  onChange={() => setAccepted("yes")}
                />
                受けた
              </label>
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="radio"
                  name="accepted"
                  checked={accepted === "no"}
                  onChange={() => setAccepted("no")}
                />
                受けなかった
              </label>
            </div>
          </div>
          <label className="block text-sm font-bold">
            実際にかかった時間（分）
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={actualMinutes}
              onChange={(e) => setActualMinutes(e.target.value)}
              className="mt-1 w-full rounded-xl border-2 border-slate-300 px-3 py-2 dark:border-slate-700"
            />
          </label>
          <label className="block text-sm font-bold">
            実績メモ
            <textarea
              value={actualMemo}
              onChange={(e) => setActualMemo(e.target.value)}
              className="mt-1 min-h-[72px] w-full rounded-xl border-2 border-slate-300 px-3 py-2 dark:border-slate-700"
            />
          </label>
          <button
            type="button"
            disabled={!savedId}
            onClick={handleActualSave}
            className="w-full rounded-xl bg-slate-700 px-4 py-3 text-base font-bold text-white disabled:bg-slate-400 dark:bg-slate-200 dark:text-slate-900 dark:disabled:bg-slate-600"
          >
            実績を保存
          </button>
          {actualSaved && (
            <p className="text-sm text-emerald-700 dark:text-emerald-400">
              実績を保存しました。
            </p>
          )}
        </div>
      </section>

      <div className="sticky bottom-0 -mx-4 grid grid-cols-2 gap-2 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
        <button
          type="button"
          onClick={handleSave}
          disabled={!!savedId}
          className="flex min-h-[56px] items-center justify-center rounded-2xl bg-emerald-600 px-4 text-base font-bold text-white shadow active:scale-[0.98] disabled:bg-slate-400 dark:bg-emerald-500 dark:disabled:bg-slate-600"
        >
          {savedId ? "保存済み" : "この案件を保存"}
        </button>
        <Link
          href="/analyze"
          className="flex min-h-[56px] items-center justify-center rounded-2xl border-2 border-slate-300 bg-white px-4 text-base font-bold dark:border-slate-700 dark:bg-slate-800"
        >
          もう一件 判定
        </Link>
      </div>
    </div>
  );
}
