import { create } from "zustand";
import { persist } from "zustand/middleware";
import { currencies, type Currency } from "../config/currency.config";

interface CurrencyState {
  popularCurrencies: Currency[];
  addPopularCurrency: (currency: Currency) => void;
  exchangeRate: number;
  setExchangeRate: (rate: number) => void;
  sendAmountDisplay: string;
  receiveAmountDisplay: string;
  setSendAmountDisplay: (display: string) => void;
  setReceiveAmountDisplay: (display: string) => void;
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
      receiveAmountDisplay: "0",
      setSendAmountDisplay: (display: string) => set({ sendAmountDisplay: display }),
      setReceiveAmountDisplay: (display: string) => set({ receiveAmountDisplay: display }),
    }),
    {
      name: "popular-currency-storage",
      partialize: (state) => ({
        popularCurrencies: state.popularCurrencies,
      }),
    },
  ),
);
