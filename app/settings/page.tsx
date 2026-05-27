"use client";

import { useEffect, useState } from "react";
import SafetyNotice from "@/components/SafetyNotice";
import { DEFAULT_SETTINGS } from "@/lib/defaultSettings";
import { getSettings, saveSettings } from "@/lib/storage";
import type { AppSettings } from "@/types/settings";

function parseAreas(text: string): string[] {
  return text
    .split(/[\n,、]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function joinAreas(areas: string[]): string {
  return areas.join("\n");
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [ngText, setNgText] = useState("");
  const [cautionText, setCautionText] = useState("");
  const [recText, setRecText] = useState("");
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    const s = getSettings();
    setSettings(s);
    setNgText(joinAreas(s.ngAreas));
    setCautionText(joinAreas(s.cautionAreas));
    setRecText(joinAreas(s.recommendedAreas));
  }, []);

  function update<K extends keyof AppSettings>(key: K, value: AppSettings[K]) {
    setSettings((s) => ({ ...s, [key]: value }));
  }

  function handleSave() {
    const next: AppSettings = {
      ...settings,
      ngAreas: parseAreas(ngText),
      cautionAreas: parseAreas(cautionText),
      recommendedAreas: parseAreas(recText),
    };
    saveSettings(next);
    setSettings(next);
    setSavedAt(new Date().toLocaleTimeString());
  }

  function handleReset() {
    if (
      typeof window !== "undefined" &&
      !window.confirm("初期設定に戻します。よろしいですか？")
    )
      return;
    setSettings(DEFAULT_SETTINGS);
    setNgText(joinAreas(DEFAULT_SETTINGS.ngAreas));
    setCautionText(joinAreas(DEFAULT_SETTINGS.cautionAreas));
    setRecText(joinAreas(DEFAULT_SETTINGS.recommendedAreas));
    saveSettings(DEFAULT_SETTINGS);
    setSavedAt(new Date().toLocaleTimeString());
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-black">設定</h1>
      <SafetyNotice compact />

      <NumField
        label="目標時給（円/h）"
        value={settings.targetHourlyRate}
        onChange={(v) => update("targetHourlyRate", v)}
      />
      <NumField
        label="最低報酬ライン（円）"
        value={settings.minimumRewardYen}
        onChange={(v) => update("minimumRewardYen", v)}
      />
      <NumField
        label="長すぎる予想時間しきい値（分）"
        value={settings.longTimeMinutes}
        onChange={(v) => update("longTimeMinutes", v)}
      />
      <NumField
        label="長すぎる距離しきい値（km）"
        value={settings.longDistanceKm}
        step={0.1}
        onChange={(v) => update("longDistanceKm", v)}
      />

      <AreaField
        label="NGエリア（改行またはカンマ区切り）"
        value={ngText}
        onChange={setNgText}
      />
      <AreaField
        label="注意エリア"
        value={cautionText}
        onChange={setCautionText}
      />
      <AreaField
        label="おすすめエリア"
        value={recText}
        onChange={setRecText}
      />

      <BoolField
        label="自転車モード"
        value={settings.bicycleMode}
        onChange={(v) => update("bicycleMode", v)}
      />
      <BoolField
        label="雨の日ボーナスを有効化"
        value={settings.rainModeBonusEnabled}
        onChange={(v) => update("rainModeBonusEnabled", v)}
      />
      <BoolField
        label="夜間ペナルティを有効化"
        value={settings.nightPenaltyEnabled}
        onChange={(v) => update("nightPenaltyEnabled", v)}
      />

      <div className="sticky bottom-0 -mx-4 grid grid-cols-2 gap-2 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
        <button
          type="button"
          onClick={handleSave}
          className="flex min-h-[56px] items-center justify-center rounded-2xl bg-emerald-600 px-4 text-base font-bold text-white shadow active:scale-[0.98] dark:bg-emerald-500"
        >
          設定を保存
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="flex min-h-[56px] items-center justify-center rounded-2xl border-2 border-slate-300 bg-white px-4 text-base font-bold dark:border-slate-700 dark:bg-slate-800"
        >
          初期値に戻す
        </button>
      </div>
      {savedAt && (
        <p className="text-center text-sm text-emerald-700 dark:text-emerald-400">
          {savedAt} に保存しました。
        </p>
      )}
    </div>
  );
}

const inputCls =
  "mt-1 w-full rounded-xl border-2 border-slate-300 px-3 py-2 text-base focus:border-emerald-500 focus:outline-none dark:border-slate-700";

function NumField({
  label,
  value,
  onChange,
  step,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
}) {
  return (
    <label className="block text-base font-bold">
      {label}
      <input
        type="number"
        inputMode={step ? "decimal" : "numeric"}
        step={step ?? 1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className={inputCls}
      />
    </label>
  );
}

function AreaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block text-base font-bold">
      {label}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputCls} min-h-[120px] font-normal`}
      />
    </label>
  );
}

function BoolField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 rounded-xl border-2 border-slate-300 px-4 py-3 dark:border-slate-700">
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5"
      />
      <span className="text-base font-bold">{label}</span>
    </label>
  );
}
