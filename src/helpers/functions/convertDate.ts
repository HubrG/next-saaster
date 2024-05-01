"use client";
import {
  addMonths,
  differenceInCalendarDays,
  differenceInMonths,
  formatRelative,
} from "date-fns";
import { enUS, fr } from "date-fns/locale";

type Locale = "US" | "EN" | "FR";

/**
 * Convert a Unix timestamp (Stripe) to a human-readable date relative to now
 * @param unixTimestamp
 * @param locale
 * @returns The formatted date (eg: "in 2 days (in 2 jours)")
 */
export function formatDateRelativeToNow(
  unixTimestamp: number,
  locale: Locale
): string {
  const targetDate = new Date(unixTimestamp * 1000);
  const now = new Date();

  let localeObj;
  switch (locale) {
    case "US":
      localeObj = enUS;
      break;
    case "EN":
      localeObj = enUS;
      break;
    case "FR":
      localeObj = fr;
      break;
    default:
      localeObj = enUS;
  }

  return (
    formatRelative(targetDate, now, { locale: localeObj }) +
    " (" +
    daysUntil(unixTimestamp, locale) +
    ")"
  );
}

/**
 * Convert a Unix timestamp (Stripe) to a human-readable date
 * @param unixTimestamp
 * @param locale
 * @param type
 * @returns The formatted date (eg: "in 2 days" or "in 2 jours")
 */
export function formatUnixDate(
  unixTimestamp: number,
  locale: Locale,
  type: "format_fn" | "simple" = "simple",
  withHours: boolean = false
): string | undefined {
  const date = new Date(unixTimestamp * 1000);
  if (type === "simple") {
    if (withHours) {
      return date.toLocaleString();
    } else {
      return date.toLocaleDateString();
    }
  } else if (type === "format_fn") {
    return formatDateWithFns(date, locale);
  }
}

/**
 * Convert a date to a human-readable date relative to now
 * @param date
 * @param locale
 * @returns The formatted date (relative to now, eg: "in 2 days")
 */
export function formatDateWithFns(date: Date | string, locale: Locale): string {
  let localeObj;
  switch (locale) {
    case "US":
      localeObj = enUS;
      break;
    case "EN":
      localeObj = enUS;
      break;
    case "FR":
      localeObj = fr;
      break;
    default:
      localeObj = enUS;
  }

  const now = new Date();
  const formattedDateRelative = formatRelative(date, now, {
    locale: localeObj,
  });
  return formattedDateRelative;
}

/**
 *  Calculate the number of days until a given date
 * @param unixTimestamp
 * @param locale
 * @returns  The number of days until the given date (eg: "in 2 days" or "in 2 jours")
 */
export function daysUntil(unixTimestamp: number, locale: Locale): string {
  const now = new Date();
  const futureDate = new Date(unixTimestamp * 1000);
  const difference = differenceInCalendarDays(futureDate, now);

  // Configuration de la chaîne de caractères basée sur la locale
  let daysString;
  switch (locale) {
    case "US":
    case "EN": // Supposons que EN représente l'anglais général (pas spécifique à une région)
      daysString = difference === 1 ? "day" : "days";
      break;
    case "FR":
      daysString = difference === 1 ? "jour" : "jours";
      break;
    default:
      daysString = "days"; // Fallback par défaut
  }

  return `in ${difference} ${daysString}`;
}
/**
 * Calculates the difference between two dates in terms of months and days.
 * @param {number | Date} start - The start date in Unix timestamp or Date object format.
 * @param {number | Date} end - The end date in Unix timestamp or Date object format.
 * @returns {string} - The difference between the dates in terms of months and days (e.g., "2 months and 5 days").
 */
export function calculateDifferenceBetweenUnixDates(
  start: number,
  end: number
): string {
  // Ensure both start and end are Date objects
  const startDate = new Date(start * 1000);
  const endDate = new Date(end * 1000);

  let monthDiff = differenceInMonths(endDate, startDate);
  let dayDiff = differenceInCalendarDays(
    endDate,
    addMonths(startDate, monthDiff)
  );

  // If dayDiff is negative, it means we went too far by one month
  if (dayDiff < 0) {
    monthDiff -= 1; // Reduce the month count by one
    dayDiff = differenceInCalendarDays(
      endDate,
      addMonths(startDate, monthDiff)
    );
  }

  let result = "";
  if (monthDiff > 0) {
    result += `${monthDiff} month${monthDiff > 1 ? "s" : ""}`;
  }
  if (dayDiff > 0) {
    if (result.length > 0) {
      result += " and ";
    }
    result += `${dayDiff} day${dayDiff > 1 ? "s" : ""}`;
  }

  return result || "0 days";
}

export const convertUnixToDate = (date: number): Date => {
  let unixTimestamp = date * 1000;

  // Création de l'objet Date
  let ret = new Date(unixTimestamp);
  return ret;
};
