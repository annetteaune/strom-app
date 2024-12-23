"use client";

import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";

import { fetchElectricityPrices } from "./services/electricityPriceService";
import {
  ElectricityPrice,
  PRICE_AREAS,
  PriceArea,
} from "./types/ElectricityPrice";

export default function Home() {
  const [selectedArea, setSelectedArea] = useState<PriceArea>("NO1");
  const [prices, setPrices] = useState<ElectricityPrice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      setLoading(true);
      setError(null);

      try {
        const today = new Date();
        const prices = await fetchElectricityPrices(
          today.getFullYear(),
          today.getMonth() + 1,
          today.getDate(),
          selectedArea
        );
        setPrices(prices);
      } catch (err) {
        setError("Failed to fetch electricity prices");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, [selectedArea]);

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

  return (
    <main>
      <h1>Dagens strømpriser</h1>

      <div className="area-selector">
        <label htmlFor="area-select">Prisområde: </label>
        <select
          id="area-select"
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value as PriceArea)}
        >
          {PRICE_AREAS.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Laster inn...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && prices.length > 0 && (
        <div className="price-analysis">
          <h2>Prisanalyse for {selectedArea}</h2>

          <div className="price-highlights">
            <div>
              <h3>Billigste time</h3>
              {cheapestHour ? (
                <>
                  <p>
                    {format(parseISO(cheapestHour.time_start), "HH:mm")} -
                    {format(parseISO(cheapestHour.time_end), "HH:mm")}
                  </p>
                  <p>{cheapestHour.NOK_per_kWh.toFixed(2)} NOK/kWh</p>
                </>
              ) : (
                <p>Priser ikke tilgjengelig</p>
              )}
            </div>

            <div>
              <h3>Dyreste time</h3>
              {mostExpensiveHour ? (
                <>
                  <p>
                    {format(parseISO(mostExpensiveHour.time_start), "HH:mm")} -
                    {format(parseISO(mostExpensiveHour.time_end), "HH:mm")}
                  </p>
                  <p>{mostExpensiveHour.NOK_per_kWh.toFixed(2)} NOK/kWh</p>
                </>
              ) : (
                <p>Priser ikke tilgjengelig</p>
              )}
            </div>
          </div>

          <table className="prices-table">
            <thead>
              <tr>
                <th>Tid</th>
                <th>Pris (NOK/kWh)</th>
                <th>Prisnivå</th>
              </tr>
            </thead>
            <tbody>
              {pricesWithPercentages.map((price, index) => (
                <tr
                  key={index}
                  className={
                    price.isCheapestHour
                      ? "cheapest-hour"
                      : price.isMostExpensiveHour
                      ? "expensive-hour"
                      : ""
                  }
                >
                  <td>
                    {format(parseISO(price.time_start), "HH:mm")} -
                    {format(parseISO(price.time_end), "HH:mm")}
                  </td>
                  <td>{price.NOK_per_kWh.toFixed(2)}</td>
                  <td>
                    <div
                      className="price-bar"
                      style={{
                        width: `${price.pricePercentage}%`,
                        backgroundColor: price.isCheapestHour
                          ? "#2ecc71"
                          : price.isMostExpensiveHour
                          ? "#e74c3c"
                          : "#3498db",
                      }}
                    ></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
