import { PRICE_AREAS, PriceArea } from "@/app/types/ElectricityPrice";

export default function AreaSelector({
  selectedArea,
  setSelectedArea,
}: {
  selectedArea: PriceArea;
  setSelectedArea: (area: PriceArea) => void;
}) {
  return (
    <div className="area-selector" role="region" aria-label="Velg prisområde">
      <label htmlFor="area-select" id="area-label">
        Prisområde:{" "}
      </label>
      <select
        id="area-select"
        value={selectedArea}
        onChange={(e) => setSelectedArea(e.target.value as PriceArea)}
        aria-labelledby="area-label"
        aria-describedby="area-description"
      >
        {PRICE_AREAS.map((area) => (
          <option key={area.code} value={area.code}>
            {area.name}
          </option>
        ))}
      </select>
      <span id="area-description" className="sr-only">
        Velg ditt strømprisområde for å se gjeldende priser
      </span>
    </div>
  );
}
