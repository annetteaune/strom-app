import { format, parseISO, isWithinInterval } from "date-fns";

interface PriceWithPercentage {
  time_start: string;
  time_end: string;
  NOK_per_kWh: number;
  pricePercentage: number;
  isCheapestHour: boolean;
  isMostExpensiveHour: boolean;
}

interface PricesTableProps {
  prices: PriceWithPercentage[];
  showCurrentHour?: boolean;
}

export default function PricesTable({
  prices,
  showCurrentHour = true,
}: PricesTableProps) {
  const isCurrentHour = (timeStart: string, timeEnd: string) => {
    if (!showCurrentHour) return false;

    const now = new Date();
    const start = parseISO(timeStart);
    const end = parseISO(timeEnd);

    return isWithinInterval(now, { start, end });
  };

  return (
    <table className="prices-table">
      <thead>
        <tr>
          <th>Tid</th>
          <th>Pris (NOK/kWh)</th>
          <th>Prisnivå</th>
        </tr>
      </thead>
      <tbody>
        {prices.map((price, index) => {
          const current = isCurrentHour(price.time_start, price.time_end);

          return (
            <tr
              key={index}
              className={`
                ${price.isCheapestHour ? "cheapest-hour" : ""}
                ${price.isMostExpensiveHour ? "expensive-hour" : ""}
                ${current ? "current-hour" : ""}
              `.trim()}
            >
              <td>
                {format(parseISO(price.time_start), "HH:mm")} -
                {format(parseISO(price.time_end), "HH:mm")}
                {current && <span className="current-indicator">Nå</span>}
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
          );
        })}
      </tbody>
    </table>
  );
}
