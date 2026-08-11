import { HugeiconsIcon } from "@hugeicons/react";
import { StarIcon } from "@hugeicons/core-free-icons";
import { motion, AnimatePresence } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";

import { cn } from "../utils/style.utils";
import { getRatesComparison } from "../helpers/api.helper";
import { type RateComparison } from "../types/app.types";
import { useCurrencyStore } from "../stores/use-currency.store";
import { formatCurrency, unformatToNumber } from "../utils/currency.utils";
import { useFavoriteConversionStore } from "../stores/use-favorites-conversion.store";

import { Button } from "../components/ui/button";
import { Empty, EmptyDescription, EmptyTitle } from "../components/ui/empty";

export default function ComparePage() {
  const [searchParams] = useSearchParams();
  const baseCurrency = searchParams.get("base");

  const { data, isLoading } = useQuery({
    queryKey: ["compare"],
    queryFn: () => getRatesComparison(baseCurrency!),
    enabled: !!baseCurrency,
    staleTime: 1 * 60 * 1000,
  });

  if (isLoading)
    return (
      <Empty>
        <EmptyTitle>We are fetching some data...</EmptyTitle>
        <EmptyDescription>
          Please be patient while we fetch the comparison data.
          <br className="hidden md:block" /> It might take a while.
        </EmptyDescription>
      </Empty>
    );

  if (!data?.length)
    return (
      <Empty>
        <EmptyTitle>No comparison available</EmptyTitle>
        <EmptyDescription>
          Enter an amount in SEND above to see what your
          <br className="hidden md:block" /> money is worth in other currencies.
        </EmptyDescription>
      </Empty>
    );

  return (
    <motion.section initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="px-4 py-5 rounded-2xl flex flex-col gap-5 md:px-5 bg-neutral-700 border border-neutral-600">
      <div className="flex felx-col md:flex-row md:justify-between gap-2.5">
        <h3 className="tracking-widest uppercase">
          <span className="text-sm text-neutral-200 mr-3">Multi-Currency</span>
          <BaseAmountViewer />
        </h3>
        <p className="text-xs uppercase text-neutral-50/70">{data.length} PAIRS</p>
      </div>

      <motion.ul layout className="flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {data.map((data) => (
            <ComparisonListItem key={data.label} data={data} />
          ))}
        </AnimatePresence>
      </motion.ul>
    </motion.section>
  );
}

function BaseAmountViewer() {
  const [searchParams] = useSearchParams();
  const baseCurrency = searchParams.get("base");

  const baseAmountDisplay = useCurrencyStore((s) => s.baseAmountDisplay);

  return (
    <span className="text-neutral-50 text-base">
      {baseAmountDisplay} from {baseCurrency}
    </span>
  );
}

type ComparisonListItemProps = {
  data: RateComparison;
};

function ComparisonListItem(props: ComparisonListItemProps) {
  const [, setSearchParams] = useSearchParams();

  const favorites = useFavoriteConversionStore((s) => s.favorites);
  const removeFromFavorite = useFavoriteConversionStore((s) => s.removeFromFavorite);
  const addToFavorite = useFavoriteConversionStore((s) => s.addToFavorite);
  const setQuoteAmount = useCurrencyStore((s) => s.setQuoteAmountDisplay);
  const setExchangeRate = useCurrencyStore((s) => s.setExchangeRate);
  const baseAmount = useCurrencyStore((s) => s.baseAmountDisplay);

  const isFavorite = favorites.filter((fav) => fav.id === props.data.base.toLocaleLowerCase() + props.data.quote.toLowerCase()).length > 0;
  const { data } = props;

  const quoteAmount = formatCurrency(unformatToNumber(baseAmount) * data.rate);

  const toggleFavorite = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent the parent li's onClick from firing
    if (isFavorite) removeFromFavorite(data.base + data.quote);
    else addToFavorite(data.base, data.quote);
  };

  const replaceQuote = () => {
    setQuoteAmount(quoteAmount);
    setExchangeRate(data.rate);
    setSearchParams({ base: data.base, quote: data.quote });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLLIElement>) => {
    // Trigger action on Enter or Space
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      replaceQuote();
    }
  };

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ type: "spring", stiffness: 320, damping: 32 }}
      tabIndex={0}
      className="cursor-pointer flex bg-neutral-600 border border-neutral-500 hover:border-neutral-300 transition-all rounded-[10px] p-3 py-2 gap-1.5 md:gap-5 md:p-4 md:py-2 items-center outline outline-transparent focus-visible:outline-lime-500" // Changed focus to focus-visible
      onClick={replaceQuote}
      onKeyDown={handleKeyDown}
    >
      <img src={data.image} alt="" className="w-6 h-6 rounded-full" />

      <div className="text-sm flex flex-col tracking-wide flex-1">
        <p className="uppercase text-neutral-50">{data.quote}</p>
        <p className="text-neutral-200 text-xs">{data.label}</p>
      </div>

      <div className="flex flex-col text-base tracking-wide items-end">
        <p className="text-neutral-100">{quoteAmount}</p>
        <p className="text-2xs text-neutral-200">@ {data.rate.toFixed(2)}</p>
      </div>

      <Button intent={isFavorite ? "outline" : "secondary"} size="icon" className={cn(isFavorite && "text-lime-500!")} onClick={toggleFavorite} onKeyDown={(e) => e.stopPropagation()}>
        <HugeiconsIcon icon={StarIcon} size={12} fill="currentColor" />
      </Button>
    </motion.li>
  );
}
