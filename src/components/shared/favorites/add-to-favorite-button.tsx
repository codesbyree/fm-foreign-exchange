import { StarIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useFavoriteConversionStore } from "../../../stores/use-favorites-conversion.store";

import { Button } from "../../ui/button";
import { useSearchParams } from "react-router";

export default function AddToFavoriteButton() {
  const favorites = useFavoriteConversionStore((s) => s.favorites);
  const addToFavorite = useFavoriteConversionStore((s) => s.addToFavorite);
  const removeFromFavorite = useFavoriteConversionStore((s) => s.removeFromFavorite);

  const [searchParams] = useSearchParams();
  const baseCurrency = searchParams.get("base");
  const quoteCurrency = searchParams.get("quote");

  if (!baseCurrency || !quoteCurrency) return null;
  const isFavorite = favorites.filter((i) => i.id === (baseCurrency + quoteCurrency).toLowerCase()).length > 0;

  const toggle = () => {
    if (isFavorite) removeFromFavorite(baseCurrency + quoteCurrency);
    else addToFavorite(baseCurrency, quoteCurrency);
  };

  return (
    <Button intent={isFavorite ? "primary" : "secondary"} onClick={toggle}>
      <HugeiconsIcon icon={StarIcon} className="w-3" fill="currentColor" />
      {isFavorite ? "FAVORITED" : "FAVORITE"}
    </Button>
  );
}
