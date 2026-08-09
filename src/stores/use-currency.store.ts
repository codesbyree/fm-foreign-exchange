import { create } from "zustand";
import { persist } from "zustand/middleware";
import { currencies, type Currency } from "../config/currency.config";

interface CurrencyState {
  popularCurrencies: Currency[];
  addPopularCurrency: (currency: Currency) => void;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      popularCurrencies: currencies.slice(0, 3),

      addPopularCurrency: (currency) =>
        set((state) => {
          const filtered = state.popularCurrencies.filter((c) => c.code !== currency.code);
          return {
            popularCurrencies: [currency, ...filtered].slice(0, 3),
          };
        }),
    }),
    {
      name: "popular-currency-storage",
    },
  ),
);
