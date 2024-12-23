import axios from "axios";
import { ElectricityPrice, PriceArea } from "../types/ElectricityPrice";

const BASE_URL = "https://www.hvakosterstrommen.no/api/v1/prices";

export const fetchElectricityPrices = async (
  date: Date,
  area: PriceArea
): Promise<ElectricityPrice[]> => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const url = `${BASE_URL}/${year}/${month}-${day}_${area}.json`;

  try {
    const response = await axios.get<ElectricityPrice[]>(url);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return [];
    }
    throw error;
  }
};

export const canFetchTomorrowsPrices = (): boolean => {
  const now = new Date();

  const offset = now.getTimezoneOffset();
  const norwayOffset = now.getMonth() >= 3 && now.getMonth() <= 9 ? -120 : -60; // -120 for sommer, -60 for vinter
  const minutesToAdd = norwayOffset - offset;

  const norwayTime = new Date(now.getTime() + minutesToAdd * 60000);
  return norwayTime.getHours() >= 13;
};

export const getTomorrowAvailabilityMessage = (): string => {
  const now = new Date();
  const hours = 13 - now.getHours();
  return `Morgendagens priser publiseres etter kl. 13:00 (om ca. ${hours} timer)`;
};
