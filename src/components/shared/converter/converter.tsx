import { StarIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "../../ui/button";
import ExchangeRateCard from "./exchange-rate-card";
import ExchangeRateSwapper from "./exchange-rate-swapper";
import ExchangeRate from "./exchange-rate";

export default function Converter() {
  return (
    <section className="shadow-md rounded-[20px] bg-neutral-700">
      <div className="p-4 md:p-5 flex flex-col md:flex-row gap-4 md:gap-6 border-b border-dashed border-neutral-500 items-center">
        <ExchangeRateCard type="send" />
        <ExchangeRateSwapper />
        <ExchangeRateCard type="receive" />
      </div>

      <div className="p-4 md:p-5 flex flex-col md:flex-row items-center gap-4 md:justify-between">
        <ExchangeRate />

        <div className="flex gap-2">
          <Button intent="primary">
            <HugeiconsIcon icon={StarIcon} className="w-3" fill="currentColor" />
            FAVORITED
          </Button>
          <Button intent="outline">LOG CONVERSION</Button>
        </div>
      </div>
    </section>
  );
}
