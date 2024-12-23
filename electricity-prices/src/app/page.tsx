"use client";

import { useState, useEffect } from "react";

import { fetchElectricityPrices } from "./services/electricityPriceService";
import {
  ElectricityPrice,
  PRICE_AREAS,
  PriceArea,
} from "./types/ElectricityPrice";
import AreaSelector from "@/components/AreaSelector";
import PriceHighlights from "@/components/PriceHighlights";
import PricesTable from "@/components/PricesTable";
import { usePriceAnalysis } from "@/hooks/usePriceAnalysis";

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

  const { pricesWithPercentages, cheapestHour, mostExpensiveHour } =
    usePriceAnalysis(prices);

  return (
    <main>
      <h1>Dagens strømpriser</h1>

      <AreaSelector
        selectedArea={selectedArea}
        setSelectedArea={setSelectedArea}
      />

      {loading && <p>Laster inn...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && prices.length > 0 && (
        <div className="price-analysis">
          <h2>Prisanalyse for {selectedArea}</h2>

          <PriceHighlights
            cheapestHour={cheapestHour}
            mostExpensiveHour={mostExpensiveHour}
          />

          <PricesTable prices={pricesWithPercentages} />
        </div>
      )}
    </main>
  );
}
