export type TimeOfDay =
  | "morning"
  | "lunch"
  | "afternoon"
  | "dinner"
  | "night";

export const TIME_OF_DAY_LABELS: Record<TimeOfDay, string> = {
  morning: "朝",
  lunch: "ランチ",
  afternoon: "午後",
  dinner: "ディナー",
  night: "夜間",
};

export type Decision = "go" | "maybe" | "skip";

export const DECISION_LABELS: Record<Decision, string> = {
  go: "行く",
  maybe: "微妙。条件付きで行く",
  skip: "行かない",
};

export interface DeliveryInput {
  rewardYen: number;
  estimatedMinutes: number;
  distanceKm: number;
  pickupName: string;
  dropoffArea: string;
  currentArea: string;
  timeOfDay: TimeOfDay;
  isRain: boolean;
  memo: string;
}

export interface DeliveryScoreResult {
  score: number;
  decision: Decision;
  decisionLabel: string;
  reasons: string[];
  cautions: string[];
  hourlyRate: number;
  yenPerKm: number;
}

export interface DeliveryRecord
  extends DeliveryInput,
    DeliveryScoreResult {
  id: string;
  createdAt: string;
  accepted?: boolean;
  actualMinutes?: number;
  actualMemo?: string;
}
