import type {
  DeliveryInput,
  DeliveryScoreResult,
  Decision,
} from "@/types/delivery";
import { DECISION_LABELS } from "@/types/delivery";
import type { AppSettings } from "@/types/settings";
import { HILL_RISK_KEYWORDS } from "./defaultSettings";

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function containsAny(haystack: string, needles: string[]): string | null {
  for (const n of needles) {
    if (n && haystack.includes(n)) return n;
  }
  return null;
}

export function calculateDeliveryScore(
  input: DeliveryInput,
  settings: AppSettings,
): DeliveryScoreResult {
  const reasons: string[] = [];
  const cautions: string[] = [
    "出発前にルートを確認してください",
    "走行中にスマホ操作をしないでください",
    "自転車では坂道・大通り・階段・細道に注意してください",
  ];

  const hourlyRate =
    input.estimatedMinutes > 0
      ? (input.rewardYen / input.estimatedMinutes) * 60
      : 0;
  const yenPerKm =
    input.distanceKm > 0 ? input.rewardYen / input.distanceKm : 0;

  let score = 100;

  // 時給換算
  if (hourlyRate >= settings.targetHourlyRate) {
    score += 10;
    reasons.push(
      `時給換算 約${Math.round(hourlyRate)}円/h で目標を上回っています`,
    );
  } else if (hourlyRate >= 1800) {
    // 0
    reasons.push(
      `時給換算 約${Math.round(hourlyRate)}円/h で目標(${settings.targetHourlyRate}円)に少し届きません`,
    );
  } else if (hourlyRate >= 1500) {
    score -= 10;
    reasons.push(
      `時給換算 約${Math.round(hourlyRate)}円/h は目標を下回っています`,
    );
  } else if (hourlyRate >= 1200) {
    score -= 20;
    reasons.push(
      `時給換算 約${Math.round(hourlyRate)}円/h は低めです`,
    );
  } else {
    score -= 35;
    reasons.push(
      `時給換算 約${Math.round(hourlyRate)}円/h は大きく目標を下回っています`,
    );
  }

  // 報酬
  if (input.rewardYen < settings.minimumRewardYen) {
    score -= 15;
    reasons.push(
      `報酬が最低ライン(${settings.minimumRewardYen}円)を下回っています`,
    );
  }
  if (input.rewardYen >= 1000) {
    score += 10;
    reasons.push("報酬が1,000円以上で見返りが良いです");
  } else if (input.rewardYen >= 800) {
    score += 5;
    reasons.push("報酬が800円以上あります");
  }

  // 予想時間
  if (input.estimatedMinutes >= settings.longTimeMinutes) {
    score -= 20;
    reasons.push(
      `予想時間 ${input.estimatedMinutes}分 は長すぎます`,
    );
  } else if (input.estimatedMinutes >= 30) {
    score -= 10;
    reasons.push(
      `予想時間 ${input.estimatedMinutes}分 はやや長めです`,
    );
  } else if (input.estimatedMinutes > 0 && input.estimatedMinutes <= 15) {
    score += 5;
    reasons.push("短時間で完了できそうです");
  }

  // 距離
  if (input.distanceKm >= settings.longDistanceKm) {
    score -= 20;
    reasons.push(`距離 ${input.distanceKm}km は長めです`);
  } else if (input.distanceKm >= 4) {
    score -= 10;
    reasons.push(`距離 ${input.distanceKm}km はやや長めです`);
  } else if (input.distanceKm > 0 && input.distanceKm <= 2) {
    score += 5;
    reasons.push("短距離で済みそうです");
  }

  // エリア判定
  const dropoff = input.dropoffArea ?? "";
  const ngHit = containsAny(dropoff, settings.ngAreas);
  const cautionHit = containsAny(dropoff, settings.cautionAreas);
  const recommendedHit = containsAny(dropoff, settings.recommendedAreas);

  if (ngHit) {
    score -= 35;
    reasons.push(
      `配達先がNGエリア(${ngHit})に含まれています`,
    );
  }
  if (cautionHit) {
    score -= 15;
    reasons.push(
      `配達先が注意エリア(${cautionHit})に含まれています`,
    );
  }
  if (recommendedHit) {
    score += 10;
    reasons.push(
      "市街地・平地寄りのため比較的受けやすい案件です",
    );
  }

  // 坂道・住宅団地リスク
  const memo = input.memo ?? "";
  const hillRisk =
    containsAny(dropoff, HILL_RISK_KEYWORDS) ??
    containsAny(memo, HILL_RISK_KEYWORDS);
  if (hillRisk) {
    score -= 20;
    reasons.push("坂道・住宅団地リスクがあります");
  }

  // 夜間×坂道
  if (
    settings.nightPenaltyEnabled &&
    input.timeOfDay === "night" &&
    hillRisk
  ) {
    score -= 15;
    reasons.push(
      "夜間かつ坂道・住宅団地方面のため慎重に判断してください",
    );
  }

  // 雨の日
  if (settings.rainModeBonusEnabled && input.isRain) {
    if (hillRisk) {
      score -= 20;
    } else if (hourlyRate >= settings.targetHourlyRate) {
      score += 10;
    }
    reasons.push(
      "雨の日は単価が上がる可能性がありますが、路面や坂道に注意が必要です",
    );
  }

  // 中心部から離れるリスク
  if ((ngHit || cautionHit) && input.distanceKm >= 4) {
    score -= 15;
    reasons.push(
      "配達後に中心部へ戻る時間が発生しそうです",
    );
  }

  score = Math.round(clamp(score, 0, 100));

  // 判定
  let decision: Decision;
  if (score >= 75) decision = "go";
  else if (score >= 50) decision = "maybe";
  else decision = "skip";

  // NGエリア かつ 目標時給未満 は原則行かない
  if (ngHit && hourlyRate < settings.targetHourlyRate && decision !== "skip") {
    decision = "skip";
    reasons.push(
      "NGエリアかつ目標時給未満のため、原則避ける判断です",
    );
  }

  return {
    score,
    decision,
    decisionLabel: DECISION_LABELS[decision],
    reasons,
    cautions,
    hourlyRate: Math.round(hourlyRate),
    yenPerKm: Math.round(yenPerKm),
  };
}
