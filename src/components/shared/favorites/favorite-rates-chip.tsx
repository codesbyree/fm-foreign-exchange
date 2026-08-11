import { useFavoriteConversionStore } from "../../../stores/use-favorites-conversion.store";
import { TabMenuNotification } from "../tab-menu";

export default function FavoriteRatesChip() {
  const favoriteConversions = useFavoriteConversionStore((s) => s.favorites);
  if (!favoriteConversions.length) return null;
  return <TabMenuNotification>{favoriteConversions.length}</TabMenuNotification>;
}
