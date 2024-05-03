import {
  Pathnames,
  createLocalizedPathnamesNavigation,
} from "next-intl/navigation";

type Locale = (typeof locales)[number];

export const locales = [
  "en",
  "fr",
  "es",
  "hi",
  "zh",
  "tr",
  "ja",
  "pt",
  "ar",
  "ru",
  "de",
  "it",
  "bn",
  "ko",
  "el",
  "fi",
  "hu",
  "id",
  "is",
  "nl",
  "no",
  "pl",
  "sv",
  "th",
  "vi",
] as const;
export const localePrefix = "always";
export const defaultLocale = "en" as Locale;
function encodePath(path: string): string {
  return encodeURI(path);
}
export const pathnames = {
  // If all locales use the same pathname, a
  // single external path can be provided.
  "/": "/",
  "/admin": "/admin",
  "/blog": "/blog",
  "/faq": "/faq",

  // If locales use different paths, you can
  // specify each external path per locale.
  "/dashboard#Billing": {
    en: "/dashboard#Billing",
    fr: "/tableau-de-bord#Facturation",
    es: "/tablero#Billing",
    hi: "/dashboard#Billing",
    zh: "/dashboard#Billing",
    tr: "/dashboard#Billing",
    ja: "/dashboard#Billing",
    pt: "/painel#Billing",
    ar: "/dashboard#Billing",
    ru: "/dashboard#Billing",
    it: "/planello#Billing",
    de: "/armaturenbrett#Billing",
    bn: "/dashboard#Billing",
    ko: "/dashboard#Billing",
    el: "/dashboard#Billing",
    fi: "/dashboard#Billing",
    hu: "/dashboard#Billing",
    id: "/dashboard#Billing",
    is: "/dashboard#Billing",
    nl: "/dashboard#Billing",
    no: "/dashboard#Billing",
    pl: "/dashboard#Billing",
    sv: "/dashboard#Billing",
    th: "/dashboard#Billing",
    vi: "/dashboard#Billing",
  },
  "/contact": {
    en: "/contact",
    fr: "/contact",
    es: "/contacto",
    hi: "/contact",
    zh: "/contact",
    tr: "/contact",
    ja: "/contact",
    pt: "/contacto",
    ar: "/contact",
    ru: "/contact",
    it: "/contatto",
    de: "/kontakt",
    bn: "/contact",
    ko: "/contact",
    el: "/contact",
    fi: "/contact",
    hu: "/contact",
    id: "/contact",
    is: "/contact",
    nl: "/contact",
    no: "/contact",
    pl: "/contact",
    sv: "/contact",
    th: "/contact",
    vi: "/contact",
  },
  "/login": {
    en: "/login",
    fr: "/connexion",
    es: "/iniciar-sesion",
    hi: "/login",
    zh: "/login",
    tr: "/login",
    ja: "/login",
    pt: "/Conecte-se",
    ar: "/login",
    ru: "/login",
    it: "/accesso",
    de: "/anmeldung",
    bn: "/login",
    ko: "/login",
    el: "/login",
    fi: "/login",
    hu: "/login",
    id: "/login",
    is: "/login",
    nl: "/login",
    no: "/login",
    pl: "/login",
    sv: "/login",
    th: "/login",
    vi: "/login",

  },
  "/dashboard": {
    en: "/dashboard",
    fr: "/tableau-de-bord",
    es: "/tablero",
    hi: "/dashboard",
    zh: "/dashboard",
    tr: "/dashboard",
    ja: "/dashboard",
    pt: "/painel",
    ar: "/dashboard",
    ru: "/dashboard",
    it: "/planello",
    de: "/armaturenbrett",
    bn: "/dashboard",
    ko: "/dashboard",
    el: "/dashboard",
    fi: "/dashboard",
    hu: "/dashboard",
    id: "/dashboard",
    is: "/dashboard",
    nl: "/dashboard",
    no: "/dashboard",
    pl: "/dashboard",
    sv: "/dashboard",
    th: "/dashboard",
    vi: "/dashboard",

  },
  "/pricing": {
    en: "/pricing",
    fr: "/tarifs",
    es: "/precios",
    hi: "/pricing",
    zh: "/pricing",
    tr: "/pricing",
    ja: "/pricing",
    pt: "/precos",
    ar: "/pricing",
    ru: "/pricing",
    it: "/prezzi",
    de: "/preisgestaltung",
    bn: "/pricing",
    ko: "/pricing",
    el: "/pricing",
    fi: "/pricing",
    hu: "/pricing",
    id: "/pricing",
    is: "/pricing",
    nl: "/pricing",
    no: "/pricing",
    pl: "/pricing",
    sv: "/pricing",
    th: "/pricing",
    vi: "/pricing",
  },
  "/how-it-works": {
    en: "/how-it-works",
    fr: "/fontionnement",
    es: "/como-funciona",
    hi: "/how-it-works",
    zh: "/how-it-works",
    tr: "/how-it-works",
    ja: "/how-it-works",
    pt: "/como-funciona",
    ar: "/how-it-works",
    ru: "/how-it-works",
    it: "/come-funziona",
    de: "/wie-es-funktioniert",
    bn: "/how-it-works",
    ko: "/how-it-works",
    el: "/how-it-works",
    fi: "/how-it-works",
    hu: "/how-it-works",
    id: "/how-it-works",
    is: "/how-it-works",
    nl: "/how-it-works",
    no: "/how-it-works",
    pl: "/how-it-works",
    sv: "/how-it-works",
    th: "/how-it-works",
    vi: "/how-it-works",
  },
  "/terms": {
    en: "/terms",
    fr: "/CGU",
    es: "/terminos",
    hi: "/terms",
    zh: "/terms",
    tr: "/terms",
    ja: "/terms",
    pt: "/termos",
    ar: "/terms",
    ru: "/terms",
    it: "/termini",
    de: "/bedingungen",
    bn: "/terms",
    ko: "/terms",
    el: "/terms",
    fi: "/terms",
    hu: "/terms",
    id: "/terms",
    is: "/terms",
    nl: "/terms",
    no: "/terms",
    pl: "/terms",
    sv: "/terms",
    th: "/terms",
    vi: "/terms",
  },
  "/privacy": {
    en: "/privacy",
    fr: "/confidentialite",
    es: "/privacidad",
    hi: "/privacy",
    zh: "/privacy",
    tr: "/privacy",
    ja: "/privacy",
    pt: "/privacidade",
    ar: "/privacy",
    ru: "/privacy",
    it: "/privacy",
    de: "/datenschutz",
    bn: "/privacy",
    ko: "/privacy",
    el: "/privacy",
    fi: "/privacy",
    hu: "/privacy",
    id: "/privacy",
    is: "/privacy",
    nl: "/privacy",
    no: "/privacy",
    pl: "/privacy",
    sv: "/privacy",
    th: "/privacy",
    vi: "/privacy",
  },
  "/refill": {
    en: "/refill",
    fr: "/recharger",
    es: "/recargar",
    hi: "/refill",
    zh: "/refill",
    tr: "/refill",
    ja: "/refill",
    pt: "/recarregar",
    ar: "/refill",
    ru: "/refill",
    it: "/ricaricare",
    de: "/nachfullen",
    bn: "/refill",
    ko: "/refill",
    el: "/refill",
    fi: "/refill",
    hu: "/refill",
    id: "/refill",
    is: "/refill",
    nl: "/refill",
    no: "/refill",
    pl: "/refill",
    sv: "/refill",
    th: "/refill",
    vi: "/refill",
  },
  "/register": {
    en: "/register",
    fr: "/inscription",
    es: "/registro",
    hi: "/register",
    zh: "/register",
    tr: "/register",
    ja: "/register",
    pt: "/registro",
    ar: "/register",
    ru: "/register",
    it: "/registrare",
    de: "/registrieren",
    bn: "/register",
    ko: "/register",
    el: "/register",
    fi: "/register",
    hu: "/register",
    id: "/register",
    is: "/register",
    nl: "/register",
    no: "/register",
    pl: "/register",
    sv: "/register",
    th: "/register",
    vi: "/register",
  },
  // Dynamic params are supported via square brackets
  // "/news/[articleSlug]-[articleId]": {
  //   en: "/news/[articleSlug]-[articleId]",
  //   fr: "/neuigkeiten/[articleSlug]-[articleId]",
  // },

  // Also (optional) catch-all segments are supported
  // "/categories/[...slug]": {
  //   en: "/categories/[...slug]",
  //   fr: "/kategorien/[...slug]",
  // },
} satisfies Pathnames<typeof locales>;

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createLocalizedPathnamesNavigation({ locales, localePrefix, pathnames });
