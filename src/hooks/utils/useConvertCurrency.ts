import currenciesData from "@/src/jsons/currencies.json";
import { Currencies } from "@/src/types/Currencies";

type ConvertCurrencyProps = {
  to: "sigle" | "key_from_sigle" | "key_from_name" | "name";
  currency:
    | "eur"
    | "usd"
    | "cad"
    | "gbp"
    | "aud"
    | "jpy"
    | "cny"
    | "chf"
    | "sek"
    | "nok"
    | "dkk"
    | "rub"
    | "inr"
    | "brl"
    | "zar"
    | "try"
    | "sgd"
    | "hkd"
    | "idr"
    | "krw"
    | "mxn"
    | "myr"
    | "php"
    | "thb"
    | "vnd"
    | "pln"
    | "czk"
    | "huf"
    | "ils"
    | "nzd"
    | "clp"
    | "cop"
    | "ars"
    | "pen"
    | "uah"
    | "kzt"
    | "kgs"
    | "uzs"
    | "azn"
    | "gel"
    | "amd"
    | "byn"
    | "mdl"
    | "tjs"
    | "afn"
    | "irr"
    | "iqd"
    | "sar"
    | "qar"
    | "omr"
    | "bhd"
    | "jod"
    | "lbp"
    | "egp"
    | "lyd"
    | "dzd"
    | "mad"
    | "tnd"
    | "sdg"
    | "etb"
    | "kes"
    | "ugx"
    | "tzs"
    | "mga"
    | "mru"
    | "xof"
    | "xaf"
    | string;
};

export const useConvertCurrency = ({ currency, to }: ConvertCurrencyProps) => {
  const currencies = currenciesData as Currencies;
  const currencyKey = currency ?? "usd";

  const convertCurrency = (
    to: "sigle" | "key_from_sigle" | "key_from_name" | "name"
  ) => {
    if (to === "sigle") return currencies[currencyKey]?.sigle;
    if (to === "name") return currencies[currencyKey]?.name;
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
    return undefined;
  };

  return convertCurrency;
};
