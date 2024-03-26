import currenciesData from "@/src/jsons/currencies.json";
import { Currencies } from "@/src/types/Currencies";

export const convertCurrencyName = (
  currency: string | undefined,
  to: "sigle" | "key_from_sigle" | "key_from_name" | "name"
) => {
  const currencies = currenciesData as Currencies;
  // Use the provided currency or default to "usd" if it's undefined
  const currencyKey = currency ?? "usd";
  if (to === "sigle") return currencies[currencyKey]?.sigle;
  if (to === "name") return currencies[currencyKey]?.name;
  // We search key from value or sigle
  if (to === "key_from_sigle") {
    return Object.keys(currencies).find(
      (key) => currencies[key]?.sigle === currencyKey
    );
  }
  if (to === "key_from_name") {
    return Object.keys(currencies).find(
      (key) => currencies[key]?.name === currencyKey
    );
  }
};