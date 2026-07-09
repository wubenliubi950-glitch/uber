"use client";

import { useEffect, useRef } from "react";
import type { ChatMessage as ChatMessageType } from "@/types/chat";
import ChatMessage from "./ChatMessage";

interface Props {
  messages: ChatMessageType[];
  streaming: string | null;
  loading: boolean;
  error: string | null;
  ttsSupported: boolean;
  onSpeak: (text: string) => void;
}

export default function MessageList({
  messages,
  streaming,
  loading,
  error,
  ttsSupported,
  onSpeak,
}: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming, loading]);

  return (
    <div className="flex-1 space-y-3 overflow-y-auto px-3 py-4">
      <div className="mx-auto flex max-w-xl flex-col gap-3">
        {messages.map((m, i) => (
          <ChatMessage
            key={i}
            message={m}
            ttsSupported={ttsSupported}
            onSpeak={onSpeak}
          />
        ))}

        {streaming !== null && (
          <ChatMessage
            message={{ role: "assistant", content: streaming }}
            ttsSupported={false}
            onSpeak={onSpeak}
          />
        )}

        {loading && streaming === null && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-sm bg-slate-100 px-4 py-3 dark:bg-slate-800">
              <span className="inline-flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.2s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.1s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-200">
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
