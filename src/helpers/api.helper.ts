export interface ExchangeRateResponse {
  quote: string;
  base: string;
  date: string;
  rate: number;
}

const API_BASE_URL = "https://api.frankfurter.dev/v2";

/**
 * Pauses execution for a specified number of milliseconds.
 *
 * @param ms - The number of milliseconds to wait
 * @returns A promise that resolves after the delay completes
 */
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetches the current exchange rate between two currencies.
 *
 * @param baseCurrency - The currency code to convert from (e.g., 'USD')
 * @param targetCurrency - The currency code to convert to (e.g., 'EUR')
 * @returns A promise that resolves to the exchange rate data
 * @throws {Error} If the network request fails, inputs are invalid, or the API returns an error
 */
export async function getExchangeRate(baseCurrency: string, targetCurrency: string): Promise<ExchangeRateResponse> {
  if (!baseCurrency || !targetCurrency) {
    throw new Error("Both base and target currencies are required.");
  }

  const url = `${API_BASE_URL}/rate/${baseCurrency.toUpperCase()}/${targetCurrency.toUpperCase()}`;

  try {
    await delay(500);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as ExchangeRateResponse;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch exchange rate: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while fetching the exchange rate.");
  }
}
