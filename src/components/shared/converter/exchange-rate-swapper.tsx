import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeftRightIcon } from "@hugeicons/core-free-icons";
import { motion } from "motion/react";

import { Button } from "../../ui/button";
import { useSearchParams } from "react-router";
import { useCurrencyStore } from "../../../stores/use-currency.store";
import { useShallow } from "zustand/react/shallow";

export default function ExchangeRateSwapper() {
  const [rotation, setRotation] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  const { exchangeRate, setExchangeRate, baseAmountDisplay, quoteAmountDisplay, setBaseAmountDisplay, setQuoteAmountDisplay } = useCurrencyStore(
    useShallow((s) => ({
      exchangeRate: s.exchangeRate,
      setExchangeRate: s.setExchangeRate,
      baseAmountDisplay: s.baseAmountDisplay,
      quoteAmountDisplay: s.quoteAmountDisplay,
      setBaseAmountDisplay: s.setBaseAmountDisplay,
      setQuoteAmountDisplay: s.setQuoteAmountDisplay,
    })),
  );

  const handleClick = () => {
    const sendQuery = searchParams.get("base");
    const receiveQuery = searchParams.get("quote");

    setSearchParams((searchParam) => {
      if (receiveQuery) searchParam.set("base", receiveQuery);
      if (sendQuery) searchParam.set("quote", sendQuery);
      return searchParam;
    });

    if (exchangeRate > 0) setExchangeRate(1 / exchangeRate);

    setBaseAmountDisplay(quoteAmountDisplay);
    setQuoteAmountDisplay(baseAmountDisplay);

    setRotation((prev) => prev + 180);
  };

  return (
    <Button size="icon-xl" intent="secondary" onClick={handleClick} className="shrink-0">
      <motion.span animate={{ rotate: rotation }} transition={{ type: "spring", stiffness: 320, damping: 32 }} className="inline-flex rotate-90 md:rotate-0">
        <HugeiconsIcon icon={ArrowLeftRightIcon} size={20} />
      </motion.span>
    </Button>
  );
}
