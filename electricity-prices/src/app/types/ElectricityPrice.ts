export interface ElectricityPrice {
  NOK_per_kWh: number;
  EUR_per_kWh: number;
  EXR: number;
  time_start: string;
  time_end: string;
}

export const PRICE_AREAS = ["NO1", "NO2", "NO3", "NO4", "NO5"] as const;
export type PriceArea = (typeof PRICE_AREAS)[number];
