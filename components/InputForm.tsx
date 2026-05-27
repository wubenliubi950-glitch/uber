"use client";

import { useState } from "react";
import type { DeliveryInput, TimeOfDay } from "@/types/delivery";
import { TIME_OF_DAY_LABELS } from "@/types/delivery";
import { parseDeliveryText, runOcrFromImage } from "@/lib/ocr";

interface Props {
  initialValues?: Partial<DeliveryInput>;
  onSubmit: (input: DeliveryInput) => void;
}

const TIME_OPTIONS: TimeOfDay[] = [
  "morning",
  "lunch",
  "afternoon",
  "dinner",
  "night",
];

const EMPTY: DeliveryInput = {
  rewardYen: 0,
  estimatedMinutes: 0,
  distanceKm: 0,
  pickupName: "",
  dropoffArea: "",
  currentArea: "",
  timeOfDay: "lunch",
  isRain: false,
  memo: "",
};

export default function InputForm({ initialValues, onSubmit }: Props) {
  const [values, setValues] = useState<DeliveryInput>({
    ...EMPTY,
    ...initialValues,
  });
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrMessage, setOcrMessage] = useState<string | null>(null);

  function update<K extends keyof DeliveryInput>(
    key: K,
    val: DeliveryInput[K],
  ) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setOcrLoading(true);
    setOcrMessage("画像を解析しています...");
    const result = await runOcrFromImage(file);
    setOcrLoading(false);
    if (result.error || !result.text) {
      setOcrMessage(result.error ?? "読み取れませんでした。手入力してください");
      return;
    }
    const parsed = parseDeliveryText(result.text);
    const filledKeys: string[] = [];
    setValues((v) => {
      const next = { ...v };
      if (parsed.rewardYen !== undefined) {
        next.rewardYen = parsed.rewardYen;
        filledKeys.push("報酬");
      }
      if (parsed.estimatedMinutes !== undefined) {
        next.estimatedMinutes = parsed.estimatedMinutes;
        filledKeys.push("予想時間");
      }
      if (parsed.distanceKm !== undefined) {
        next.distanceKm = parsed.distanceKm;
        filledKeys.push("距離");
      }
      return next;
    });
    if (filledKeys.length === 0) {
      setOcrMessage(
        "値を抽出できませんでした。手入力してください。",
      );
    } else {
      setOcrMessage(
        `OCRで ${filledKeys.join("・")} を自動入力しました。必ず内容を確認してください。`,
      );
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <section className="space-y-2 rounded-2xl border-2 border-dashed border-sky-400 bg-sky-50 p-4 dark:border-sky-700 dark:bg-sky-950">
        <label className="block text-base font-bold">
          スクリーンショットから自動入力（補助）
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          disabled={ocrLoading}
          className="block w-full text-sm"
        />
        {ocrLoading && (
          <p className="text-sm text-sky-800 dark:text-sky-200">
            解析中…（端末性能により数十秒かかることがあります）
          </p>
        )}
        {ocrMessage && !ocrLoading && (
          <p className="text-sm text-sky-900 dark:text-sky-100">{ocrMessage}</p>
        )}
        <p className="text-xs text-slate-600 dark:text-slate-400">
          画像はアプリ内で処理し、保存はしません。OCR結果は必ず手で確認・修正してください。
        </p>
      </section>

      <Field label="報酬（円）">
        <input
          type="number"
          inputMode="numeric"
          min={0}
          value={values.rewardYen || ""}
          onChange={(e) => update("rewardYen", Number(e.target.value) || 0)}
          className={inputCls}
          placeholder="500"
        />
      </Field>

      <Field label="予想時間（分）">
        <input
          type="number"
          inputMode="numeric"
          min={0}
          value={values.estimatedMinutes || ""}
          onChange={(e) =>
            update("estimatedMinutes", Number(e.target.value) || 0)
          }
          className={inputCls}
          placeholder="20"
        />
      </Field>

      <Field label="距離（km）">
        <input
          type="number"
          inputMode="decimal"
          step="0.1"
          min={0}
          value={values.distanceKm || ""}
          onChange={(e) => update("distanceKm", Number(e.target.value) || 0)}
          className={inputCls}
          placeholder="2.5"
        />
      </Field>

      <Field label="受取店舗名">
        <input
          type="text"
          value={values.pickupName}
          onChange={(e) => update("pickupName", e.target.value)}
          className={inputCls}
          placeholder="マクドナルド 岡山駅前店"
        />
      </Field>

      <Field label="配達先エリア">
        <input
          type="text"
          value={values.dropoffArea}
          onChange={(e) => update("dropoffArea", e.target.value)}
          className={inputCls}
          placeholder="表町 / 半田山 など"
        />
      </Field>

      <Field label="現在地・出発地">
        <input
          type="text"
          value={values.currentArea}
          onChange={(e) => update("currentArea", e.target.value)}
          className={inputCls}
          placeholder="谷万成"
        />
      </Field>

      <Field label="時間帯">
        <select
          value={values.timeOfDay}
          onChange={(e) => update("timeOfDay", e.target.value as TimeOfDay)}
          className={inputCls}
        >
          {TIME_OPTIONS.map((t) => (
            <option key={t} value={t}>
              {TIME_OF_DAY_LABELS[t]}
            </option>
          ))}
        </select>
      </Field>

      <label className="flex items-center gap-3 rounded-xl border-2 border-slate-300 px-4 py-3 dark:border-slate-700">
        <input
          type="checkbox"
          checked={values.isRain}
          onChange={(e) => update("isRain", e.target.checked)}
          className="h-5 w-5"
        />
        <span className="text-base font-bold">雨が降っている</span>
      </label>

      <Field label="メモ（任意）">
        <textarea
          value={values.memo}
          onChange={(e) => update("memo", e.target.value)}
          className={`${inputCls} min-h-[88px]`}
          placeholder="坂道があるかも、など気づいたこと"
        />
      </Field>

      <div className="sticky bottom-0 -mx-4 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
        <button
          type="submit"
          className="flex min-h-[60px] w-full items-center justify-center rounded-2xl bg-emerald-600 px-6 text-xl font-bold text-white shadow active:scale-[0.98] dark:bg-emerald-500"
        >
          判定する
        </button>
      </div>
    </form>
  );
}

const inputCls =
  "w-full rounded-xl border-2 border-slate-300 px-4 py-3 text-base focus:border-emerald-500 focus:outline-none dark:border-slate-700";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-base font-bold">{label}</span>
      {children}
    </label>
  );
}
