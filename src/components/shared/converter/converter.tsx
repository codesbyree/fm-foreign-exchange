import ExchangeRate from "./exchange-rate";
import ExchangeRateCard from "./exchange-rate-card";
import ExchangeRateSwapper from "./exchange-rate-swapper";
import AddConversionLogButton from "../conversion-log/add-conversion-log-button";
import AddToFavoriteButton from "../favorites/add-to-favorite-button";

export default function Converter() {
  return (
    <section className="shadow-md rounded-[20px] bg-neutral-700">
      <div className="p-4 md:p-5 flex flex-col md:flex-row gap-4 md:gap-6 border-b border-dashed border-neutral-500 items-center">
        <ExchangeRateCard type="base" label="send" />
        <ExchangeRateSwapper />
        <ExchangeRateCard type="quote" label="receive" />
      </div>

      <div className="p-4 md:p-5 flex flex-col md:flex-row items-center gap-4 md:justify-between">
        <ExchangeRate />

        <div className="flex gap-2">
          <AddToFavoriteButton />
          <AddConversionLogButton />
        </div>
      </div>
    </section>
  );
}
