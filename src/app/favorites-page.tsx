import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon, EqualSignIcon, StarIcon, TriangleIcon } from "@hugeicons/core-free-icons";
import { motion, AnimatePresence } from "motion/react";
import { useQuery } from "@tanstack/react-query";

import { formatCurrency } from "../utils/currency.utils";
import { cn } from "../utils/style.utils";
import { useSearchParams } from "react-router";
import { getTodayRate } from "../helpers/api.helper";
import { type FavoriteConversion } from "../types/app.types";
import { useFavoriteConversionStore } from "../stores/use-favorites-conversion.store";

import { Button } from "../components/ui/button";
import { Empty, EmptyDescription, EmptyTitle } from "../components/ui/empty";
import { useCurrencyStore } from "../stores/use-currency.store";

export default function FavoritesPage() {
  const favoriteConversions = useFavoriteConversionStore((s) => s.favorites);

  if (!favoriteConversions.length)
    return (
      <Empty>
        <EmptyTitle>No pinned pairs yet</EmptyTitle>
        <EmptyDescription>
          Pin a pair to track its rate here. <br className="xl:block hidden" />
          Tap the star icon on any conversion or comparison row.
        </EmptyDescription>
      </Empty>
    );

  return (
    <motion.section initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="px-4 py-5 rounded-2xl flex flex-col gap-5 md:px-5 bg-neutral-700 border border-neutral-600">
      <div className="flex justify-between items-center gap-2.5">
        <h3 className="tracking-widest uppercase text-neutral-50 text-base">Pinned Pairs</h3>
        <p className="text-xs uppercase text-neutral-50/70">{favoriteConversions.length} FAVORITES</p>
      </div>

      <motion.ul layout className="flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {favoriteConversions.map((log) => (
            <FavoriteConversionItem key={log.id} favorite={log} />
          ))}
        </AnimatePresence>
      </motion.ul>
    </motion.section>
  );
}

type ConversionLogListItemProps = {
  favorite: FavoriteConversion;
};

function FavoriteConversionItem(props: ConversionLogListItemProps) {
  const [, setSearchParams] = useSearchParams();

  const removeFromFavorite = useFavoriteConversionStore((s) => s.removeFromFavorite);
  const setBaseAmountDisplay = useCurrencyStore((s) => s.setBaseAmountDisplay);
  const setQuoteAmountDisplay = useCurrencyStore((s) => s.setQuoteAmountDisplay);
  const setExchangeRate = useCurrencyStore((s) => s.setExchangeRate);
  const { favorite } = props;

  const { data, isLoading } = useQuery({
    queryKey: ["favorite-conversion", favorite.id],
    queryFn: () => getTodayRate(favorite.base, favorite.quote),
    enabled: !!favorite.base && !!favorite.quote,
    refetchInterval: 1 * 60 * 1000,
    staleTime: 1 * 60 * 1000,
  });

  const updateExchangeRate = () => {
    setSearchParams({ base: data?.base.toLowerCase() ?? "usd", quote: data?.quote.toLowerCase() ?? "idr" });
    setBaseAmountDisplay("0");
    setQuoteAmountDisplay("0");
    setExchangeRate(data?.rate ?? 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLLIElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      updateExchangeRate();
    }
  };

  if (isLoading) return <div className="flex bg-neutral-600 border border-neutral-500 rounded-[10px] h-14.75 animate-pulse" />;
  if (!data) return null;

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ type: "spring", stiffness: 320, damping: 32 }}
      tabIndex={0}
      className="cursor-pointer flex bg-neutral-600 border border-neutral-500 hover:border-neutral-300 transition-all rounded-[10px] p-3 py-2 gap-5 md:p-4 md:py-2 items-center outline outline-transparent focus-visible:outline-lime-500"
      onClick={updateExchangeRate}
      onKeyDown={handleKeyDown}
    >
      <div className="flex-1 flex justify-between">
        <div className="text-neutral-50 uppercase text-sm flex items-center gap-2 tracking-wide flex-1">
          <p>{favorite.base}</p>
          <HugeiconsIcon icon={ArrowRight02Icon} size={16} className="text-neutral-200" />
          <p>{favorite.quote}</p>
        </div>

        <div className="flex flex-col text-base tracking-wide items-end">
          <p className="text-neutral-100">{formatCurrency(data?.rate || 0)}</p>
          <p className={cn("text-2xs flex items-center gap-2", data?.growth === "positive" ? "text-lime-500" : data?.growth === "negative" ? "text-red-500" : "text-neutral-200")}>
            {data?.growth === "positive" ? (
              <HugeiconsIcon icon={TriangleIcon} aria-hidden="true" fill="currentColor" size={6} />
            ) : data?.growth === "negative" ? (
              <HugeiconsIcon icon={TriangleIcon} className={cn(data.growth === "negative" && "rotate-180")} aria-hidden="true" fill="currentColor" size={6} />
            ) : (
              <HugeiconsIcon icon={EqualSignIcon} aria-hidden="true" fill="currentColor" size={6} />
            )}
            <span>{data?.growth_percentage}</span>
          </p>
        </div>
      </div>

      <Button
        intent="outline"
        size="icon"
        className="text-lime-500!"
        onClick={(e) => {
          e.stopPropagation();
          removeFromFavorite(favorite.id);
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <HugeiconsIcon icon={StarIcon} size={12} fill="currentColor" />
      </Button>
    </motion.li>
  );
}
