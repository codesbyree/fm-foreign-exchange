import moment from "moment";
import type { CrawlerData, DateRangeTypes, ExchangeRateType, RateComparison, RateGrowthType, RateHistoryData, TodayRates } from "../types/app.types";
import { currencies } from "../config/currency.config";

const API_BASE_URL = "https://api.frankfurter.dev/v2";
const BASE_CURRENCIES = ["EUR", "USD", "GBP", "JPY", "IDR"];

/**
 * Pauses execution for a specified number of milliseconds.
 *
 * @param ms - The number of milliseconds to wait
 * @returns A promise that resolves after the delay completes
 */
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetches the current exchange rate of the currencies between a time frames.
 *
 * @returns A promise that resolves to the exchange rate data in time series
 * @throws {Error} If the network request fails, inputs are invalid, or the API returns an error
 */
export async function getCrawlerData(): Promise<CrawlerData[]> {
  const today = moment().format("YYYY-MM-DD");
  const yesterday = moment().subtract(1, "days").format("YYYY-MM-DD");

  try {
    const fetchRates = async (date: string, base: string) => {
      const res = await fetch(`${API_BASE_URL}/rates/?date=${date}&base=${base}`);
      if (!res.ok) {
        throw new Error(`API Error (${base}, ${date}): ${res.status} ${res.statusText}`);
      }
      const json = await res.json();
      if (!Array.isArray(json)) {
        throw new Error(`Unexpected API response shape for base ${base} on ${date}`);
      }
      return json as ExchangeRateType[];
    };

    // fetch yesterday + today for every base currency, all in parallel
    const requests = BASE_CURRENCIES.flatMap((base) => [fetchRates(yesterday, base), fetchRates(today, base)]);
    const results = await Promise.all(requests);

    // results come back in [yesterday, today, yesterday, today, ...] order per base
    const yesterdayDataJson = results.filter((_, i) => i % 2 === 0).flat();
    const todayDataJson = results.filter((_, i) => i % 2 === 1).flat();

    const processedYesterdayData = yesterdayDataJson.map((x) => ({
      id: `${x.base}-${x.quote}`,
      ...x,
    }));
    const processedTodayData = todayDataJson.map((x) => ({
      id: `${x.base}-${x.quote}`,
      ...x,
    }));

    const yesterdayMap = new Map(processedYesterdayData.map((y) => [y.id, y]));

    const crawlerData: CrawlerData[] = [];

    for (const td of processedTodayData) {
      const yd = yesterdayMap.get(td.id);
      if (!yd) continue;

      const diff = td.rate - yd.rate;
      const growth: CrawlerData["growth"] = diff > 0 ? "positive" : diff < 0 ? "negative" : "unchanged";

      const growthPercentage = yd.rate !== 0 ? (diff / yd.rate) * 100 : 0;
      const sign = growthPercentage > 0 ? "+" : "";

      crawlerData.push({
        id: td.id,
        quote: td.quote,
        base: td.base,
        date: td.date,
        rate: td.rate,
        diff: td.rate.toFixed(2),
        growth,
        growth_percentage: `${sign}${growthPercentage.toFixed(2)}%`,
      });
    }

    return crawlerData;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch exchange rate: ${error.message}`, { cause: error });
    }
    throw new Error("An unexpected error occurred while fetching the exchange rate.", { cause: error });
  }
}

/**
 * Fetches the current exchange rate between two currencies, with a bit more details.
 *
 * @param base - The currency code to convert from (e.g., 'USD')
 * @param quote - The currency code to convert to (e.g., 'EUR')
 * @returns A promise that resolves to the exchange rate data
 * @throws {Error} If the network request fails, inputs are invalid, or the API returns an error
 */
export async function getTodayRate(base: string, quote: string): Promise<TodayRates> {
  if (!base || !quote) {
    throw new Error("Both base and target currencies are required.");
  }

  const url = `${API_BASE_URL}/rates?from=${moment().subtract(1, "days").format("YYYY-MM-DD")}&to=${moment().format("YYYY-MM-DD")}&base=${base.toUpperCase()}&quotes=${quote.toUpperCase()}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as [ExchangeRateType, ExchangeRateType | undefined];
    const [previous, current] = data;

    if (!current)
      return {
        base: previous.base,
        quote: previous.quote,
        rate: previous.rate,
        growth: "unchanged",
        growth_percentage: "0.00%",
      };

    return {
      base: current.base,
      quote: current.quote,
      rate: current.rate,
      growth: current.rate - previous.rate > previous.rate ? "positive" : current.rate - previous.rate < previous.rate ? "negative" : "unchanged",
      growth_percentage: `${(current.rate - previous.rate).toFixed(2)}%`,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch exchange rate: ${error.message}`, { cause: error });
    }
    throw new Error("An unexpected error occurred while fetching the exchange rate.", { cause: error });
  }
}

/**
 * Fetches all currency with base currency set.
 *
 * @param base - The currency code to convert from (e.g., 'USD')
 * @returns A promise that resolves to the exchange rate data
 * @throws {Error} If the network request fails, inputs are invalid, or the API returns an error
 */
export async function getRatesComparison(baseCurrency: string): Promise<RateComparison[]> {
  if (!baseCurrency) {
    throw new Error("Base currency is required.");
  }

  const url = `${API_BASE_URL}/rates?base=${baseCurrency.toUpperCase()}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as ExchangeRateType[];
    const processedData = data.map((x) => ({ id: x.base.toLowerCase() + x.quote.toLowerCase(), ...x }));

    const dataMap = new Map(processedData.map((y) => [y.id, y]));

    const comparisonData: RateComparison[] = [];

    for (const currency of currencies) {
      const data = dataMap.get(baseCurrency.toLowerCase() + currency.code);
      const isExist = comparisonData.filter((data) => data.quote.toLowerCase() === currency.code.toLowerCase()).length > 0;

      if (!data || isExist) continue;

      comparisonData.push({
        base: data.base,
        image: currency.image,
        label: currency.label,
        quote: data.quote,
        rate: data.rate,
      });
    }

    return comparisonData;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch exchange rate: ${error.message}`, { cause: error });
    }
    throw new Error("An unexpected error occurred while fetching the exchange rate.", { cause: error });
  }
}

/**
 * Fetches currency exchange rate history and calculates growth metrics.
 *
 * @param baseCurrency - The currency code to convert from (e.g., 'USD')
 * @param targetCurrency - The currency code to convert to (e.g., 'EUR')
 * @param duration - The time duration for the history (e.g., '1d', '1w', '1m', '3m', '1y', '5y')
 * @returns A promise that resolves to the calculated exchange rate data
 * @throws {Error} If the network request fails, inputs are invalid, or the API returns an error
 */
export async function getRatesHistory(baseCurrency: string, targetCurrency: string, duration: DateRangeTypes): Promise<RateHistoryData> {
  if (!baseCurrency || !targetCurrency) throw new Error("Both base and target currencies are required.");
  if (!duration) throw new Error("Duration is needed.");

  let fromDate = moment().subtract(1, "days");

  switch (duration) {
    case "1w":
      fromDate = moment().subtract(1, "weeks");
      break;
    case "1m":
      fromDate = moment().subtract(1, "months");
      break;
    case "3m":
      fromDate = moment().subtract(3, "months");
      break;
    case "1y":
      fromDate = moment().subtract(1, "years");
      break;
    case "5y":
      fromDate = moment().subtract(5, "years");
      break;
  }

  const url = `${API_BASE_URL}/rates?from=${fromDate.format("YYYY-MM-DD")}&base=${baseCurrency}&quotes=${targetCurrency}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as ExchangeRateType[];

    if (!data || data.length === 0) {
      throw new Error("No exchange rate data found for the specified period.");
    }

    const sortedData = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const open = sortedData[0].rate;
    const last = sortedData[sortedData.length - 1].rate;

    const changeValue = last - open;
    let growth: RateGrowthType = "unchanged";
    if (changeValue > 0) growth = "positive";
    else if (changeValue < 0) growth = "negative";

    const growthPercentageValue = open !== 0 ? (changeValue / open) * 100 : 0;

    const sign = growthPercentageValue > 0 ? "+" : "";
    const growthPercentageStr = `${sign}${growthPercentageValue.toFixed(2)}%`;
    const changeStr = `${sign}${changeValue.toFixed(2)}`;

    const chart_data = sortedData.map((item) => ({
      time: item.date,
      value: item.rate,
    }));

    return {
      open,
      last,
      change: changeStr,
      growth,
      growth_percentage: growthPercentageStr,
      chart_data,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch exchange rate: ${error.message}`, { cause: error });
    }
    throw new Error("An unexpected error occurred while fetching the exchange rate.", { cause: error });
  }
}

/**
 * Fetches the current exchange rate between two currencies.
 *
 * @param baseCurrency - The currency code to convert from (e.g., 'USD')
 * @param targetCurrency - The currency code to convert to (e.g., 'EUR')
 * @returns A promise that resolves to the exchange rate data
 * @throws {Error} If the network request fails, inputs are invalid, or the API returns an error
 */
export async function getExchangeRate(baseCurrency: string, targetCurrency: string): Promise<ExchangeRateType> {
  if (!baseCurrency || !targetCurrency) {
    throw new Error("Both base and target currencies are required.");
  }

  const url = `${API_BASE_URL}/rate/${baseCurrency.toUpperCase()}/${targetCurrency.toUpperCase()}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as ExchangeRateType;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch exchange rate: ${error.message}`, { cause: error });
    }
    throw new Error("An unexpected error occurred while fetching the exchange rate.", { cause: error });
  }
}
