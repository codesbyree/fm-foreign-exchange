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

  const { exchangeRate, setExchangeRate, sendAmountDisplay, receiveAmountDisplay, setSendAmountDisplay, setReceiveAmountDisplay } = useCurrencyStore(
    useShallow((s) => ({
      exchangeRate: s.exchangeRate,
      setExchangeRate: s.setExchangeRate,
      sendAmountDisplay: s.sendAmountDisplay,
      receiveAmountDisplay: s.receiveAmountDisplay,
      setSendAmountDisplay: s.setSendAmountDisplay,
      setReceiveAmountDisplay: s.setReceiveAmountDisplay,
    })),
  );

  const handleClick = () => {
    const sendQuery = searchParams.get("send");
    const receiveQuery = searchParams.get("receive");

    setSearchParams((searchParam) => {
      if (receiveQuery) searchParam.set("send", receiveQuery);
      if (sendQuery) searchParam.set("receive", sendQuery);
      return searchParam;
    });

    if (exchangeRate > 0) {
      setExchangeRate(1 / exchangeRate);
    }

    setSendAmountDisplay(receiveAmountDisplay);
    setReceiveAmountDisplay(sendAmountDisplay);

    setRotation((prev) => prev + 180);
  };

  return (
    <Button size="icon-xl" intent="secondary" onClick={handleClick} className="shrink-0">
      <motion.span animate={{ rotate: rotation }} transition={{ duration: 0.3, ease: "easeInOut" }} className="inline-flex rotate-90 md:rotate-0">
        <HugeiconsIcon icon={ArrowLeftRightIcon} size={20} />
      </motion.span>
    </Button>
  );
}
