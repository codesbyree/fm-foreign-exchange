import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckIcon } from "@hugeicons/core-free-icons";

import { useConversionLogStore } from "../../stores/use-conversion-log.store";

import { Button } from "../ui/button";
import { useCurrencyStore } from "../../stores/use-currency.store";
import { useSearchParams } from "react-router";

export default function AddConversionLogButton() {
  const [searchParams] = useSearchParams();

  const saveToLog = useConversionLogStore((s) => s.saveToLog);
  const baseAmount = useCurrencyStore((s) => s.sendAmountDisplay);
  const convertedAmount = useCurrencyStore((s) => s.receiveAmountDisplay);

  const [logged, setLogged] = useState(false);

  const logConversion = () => {
    saveToLog({
      base_amount: baseAmount,
      converted_amount: convertedAmount,
      base_currency: searchParams.get("send") as string,
      target_currency: searchParams.get("receive") as string,
    });

    setLogged(true);
    setTimeout(() => {
      setLogged(false);
    }, 800);
  };

  return (
    <Button intent={logged ? "primary" : "outline"} onClick={logConversion} className="min-w-38">
      {logged ? (
        <>
          <HugeiconsIcon icon={CheckIcon} width={16} />
          <span className="capitalize">Logged</span>
        </>
      ) : (
        <span>LOG CONVERSION</span>
      )}
    </Button>
  );
}
