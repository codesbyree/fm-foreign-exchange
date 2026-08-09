import { useState, useEffect, useMemo, type ComponentPropsWithoutRef, type SyntheticEvent } from "react";
import { useSearchParams } from "react-router";
import { useShallow } from "zustand/react/shallow";
import { AnimatePresence, motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ChevronDownIcon } from "@hugeicons/core-free-icons";

import { cn } from "../../../utils/style.utils";
import { currencies, type Currency } from "../../../config/currency.config";
import { useCurrencyStore } from "../../../stores/use-currency.store";

import Input from "../../ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSearchFilter, SelectTrigger } from "../../ui/select";
import { formatCurrency, unformatToNumber } from "../../../utils/currency.utils";

type Props = ComponentPropsWithoutRef<"div"> & {
  type: "send" | "receive";
};

export default function ExchangeRateCard(props: Props) {
  const { type, className } = props;

  const { popularCurrencies, addPopularCurrency, exchangeRate, sendAmountDisplay, receiveAmountDisplay, setSendAmountDisplay, setReceiveAmountDisplay } = useCurrencyStore(
    useShallow((s) => ({
      popularCurrencies: s.popularCurrencies,
      addPopularCurrency: s.addPopularCurrency,
      exchangeRate: s.exchangeRate,
      sendAmountDisplay: s.sendAmountDisplay,
      receiveAmountDisplay: s.receiveAmountDisplay,
      setSendAmountDisplay: s.setSendAmountDisplay,
      setReceiveAmountDisplay: s.setReceiveAmountDisplay,
    })),
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  const defaultCurrency = popularCurrencies[0] || currencies[0];

  useEffect(() => {
    if (!searchParams.get(type)) {
      setSearchParams(
        (prevParams) => {
          prevParams.set(type, defaultCurrency.code);
          return prevParams;
        },
        { replace: true },
      );
    }
  }, [searchParams, setSearchParams, type, defaultCurrency.code]);

  const selectedCurrency = useMemo(() => {
    const currencyCodeFromUrl = searchParams.get(type);

    if (currencyCodeFromUrl) {
      const found = currencies.find((c) => c.code.toLowerCase() === currencyCodeFromUrl.toLowerCase());
      if (found) return found;
    }

    return defaultCurrency;
  }, [searchParams, type, defaultCurrency]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
  };

  const handleSelect = (currency: Currency) => {
    setSearchParams((prevParams) => {
      prevParams.set(type, currency.code);
      return prevParams;
    });

    setSendAmountDisplay("0");
    setReceiveAmountDisplay("0");

    addPopularCurrency(currency);
    setSearchQuery("");
  };

  const filteredOtherCurrencies = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return currencies.filter((c) => c.code.toLowerCase().includes(query) || c.label.toLowerCase().includes(query));
  }, [searchQuery]);

  const handleChange = (e: SyntheticEvent) => {
    let { value } = e.currentTarget as HTMLInputElement;

    if (value === "") {
      setSendAmountDisplay("0");
      setReceiveAmountDisplay("0");
      return;
    }

    // Strip leading zeros if they are immediately followed by another number
    // This fixes the "01" -> "1" issue while preserving "0.x" decimals
    value = value.replace(/^0+(?=\d)/, "");

    if (value.endsWith(".")) {
      if (type === "send") setSendAmountDisplay(value);
      else setReceiveAmountDisplay(value);
      return;
    }

    const normalized = value.startsWith(".") ? `0${value}` : value;
    const raw = unformatToNumber(normalized);

    if (isNaN(raw)) return;

    if (type === "send") {
      setSendAmountDisplay(value);
      setReceiveAmountDisplay(formatCurrency(raw * exchangeRate));
    } else {
      setReceiveAmountDisplay(value);
      setSendAmountDisplay(formatCurrency(raw / (exchangeRate || 1)));
    }
  };

  return (
    <div className={cn("p-4 md:p-5 rounded-2xl bg-neutral-600 border border-neutral-500 space-y-5 w-full", className)}>
      <h2 className="uppercase text-sm text-neutral-100">{type}</h2>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full">
        <div className="flex-1">
          <label className="sr-only" htmlFor={type + "-value"}>
            Value
          </label>

          <Input
            onChange={handleChange}
            id={type + "-value"}
            type="text"
            inputMode="decimal"
            value={type === "send" ? sendAmountDisplay : receiveAmountDisplay}
            className={cn("text-3xl xl:text-4xl font-bold p-1", type === "receive" && "text-lime-500")}
          />
        </div>

        <Select>
          <SelectTrigger size="large">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={exchangeRate.toString()}
                className="flex items-center gap-2"
                initial={{ y: type === "send" ? -10 : 10, opacity: 0, filter: "blur(8px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                exit={{ y: type === "send" ? 10 : -10, opacity: 0, filter: "blur(8px)" }}
              >
                <img src={selectedCurrency.image} className="w-5 h-5 rounded-full shrink-0" alt="" />
                <span className="text-sm text-neutral-50 tracking-widest">{selectedCurrency.code}</span>
                <HugeiconsIcon icon={ChevronDownIcon} size={16} />
              </motion.span>
            </AnimatePresence>
          </SelectTrigger>

          <SelectContent className="w-78 md:w-94">
            <SelectSearchFilter placeholder="Search currencies..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />

            {!searchQuery && popularCurrencies.length > 0 && (
              <SelectGroup className="pb-0 pt-0.5">
                <SelectLabel>
                  <span>Popular</span>
                  <span>{popularCurrencies.length}</span>
                </SelectLabel>
                {popularCurrencies.map((currency) => (
                  <SelectItem key={`popular-${currency.label}`} onSelect={() => handleSelect(currency)}>
                    <div className="flex items-center gap-3">
                      <img className="w-5 h-5 rounded-full" src={currency.image} alt="" />
                      <p className="text-sm uppercase text-neutral-50">{currency.code}</p>
                      <p className="text-xs text-neutral-200 truncate">{currency.label}</p>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            )}

            <SelectGroup className="pt-0">
              <SelectLabel>
                <span>{searchQuery ? "Search Results" : "Other currencies"}</span>
                <span>{filteredOtherCurrencies.length}</span>
              </SelectLabel>

              {filteredOtherCurrencies.map((currency) => (
                <SelectItem key={currency.label} onSelect={() => handleSelect(currency)}>
                  <div className="flex items-center gap-3">
                    <img className="w-5 h-5 rounded-full" src={currency.image} alt="" />
                    <p className="text-sm uppercase text-neutral-50">{currency.code}</p>
                    <p className="text-xs text-neutral-200 truncate">{currency.label}</p>
                  </div>
                </SelectItem>
              ))}

              {filteredOtherCurrencies.length === 0 && <div className="p-4 text-center text-sm text-neutral-400">No currencies found.</div>}
            </SelectGroup>
          </SelectContent>
        </Select>
      </form>
    </div>
  );
}
