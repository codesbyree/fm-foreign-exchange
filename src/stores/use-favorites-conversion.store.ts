import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FavoriteConversion } from "../types/app.types";

interface Store {
  favorites: FavoriteConversion[];
  addToFavorite: (base: string, quote: string) => void;
  removeFromFavorite: (id: string) => void;
  clearFavorites: () => void;
}

export const useFavoriteConversionStore = create<Store>()(
  persist(
    (set) => ({
      favorites: [],
      addToFavorite: (base, quote) =>
        set((state) => {
          const isExist = state.favorites.find((item) => item.id === base + quote);
          if (isExist) return state;
          else return { favorites: [{ id: base + quote, base, quote }, ...state.favorites] };
        }),
      removeFromFavorite: (id) => set((state) => ({ favorites: state.favorites.filter((fav) => fav.id !== id) })),
      clearFavorites: () => set(() => ({ favorites: [] })),
    }),
    {
      name: "save-conversion",
      partialize: (state) => ({
        favorites: state.favorites,
      }),
    },
  ),
);
