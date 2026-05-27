export interface AppSettings {
  targetHourlyRate: number;
  minimumRewardYen: number;
  longTimeMinutes: number;
  longDistanceKm: number;
  ngAreas: string[];
  cautionAreas: string[];
  recommendedAreas: string[];
  bicycleMode: boolean;
  rainModeBonusEnabled: boolean;
  nightPenaltyEnabled: boolean;
}
