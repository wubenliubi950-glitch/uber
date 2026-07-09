"use client";

import { useEffect, useRef, useState } from "react";
import { useStt } from "@/lib/useSpeech";

interface Props {
  disabled: boolean;
  onSend: (text: string) => void;
}

export default function Composer({ disabled, onSend }: Props) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const stt = useStt((spoken) => {
    setText((prev) => (prev ? `${prev} ${spoken}` : spoken));
  });

  // Auto-grow the textarea up to a few lines.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [text]);

  const send = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
  };

  return (
    <div className="border-t border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex max-w-xl items-end gap-2">
        {stt.supported && (
          <button
            type="button"
            aria-label={stt.listening ? "録音を止める" : "話して入力"}
            title={stt.listening ? "録音を止める" : "話して入力"}
            onClick={() => (stt.listening ? stt.stop() : stt.start())}
            className={`shrink-0 rounded-full p-2 text-lg ${
              stt.listening
                ? "animate-pulse bg-rose-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            🎤
          </button>
        )}

        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          rows={1}
          placeholder="英語で答えてみましょう…（Enterで送信 / Shift+Enterで改行）"
          className="max-h-40 flex-1 resize-none rounded-2xl border border-slate-300 px-4 py-2 focus:border-emerald-500 focus:outline-none dark:border-slate-700"
        />

        <button
          type="button"
          onClick={send}
          disabled={disabled || !text.trim()}
          className="shrink-0 rounded-full bg-emerald-600 px-4 py-2 font-bold text-white disabled:opacity-40 dark:bg-emerald-500"
        >
          送信
        </button>
      </div>
    </div>
  );
}
