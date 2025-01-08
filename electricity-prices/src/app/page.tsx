"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { fetchElectricityPrices } from "./services/electricityPriceService";
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
  const [showMVA, setShowMVA] = useState(true);

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

        if (prices.length === 0) {
          if (selectedDate === "tomorrow") {
            setError("Morgendagens priser kommer ca kl.13:00");
          } else {
            setError("Kunne ikke hente strømpriser");
          }
          setPrices([]);
        } else {
          setPrices(prices);
          setError(null);
        }
      } catch {
        setError("Morgendagens priser kommer ca kl.13:00");
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
      <Header showMVA={showMVA} setShowMVA={setShowMVA} />
      <main>
        <section className="controls">
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
            >
              I morgen
            </button>
          </div>
        </section>

        {loading && <p className="loading">Laster inn...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && prices.length > 0 && (
          <section className="price-analysis">
            <div className="content-wrapper">
              <h2>
                {selectedDate === "today" ? "I dag - " : "I morgen - "}
                {getDisplayDate()}
              </h2>
              <PriceHighlights
                cheapestHour={cheapestHour}
                mostExpensiveHour={mostExpensiveHour}
                prices={prices}
                isTomorrow={selectedDate === "tomorrow"}
                showMVA={showMVA}
              />
              <PricesTable
                prices={pricesWithPercentages}
                showCurrentHour={selectedDate === "today"}
                showMVA={showMVA}
              />
            </div>
          </section>
        )}
      </main>
      <Footer showMVA={showMVA} />
    </>
  );
}
