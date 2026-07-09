"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage, TutorSettings } from "@/types/chat";
import { DEFAULT_SETTINGS } from "@/lib/tutorPrompt";
import { parseTurn } from "@/lib/parseFeedback";
import {
  clearMessages,
  getMessages,
  getSettings,
  saveMessages,
  saveSettings,
} from "@/lib/storage";
import { useTts } from "@/lib/useSpeech";
import Toolbar from "@/components/Toolbar";
import MessageList from "@/components/MessageList";
import Composer from "@/components/Composer";

export default function TutorPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [settings, setSettings] = useState<TutorSettings>(DEFAULT_SETTINGS);
  const [streaming, setStreaming] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const tts = useTts();
  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const startedRef = useRef(false);

  /** Call the tutor API with the given history and stream the reply in. */
  const runTutor = useCallback(
    async (history: ChatMessage[]) => {
      setLoading(true);
      setError(null);
      setStreaming("");
      let acc = "";
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            messages: history,
            level: settingsRef.current.level,
            topic: settingsRef.current.topic,
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.error ?? `サーバーエラー (${res.status})`);
        }
        if (!res.body) throw new Error("応答を受信できませんでした。");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          setStreaming(acc);
        }

        const errIdx = acc.indexOf("[ERROR]");
        if (errIdx !== -1) {
          const before = acc.slice(0, errIdx).trim();
          if (before) {
            const finalized = [
              ...history,
              { role: "assistant" as const, content: before },
            ];
            setMessages(finalized);
            saveMessages(finalized);
          }
          throw new Error(acc.slice(errIdx + 7).trim() || "エラーが発生しました。");
        }

        const finalized = [
          ...history,
          { role: "assistant" as const, content: acc },
        ];
        setMessages(finalized);
        saveMessages(finalized);

        if (settingsRef.current.autoSpeak && tts.supported) {
          const { reply } = parseTurn(acc);
          if (reply) tts.speak(reply);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "エラーが発生しました。");
      } finally {
        setStreaming(null);
        setLoading(false);
      }
    },
    [tts],
  );

  // Load persisted state on mount, and open the conversation if it's empty.
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const saved = getSettings();
    setSettings(saved);
    settingsRef.current = saved;
    const savedMessages = getMessages();
    setMessages(savedMessages);
    setReady(true);

    if (savedMessages.length === 0) {
      void runTutor([]);
    }
  }, [runTutor]);

  const handleSend = useCallback(
    (text: string) => {
      if (loading) return;
      const next = [...messages, { role: "user" as const, content: text }];
      setMessages(next);
      saveMessages(next);
      void runTutor(next);
    },
    [loading, messages, runTutor],
  );

  const handleSettingsChange = useCallback((patch: Partial<TutorSettings>) => {
    setSettings((prev) => {
      const nextSettings = { ...prev, ...patch };
      saveSettings(nextSettings);
      settingsRef.current = nextSettings;
      return nextSettings;
    });
  }, []);

  const handleReset = useCallback(() => {
    if (loading) return;
    tts.stop();
    clearMessages();
    setMessages([]);
    setError(null);
    void runTutor([]);
  }, [loading, runTutor, tts]);

  return (
    <div className="flex h-[calc(100dvh-3.25rem)] flex-col">
      <Toolbar
        settings={settings}
        ttsSupported={tts.supported}
        onChange={handleSettingsChange}
        onReset={handleReset}
      />
      <MessageList
        messages={messages}
        streaming={streaming}
        loading={loading}
        error={error}
        ttsSupported={tts.supported}
        onSpeak={tts.speak}
      />
      <Composer disabled={loading || !ready} onSend={handleSend} />
    </div>
  );
}
