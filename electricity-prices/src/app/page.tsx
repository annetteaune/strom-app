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

  const findCheapestHour = () => {
    return prices.reduce((cheapest, current) =>
      current.NOK_per_kWh < cheapest.NOK_per_kWh ? current : cheapest
    );
  };

  const findMostExpensiveHour = () => {
    return prices.reduce((most, current) =>
      current.NOK_per_kWh > most.NOK_per_kWh ? current : most
    );
  };

  // prisbarer
  const calculatePriceBarPercentage = () => {
    const maxPrice = findMostExpensiveHour().NOK_per_kWh;

    // Ihvis makspris er 1kr eller mindre, 1kr er baseline
    // Hvis makspris er større enn 1kr, bruk makspris som baseline
    const baselinePrice = Math.max(maxPrice, 1);

    return prices.map((price) => ({
      ...price,
      pricePercentage: (price.NOK_per_kWh / baselinePrice) * 100,
    }));
  };

  const pricesWithPercentages = calculatePriceBarPercentage();

  return (
    <main>
      <h1>Strømpriser i dag</h1>
      <p className="title-sub">eks. mva, nettleie, avgifter og strømstøtte</p>

      <div className="area-selector">
        <label htmlFor="area-select">Prismoråde: </label>
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
              <p>
                {format(parseISO(findCheapestHour().time_start), "HH:mm")} -
                {format(parseISO(findCheapestHour().time_end), "HH:mm")}
              </p>
              <p>{findCheapestHour().NOK_per_kWh.toFixed(2)} NOK/kWh</p>
            </div>

            <div>
              <h3>Dyreste time</h3>
              <p>
                {format(parseISO(findMostExpensiveHour().time_start), "HH:mm")}{" "}
                -{format(parseISO(findMostExpensiveHour().time_end), "HH:mm")}
              </p>
              <p>{findMostExpensiveHour().NOK_per_kWh.toFixed(2)} NOK/kWh</p>
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
                    price.NOK_per_kWh === findCheapestHour().NOK_per_kWh
                      ? "cheapest-hour"
                      : price.NOK_per_kWh ===
                        findMostExpensiveHour().NOK_per_kWh
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
                        backgroundColor:
                          price.NOK_per_kWh === findCheapestHour().NOK_per_kWh
                            ? "#2ecc71"
                            : price.NOK_per_kWh ===
                              findMostExpensiveHour().NOK_per_kWh
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
