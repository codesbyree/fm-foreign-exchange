import moment from "moment";
import type { CrawlerData, ExchangeRateType, TodayRates } from "../types/app.types";

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
  const yesterday = moment().subtract(7, "days").format("YYYY-MM-DD");

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

      crawlerData.push({
        id: td.id,
        quote: td.quote,
        base: td.base,
        date: td.date,
        rate: td.rate,
        diff: td.rate.toFixed(2),
        growth,
        growth_percentage: `${growthPercentage.toFixed(2)}%`,
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
    await delay(300);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as ExchangeRateType[];
    const [previous, current] = data;

    const todaysRates: TodayRates = {
      base: current.base,
      quote: current.quote,
      rate: current.rate,
      growth: current.rate - previous.rate > previous.rate ? "positive" : current.rate - previous.rate < previous.rate ? "negative" : "unchanged",
      growth_percentage: `${(current.rate - previous.rate).toFixed(2)}%`,
    };

    return todaysRates;
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
    await delay(300);

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
