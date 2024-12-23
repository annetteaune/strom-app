export interface ElectricityPrice {
  NOK_per_kWh: number;
  EUR_per_kWh: number;
  EXR: number;
  time_start: string;
  time_end: string;
}

export interface PriceAreaInfo {
  code: string;
  name: string;
}

export const PRICE_AREAS: PriceAreaInfo[] = [
  { code: "NO1", name: "NO1 - Oslo / Øst-Norge" },
  { code: "NO2", name: "NO2 - Kristiansand / Sør-Norge" },
  { code: "NO3", name: "NO3 - Trondheim / Midt-Norge" },
  { code: "NO4", name: "NO4 - Tromsø / Nord-Norge" },
  { code: "NO5", name: "NO5 - Bergen / Vest-Norge" },
];

export type PriceArea = "NO1" | "NO2" | "NO3" | "NO4" | "NO5";
