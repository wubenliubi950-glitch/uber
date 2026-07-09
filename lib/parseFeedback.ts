import type { Feedback } from "@/types/chat";
import { FEEDBACK_SENTINEL } from "./tutorPrompt";

export interface ParsedTurn {
  /** The conversational reply (safe to read aloud). */
  reply: string;
  /** Structured feedback, or null when the message has no feedback block. */
  feedback: Feedback | null;
}

const LABELS: { key: keyof Feedback; markers: string[] }[] = [
  { key: "good", markers: ["🟢 Good:", "🟢Good:", "Good:"] },
  { key: "fix", markers: ["🔧 Fix:", "🔧Fix:", "Fix:"] },
  { key: "natural", markers: ["💬 Natural:", "💬Natural:", "Natural:"] },
  { key: "next", markers: ["❓ Next:", "❓Next:", "Next:"] },
];

function matchLabel(line: string): { key: keyof Feedback; value: string } | null {
  const trimmed = line.trim();
  for (const { key, markers } of LABELS) {
    for (const marker of markers) {
      if (trimmed.startsWith(marker)) {
        return { key, value: trimmed.slice(marker.length).trim() };
      }
    }
  }
  return null;
}

/**
 * Split an assistant message into its conversational reply and feedback block.
 * When the sentinel is absent (e.g. the first greeting or a streaming partial),
 * the whole text is treated as the reply and feedback is null.
 */
export function parseTurn(content: string): ParsedTurn {
  const idx = content.indexOf(FEEDBACK_SENTINEL);
  if (idx === -1) {
    return { reply: content.trim(), feedback: null };
  }

  const reply = content.slice(0, idx).trim();
  const rest = content.slice(idx + FEEDBACK_SENTINEL.length);

  const feedback: Feedback = {};
  for (const rawLine of rest.split("\n")) {
    const hit = matchLabel(rawLine);
    if (hit && hit.value) {
      feedback[hit.key] = hit.value;
    }
  }

  const hasAny = Object.keys(feedback).length > 0;
  return { reply, feedback: hasAny ? feedback : null };
}
