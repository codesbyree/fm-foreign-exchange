export type ConversionLogType = {
  id: string;
  time: string;
  base_currency: string;
  target_currency: string;
  base_amount: string;
  converted_amount: string;
};

export interface ExchangeRateResponse {
  quote: string;
  base: string;
  date: string;
  rate: number;
}

export type FavoriteConversionType = ExchangeRateResponse & {
  id: string;
  diff: string;
  growth: "positive" | "negative" | "unchanged";
  growth_percentage: string;
};

export interface CrawlerData extends ExchangeRateResponse {
  diff: string;
  growth: "positive" | "negative" | "unchanged";
  growth_percentage: string;
  id: string;
}
