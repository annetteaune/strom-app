import { format, parseISO } from "date-fns";

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
}

export default function PricesTable({ prices }: PricesTableProps) {
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
        {prices.map((price, index) => (
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
  );
}
