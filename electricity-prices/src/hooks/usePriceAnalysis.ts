import { ElectricityPrice } from "@/app/types/ElectricityPrice";

export const usePriceAnalysis = (prices: ElectricityPrice[]) => {
  const findCheapestHour = (priceList: ElectricityPrice[]) => {
    if (priceList.length === 0) return null;
    return priceList.reduce((cheapest, current) =>
      current.NOK_per_kWh < cheapest.NOK_per_kWh ? current : cheapest
    );
  };

  const findMostExpensiveHour = (priceList: ElectricityPrice[]) => {
    if (priceList.length === 0) return null;
    return priceList.reduce((most, current) =>
      current.NOK_per_kWh > most.NOK_per_kWh ? current : most
    );
  };

  const calculatePriceBarPercentage = () => {
    if (prices.length === 0) return [];

    const cheapestHour = findCheapestHour(prices);
    const mostExpensiveHour = findMostExpensiveHour(prices);

    // 1 som fallback
    const maxPrice = mostExpensiveHour?.NOK_per_kWh ?? 1;

    // hvis nmakspris er 1kr eller mindre, er 1kr baseline
    // ellers er makspris baseline
    const baselinePrice = Math.max(maxPrice, 1);

    return prices.map((price) => ({
      ...price,
      pricePercentage: (price.NOK_per_kWh / baselinePrice) * 100,
      isCheapestHour: cheapestHour
        ? price.NOK_per_kWh === cheapestHour.NOK_per_kWh
        : false,
      isMostExpensiveHour: mostExpensiveHour
        ? price.NOK_per_kWh === mostExpensiveHour.NOK_per_kWh
        : false,
    }));
  };

  const pricesWithPercentages = calculatePriceBarPercentage();
  const cheapestHour = findCheapestHour(prices);
  const mostExpensiveHour = findMostExpensiveHour(prices);

  return {
    pricesWithPercentages,
    cheapestHour,
    mostExpensiveHour,
  };
};
