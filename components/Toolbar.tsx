"use client";

import type { Level, Topic, TutorSettings } from "@/types/chat";
import { LEVELS, TOPICS } from "@/lib/tutorPrompt";

interface Props {
  settings: TutorSettings;
  ttsSupported: boolean;
  onChange: (patch: Partial<TutorSettings>) => void;
  onReset: () => void;
}

export default function Toolbar({ settings, ttsSupported, onChange, onReset }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white/80 px-3 py-2 text-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <label className="flex items-center gap-1">
        <span className="text-slate-500 dark:text-slate-400">レベル</span>
        <select
          value={settings.level}
          onChange={(e) => onChange({ level: e.target.value as Level })}
          className="rounded-lg border border-slate-300 px-2 py-1 dark:border-slate-700"
        >
          {LEVELS.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-1">
        <span className="text-slate-500 dark:text-slate-400">話題</span>
        <select
          value={settings.topic}
          onChange={(e) => onChange({ topic: e.target.value as Topic })}
          className="rounded-lg border border-slate-300 px-2 py-1 dark:border-slate-700"
        >
          {TOPICS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </label>

      {ttsSupported && (
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={settings.autoSpeak}
            onChange={(e) => onChange({ autoSpeak: e.target.checked })}
            className="h-4 w-4 accent-emerald-600"
          />
          <span className="text-slate-600 dark:text-slate-300">自動読み上げ</span>
        </label>
      )}

      <button
        type="button"
        onClick={onReset}
        className="ml-auto rounded-lg border border-slate-300 px-2 py-1 font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        新しい会話
      </button>
    </div>
  );
}
