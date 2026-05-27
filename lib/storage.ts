import type { AppSettings } from "@/types/settings";
import type { DeliveryRecord } from "@/types/delivery";
import { DEFAULT_SETTINGS } from "./defaultSettings";

const SETTINGS_KEY = "uber-eats-judge:settings";
const HISTORY_KEY = "uber-eats-judge:history";

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

export function getSettings(): AppSettings {
  const raw = safeGet(SETTINGS_KEY);
  if (!raw) return DEFAULT_SETTINGS;
  try {
    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  safeSet(SETTINGS_KEY, JSON.stringify(settings));
}

export function getHistory(): DeliveryRecord[] {
  const raw = safeGet(HISTORY_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as DeliveryRecord[]) : [];
  } catch {
    return [];
  }
}

function generateId(): string {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
  } catch {
    // ignore
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function saveDeliveryRecord(
  record: Omit<DeliveryRecord, "id" | "createdAt"> &
    Partial<Pick<DeliveryRecord, "id" | "createdAt">>,
): DeliveryRecord {
  const history = getHistory();
  const full: DeliveryRecord = {
    ...record,
    id: record.id ?? generateId(),
    createdAt: record.createdAt ?? new Date().toISOString(),
  };
  const next = [full, ...history];
  safeSet(HISTORY_KEY, JSON.stringify(next));
  return full;
}

export function updateDeliveryRecord(
  id: string,
  patch: Partial<DeliveryRecord>,
): DeliveryRecord | null {
  const history = getHistory();
  let updated: DeliveryRecord | null = null;
  const next = history.map((rec) => {
    if (rec.id === id) {
      updated = { ...rec, ...patch, id: rec.id, createdAt: rec.createdAt };
      return updated;
    }
    return rec;
  });
  safeSet(HISTORY_KEY, JSON.stringify(next));
  return updated;
}

export function deleteDeliveryRecord(id: string): void {
  const history = getHistory();
  const next = history.filter((rec) => rec.id !== id);
  safeSet(HISTORY_KEY, JSON.stringify(next));
}

export function clearHistory(): void {
  safeRemove(HISTORY_KEY);
}
