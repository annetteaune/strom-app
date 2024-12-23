"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

import {
  fetchElectricityPrices,
  canFetchTomorrowsPrices,
} from "./services/electricityPriceService";
import { ElectricityPrice, PriceArea } from "./types/ElectricityPrice";
import AreaSelector from "@/components/AreaSelector";
import PriceHighlights from "@/components/PriceHighlights";
import PricesTable from "@/components/PricesTable";
import { usePriceAnalysis } from "@/hooks/usePriceAnalysis";
import Footer from "@/components/page-components/Footer";
import Header from "@/components/page-components/Header";

type DateOption = "today" | "tomorrow";

export default function Home() {
  const [selectedArea, setSelectedArea] = useState<PriceArea>("NO1");
  const [selectedDate, setSelectedDate] = useState<DateOption>("today");
  const [prices, setPrices] = useState<ElectricityPrice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canShowTomorrow = canFetchTomorrowsPrices();

  const getDisplayDate = () => {
    const date = new Date();
    if (selectedDate === "tomorrow") {
      date.setDate(date.getDate() + 1);
    }
    return format(date, "EEEE d. MMMM yyyy", { locale: nb });
  };

  useEffect(() => {
    const fetchPrices = async () => {
      setLoading(true);
      setError(null);

      try {
        const date = new Date();
        if (selectedDate === "tomorrow") {
          date.setDate(date.getDate() + 1);
        }

        const prices = await fetchElectricityPrices(date, selectedArea);

        if (prices.length === 0 && selectedDate === "tomorrow") {
          setError(
            "Prisene for i morgen er ikke tilgjengelige enda. Prisene publiseres ca kl. 13:00."
          );
        } else if (prices.length === 0) {
          setError("Kunne ikke hente strømpriser");
        } else {
          setPrices(prices);
        }
      } catch (err) {
        setError("Det oppstod en feil ved henting av strømpriser");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, [selectedArea, selectedDate]);

  const { pricesWithPercentages, cheapestHour, mostExpensiveHour } =
    usePriceAnalysis(prices);

  return (
    <>
      <main>
        <Header />
        <div className="controls">
          <AreaSelector
            selectedArea={selectedArea}
            setSelectedArea={setSelectedArea}
          />
          <div className="date-selector">
            <button
              className={selectedDate === "today" ? "active" : ""}
              onClick={() => setSelectedDate("today")}
            >
              I dag
            </button>
            <button
              className={selectedDate === "tomorrow" ? "active" : ""}
              onClick={() => setSelectedDate("tomorrow")}
              disabled={!canShowTomorrow}
              title={
                !canShowTomorrow
                  ? "Morgendagens priser publiseres etter kl. 13:00"
                  : ""
              }
            >
              I morgen
            </button>
          </div>
        </div>

        {loading && <p className="loading">Laster inn...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && prices.length > 0 && (
          <div className="price-analysis">
            <h2>
              Prisanalyse for {selectedArea} - {getDisplayDate()}
            </h2>

            <PriceHighlights
              cheapestHour={cheapestHour}
              mostExpensiveHour={mostExpensiveHour}
            />

            <PricesTable
              prices={pricesWithPercentages}
              showCurrentHour={selectedDate === "today"}
            />
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
