import axios from "axios";
import { ElectricityPrice, PriceArea } from "../types/ElectricityPrice";

const BASE_URL = "https://www.hvakosterstrommen.no/api/v1/prices";

export const fetchElectricityPrices = async (
  year: number,
  month: number,
  day: number,
  area: PriceArea
): Promise<ElectricityPrice[]> => {
  const formattedMonth = month.toString().padStart(2, "0");
  const formattedDay = day.toString().padStart(2, "0");

  const url = `${BASE_URL}/${year}/${formattedMonth}-${formattedDay}_${area}.json`;

  try {
    const response = await axios.get<ElectricityPrice[]>(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching electricity prices:", error);
    throw error;
  }
};
