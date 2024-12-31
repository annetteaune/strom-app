import { format, parseISO, isWithinInterval } from "date-fns";
import { ElectricityPrice } from "@/app/types/ElectricityPrice";
import { MdOutlineElectricBolt } from "react-icons/md";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";
import { BiStats } from "react-icons/bi";

interface PriceHighlightsProps {
  cheapestHour: ElectricityPrice | null;
  mostExpensiveHour: ElectricityPrice | null;
  prices: ElectricityPrice[];
  isTomorrow?: boolean;
}

export default function PriceHighlights({
  cheapestHour,
  mostExpensiveHour,
  prices,
  isTomorrow = false,
}: PriceHighlightsProps) {
  const getCurrentPrice = (prices: ElectricityPrice[]) => {
    if (!prices.length) return null;

    const now = new Date();
    return (
      prices.find((price) =>
        isWithinInterval(now, {
          start: parseISO(price.time_start),
          end: parseISO(price.time_end),
        })
      ) || null
    );
  };

  const calculateAveragePrice = (prices: ElectricityPrice[]) => {
    if (!prices.length) return null;
    const sum = prices.reduce((acc, price) => acc + price.NOK_per_kWh, 0);
    return sum / prices.length;
  };

  const currentPrice = getCurrentPrice(prices);
  const averagePrice = calculateAveragePrice(prices);

  const renderMiddleSection = () => {
    if (isTomorrow && averagePrice) {
      return (
        <>
          <h3>
            <BiStats />
            {averagePrice.toFixed(2)} kr
          </h3>
          <p>Gjennomsnitt</p>
        </>
      );
    }

    if (currentPrice) {
      return (
        <>
          <h3>
            <MdOutlineElectricBolt />
            {currentPrice.NOK_per_kWh.toFixed(2)} kr
          </h3>
          <p>Nåværende</p>
        </>
      );
    }

    return <p>Priser ikke tilgjengelig</p>;
  };

  return (
    <article className="price-highlights">
      <section className="cheapest-hour">
        {cheapestHour ? (
          <>
            <h3>
              <FaArrowTrendDown />
              {cheapestHour.NOK_per_kWh.toFixed(2)} kr
            </h3>
            <p>
              {format(parseISO(cheapestHour.time_start), "HH:mm")} -
              {format(parseISO(cheapestHour.time_end), "HH:mm")}
            </p>
          </>
        ) : (
          <p>Priser ikke tilgjengelig</p>
        )}
      </section>

      <section className="current-price">{renderMiddleSection()}</section>

      <section className="most-expensive-hour">
        {mostExpensiveHour ? (
          <>
            <h3>
              <FaArrowTrendUp />
              {mostExpensiveHour.NOK_per_kWh.toFixed(2)} kr
            </h3>
            <p>
              {format(parseISO(mostExpensiveHour.time_start), "HH:mm")} -
              {format(parseISO(mostExpensiveHour.time_end), "HH:mm")}
            </p>
          </>
        ) : (
          <p>Priser ikke tilgjengelig</p>
        )}
      </section>
    </article>
  );
}
