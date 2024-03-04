import { formatRelative, differenceInCalendarDays } from "date-fns";
import { enUS, fr } from "date-fns/locale";

type Locale = "US" | "EN" | "FR";
export function formatDateRelativeToNow(unixTimestamp: number, locale: Locale): string {
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

  return formatRelative(targetDate, now, { locale: localeObj }) + " (" + daysUntil(unixTimestamp, locale) + ")";
}
export function formatDateWithFns(date: Date | string, locale: Locale): string {
  let localeObj;
  switch (locale) {
    case 'US':
      localeObj = enUS;
      break;
    case 'EN':
      localeObj = enUS; 
      break;
    case 'FR':
      localeObj = fr;
      break;
    default:
      localeObj = enUS; 
  }

  const now = new Date(); 
  const formattedDateRelative = formatRelative(date, now, { locale: localeObj });
  return formattedDateRelative;
}


export function daysUntil(unixTimestamp: number, locale: Locale): string {
  const now = new Date();
  const futureDate = new Date(unixTimestamp * 1000);
  const difference = differenceInCalendarDays(futureDate, now);

  // Configuration de la chaîne de caractères basée sur la locale
  let daysString;
  switch (locale) {
    case 'US':
    case 'EN': // Supposons que EN représente l'anglais général (pas spécifique à une région)
      daysString = difference === 1 ? 'day' : 'days';
      break;
    case 'FR':
      daysString = difference === 1 ? 'jour' : 'jours';
      break;
    default:
      daysString = 'days'; // Fallback par défaut
  }

  return `in ${difference} ${daysString}`;
}