import { format, parseISO } from "date-fns";
import { ElectricityPrice } from "@/app/types/ElectricityPrice";

interface PriceHighlightsProps {
  cheapestHour: ElectricityPrice | null;
  mostExpensiveHour: ElectricityPrice | null;
}

export default function PriceHighlights({
  cheapestHour,
  mostExpensiveHour,
}: PriceHighlightsProps) {
  return (
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
  );
}
