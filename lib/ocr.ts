import type { DeliveryInput } from "@/types/delivery";

export interface OcrResult {
  text: string;
  error?: string;
}

export async function runOcrFromImage(file: File): Promise<OcrResult> {
  try {
    const tesseract = await import("tesseract.js");
    const result = await tesseract.recognize(file, "jpn+eng");
    const text = result?.data?.text ?? "";
    if (!text.trim()) {
      return {
        text: "",
        error: "読み取れませんでした。手入力してください",
      };
    }
    return { text };
  } catch {
    return {
      text: "",
      error: "読み取れませんでした。手入力してください",
    };
  }
}

export function parseDeliveryText(
  text: string,
): Partial<DeliveryInput> {
  const out: Partial<DeliveryInput> = {};
  if (!text) return out;

  // 報酬: ¥500 / ￥500 / 500円
  const rewardMatch =
    text.match(/(?:¥|￥)\s*([0-9,]+)/) ?? text.match(/([0-9,]+)\s*円/);
  if (rewardMatch) {
    const n = Number(rewardMatch[1].replace(/,/g, ""));
    if (Number.isFinite(n) && n > 0) out.rewardYen = n;
  }

  // 時間: 約25分 / 25分
  const minutesMatch = text.match(/(?:約\s*)?([0-9]+)\s*分/);
  if (minutesMatch) {
    const n = Number(minutesMatch[1]);
    if (Number.isFinite(n) && n > 0) out.estimatedMinutes = n;
  }

  // 距離: 3.2km / 3.2 km
  const kmMatch = text.match(/([0-9]+(?:\.[0-9]+)?)\s*km/i);
  if (kmMatch) {
    const n = Number(kmMatch[1]);
    if (Number.isFinite(n) && n > 0) out.distanceKm = n;
  }

  return out;
}
