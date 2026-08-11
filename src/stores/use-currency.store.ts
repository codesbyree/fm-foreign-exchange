import { create } from "zustand";
import { persist } from "zustand/middleware";
import { currencies, type Currency } from "../config/currency.config";

interface CurrencyState {
  popularCurrencies: Currency[];
  addPopularCurrency: (currency: Currency) => void;
  exchangeRate: number;
  setExchangeRate: (rate: number) => void;
  sendAmountDisplay: string;
  quoteAmountDisplay: string;
  setBaseAmountDisplay: (display: string) => void;
  setQuoteAmountDisplay: (display: string) => void;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      exchangeRate: 1,
      setExchangeRate: (rate: number) => set({ exchangeRate: rate }),
      popularCurrencies: currencies.slice(0, 3),
      addPopularCurrency: (currency) =>
        set((state) => {
          const filtered = state.popularCurrencies.filter((c) => c.code !== currency.code);
          return {
            popularCurrencies: [currency, ...filtered].slice(0, 3),
          };
        }),
      sendAmountDisplay: "0",
      quoteAmountDisplay: "0",
      setBaseAmountDisplay: (display: string) => set({ sendAmountDisplay: display }),
      setQuoteAmountDisplay: (display: string) => set({ quoteAmountDisplay: display }),
    }),
    {
      name: "popular-currency-storage",
      partialize: (state) => ({
        popularCurrencies: state.popularCurrencies,
      }),
    },
  ),
);
