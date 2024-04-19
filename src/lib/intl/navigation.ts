import {
  Pathnames,
  createLocalizedPathnamesNavigation
} from "next-intl/navigation";

export const locales = ["en", "fr", "es", "hi", "zh", "tr", "ja", "pt", "ar"] as const;
export const localePrefix = "always"; 
export const defaultLocale = "en";
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
