import type { ChatMessage, TutorSettings } from "@/types/chat";
import { DEFAULT_SETTINGS } from "./tutorPrompt";

const SETTINGS_KEY = "en-tutor:settings";
const MESSAGES_KEY = "en-tutor:messages";

const memoryStore = new Map<string, string>();

function hasLocalStorage(): boolean {
  try {
    return typeof window !== "undefined" && !!window.localStorage;
  } catch {
    return false;
  }
}

function safeGet(key: string): string | null {
  try {
    if (hasLocalStorage()) {
      return window.localStorage.getItem(key);
    }
  } catch {
    // fall through to memory
  }
  return memoryStore.get(key) ?? null;
}

function safeSet(key: string, value: string): void {
  try {
    if (hasLocalStorage()) {
      window.localStorage.setItem(key, value);
      return;
    }
  } catch {
    // fall through to memory
  }
  memoryStore.set(key, value);
}

function safeRemove(key: string): void {
  try {
    if (hasLocalStorage()) {
      window.localStorage.removeItem(key);
      return;
    }
  } catch {
    // fall through
  }
  memoryStore.delete(key);
}

export function getSettings(): TutorSettings {
  const raw = safeGet(SETTINGS_KEY);
  if (!raw) return DEFAULT_SETTINGS;
  try {
    const parsed = JSON.parse(raw) as Partial<TutorSettings>;
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: TutorSettings): void {
  safeSet(SETTINGS_KEY, JSON.stringify(settings));
}

export function getMessages(): ChatMessage[] {
  const raw = safeGet(MESSAGES_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ChatMessage[]) : [];
  } catch {
    return [];
  }
}

export function saveMessages(messages: ChatMessage[]): void {
  safeSet(MESSAGES_KEY, JSON.stringify(messages));
}

export function clearMessages(): void {
  safeRemove(MESSAGES_KEY);
}
