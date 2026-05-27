import type { AppSettings } from "@/types/settings";

export const DEFAULT_NG_AREAS = [
  "横井上",
  "津高",
  "半田山",
  "一宮",
  "辛川市場",
  "芳賀",
  "山側住宅団地",
  "坂の多い北部エリア",
];

export const DEFAULT_CAUTION_AREAS = [
  "津島",
  "伊島",
  "三野",
  "原尾島",
  "中井町",
  "高島",
  "西大寺",
  "大元から遠く離れる方面",
];

export const DEFAULT_RECOMMENDED_AREAS = [
  "岡山駅周辺",
  "表町",
  "柳町",
  "田町",
  "中山下",
  "大元",
  "今",
  "問屋町",
  "奉還町",
  "清輝橋",
  "市街地の平地エリア",
];

export const HILL_RISK_KEYWORDS = [
  "坂",
  "団地",
  "山",
  "北部",
  "住宅地",
  "丘",
  "半田山",
  "横井上",
  "津高",
];

export const DEFAULT_SETTINGS: AppSettings = {
  targetHourlyRate: 2000,
  minimumRewardYen: 500,
  longTimeMinutes: 40,
  longDistanceKm: 5,
  ngAreas: DEFAULT_NG_AREAS,
  cautionAreas: DEFAULT_CAUTION_AREAS,
  recommendedAreas: DEFAULT_RECOMMENDED_AREAS,
  bicycleMode: true,
  rainModeBonusEnabled: true,
  nightPenaltyEnabled: true,
};
