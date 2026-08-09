export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { maximumSignificantDigits: 4 }).format(value);
}

export function unformatToNumber(value: string): number {
  return parseFloat(value.toString().replace(/,/g, ""));
}

export function isValidDecimal(value: string) {
  return value.endsWith(".") || value === "." || value.match(/\.\d*0$/);
}

export const formatNumber = (num: string) => {
  return num === "" ? "" : Number(num).toLocaleString("en-US");
};
