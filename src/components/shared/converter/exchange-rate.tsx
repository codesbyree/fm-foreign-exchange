import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { getExchangeRate } from "../../../helpers/api.helper";
import { formatCurrency, unformatToNumber } from "../../../utils/currency.utils";
import { useCurrencyStore } from "../../../stores/use-currency.store";
import { useShallow } from "zustand/react/shallow";

export default function ExchangeRate() {
  const [searchParams] = useSearchParams();

  const { setExchangeRate, setReceiveAmountDisplay, sendAmountDisplay } = useCurrencyStore(
    useShallow((s) => ({
      setExchangeRate: s.setExchangeRate,
      setReceiveAmountDisplay: s.setReceiveAmountDisplay,
      sendAmountDisplay: s.sendAmountDisplay,
      receiveAmountDisplay: s.receiveAmountDisplay,
    })),
  );

  const baseCurrency = searchParams.get("send");
  const targetCurrency = searchParams.get("receive");

  // 1. Track previous currencies to detect a direct swap
  const prevBase = useRef(baseCurrency);
  const prevTarget = useRef(targetCurrency);
  const isSwap = useRef(false);

  useEffect(() => {
    // If the new base is the old target AND the new target is the old base, it was a swap
    if (prevBase.current === targetCurrency && prevTarget.current === baseCurrency) {
      isSwap.current = true;
    } else {
      isSwap.current = false;
    }
    prevBase.current = baseCurrency;
    prevTarget.current = targetCurrency;
  }, [baseCurrency, targetCurrency]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["exchangeRate", baseCurrency, targetCurrency],
    queryFn: () => getExchangeRate(baseCurrency as string, targetCurrency as string),
    enabled: !!baseCurrency && !!targetCurrency,
    staleTime: 5 * 60 * 1000,
  });

  const sendAmountRef = useRef(sendAmountDisplay);
  sendAmountRef.current = sendAmountDisplay;

  useEffect(() => {
    if (data) {
      setExchangeRate(data.rate);

      // 2. ONLY recalculate if it WAS NOT a swap.
      // If it was a swap, Comp 2 already perfectly flipped the display strings.
      if (!isSwap.current) {
        const currentAmount = unformatToNumber(sendAmountRef.current);
        if (!isNaN(currentAmount)) {
          setReceiveAmountDisplay(formatCurrency(currentAmount * data.rate));
        }
      }

      // 3. Reset the swap flag so future manual typing/dropdown changes work normally
      isSwap.current = false;
    }
  }, [data, setExchangeRate, setReceiveAmountDisplay]);

  if (isLoading || isFetching) return <div className="h-3.75 w-30 rounded-xs bg-neutral-400 animate-pulse" />;
  if (!data) return null;

  return (
    <p className="text-center text-neutral-50 text-2xs uppercase">
      1 {baseCurrency} = {formatCurrency(data.rate)} {targetCurrency}
    </p>
  );
}
