export type ConversionLogType = {
  id: string;
  time: string;
  base_currency: string;
  target_currency: string;
  base_amount: string;
  converted_amount: string;
};

export type ExchangeRateType = {
  quote: string;
  base: string;
  date: string;
  rate: number;
};

export interface TodayRates extends Omit<ExchangeRateType, "date"> {
  growth: "positive" | "negative" | "unchanged";
  growth_percentage: string;
}

export interface FavoriteConversion extends Omit<ExchangeRateType, "date" | "rate"> {
  id: string;
}

export interface CrawlerData extends ExchangeRateType {
  diff: string;
  growth: "positive" | "negative" | "unchanged";
  growth_percentage: string;
  id: string;
}
