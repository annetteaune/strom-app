import { PRICE_AREAS, PriceArea } from "@/app/types/ElectricityPrice";

export default function AreaSelector({
  selectedArea,
  setSelectedArea,
}: {
  selectedArea: PriceArea;
  setSelectedArea: (area: PriceArea) => void;
}) {
  return (
    <div className="area-selector">
      <label htmlFor="area-select">Velg prisområde: </label>
      <select
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
  );
}
