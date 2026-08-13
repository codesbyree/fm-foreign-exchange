export type RateGrowthType = "positive" | "negative" | "unchanged";

export type DateRangeTypes = "1d" | "1w" | "1m" | "3m" | "1y" | "5y";

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

export interface RateComparison extends Omit<ExchangeRateType, "date"> {
  image: string;
  label: string;
}

export interface TodayRates extends Omit<ExchangeRateType, "date"> {
  growth: RateGrowthType;
  growth_percentage: string;
}

export interface FavoriteConversion extends Omit<ExchangeRateType, "date" | "rate"> {
  id: string;
}

export interface CrawlerData extends ExchangeRateType {
  diff: string;
  growth: RateGrowthType;
  growth_percentage: string;
  id: string;
}

export interface RateHistoryData {
  open: number;
  last: number;
  change: string;
  growth: RateGrowthType;
  growth_percentage: string;
  chart_data: { time: string; value: number }[];
}
