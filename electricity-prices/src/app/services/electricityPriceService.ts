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
