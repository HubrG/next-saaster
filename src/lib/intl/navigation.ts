import { createLocalizedPathnamesNavigation } from "next-intl/navigation";

import { Pathnames } from "next-intl/routing";

export type Locale = (typeof locales)[number];

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

export const localePrefix = "never";
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
  "/admin/blog": "/admin/blog",
  "/faq": "/faq",

  // If locales use different paths, you can
  // specify each external path per locale.
  "/pricing/success": {
    en: "/pricing/success",
    fr: "/tarifs/succes",
    es: "/precios/exito",
    hi: "/pricing/success",
    zh: "/pricing/success",
    tr: "/pricing/success",
    ja: "/pricing/success",
    pt: "/precos/sucesso",
    ar: "/pricing/success",
    ru: "/pricing/success",
    it: "/prezzi/successo",
    de: "/preisgestaltung/erfolg",
    bn: "/pricing/success",
    ko: "/pricing/success",
    el: "/pricing/success",
    fi: "/pricing/success",
    hu: "/pricing/success",
    id: "/pricing/success",
    is: "/pricing/success",
    nl: "/pricing/success",
    no: "/pricing/success",
    pl: "/pricing/success",
    sv: "/pricing/success",
    th: "/pricing/success",
    vi: "/pricing/success",
  },
  "/register/teamInvitation": {
    en: "/register/teamInvitation",
    fr: "/inscription/invitation-equipe",
    es: "/registro/invitacion-equipo",
    hi: "/register/teamInvitation",
    zh: "/register/teamInvitation",
    tr: "/register/teamInvitation",
    ja: "/register/teamInvitation",
    pt: "/registro/convite-equipe",
    ar: "/register/teamInvitation",
    ru: "/register/teamInvitation",
    it: "/registrare/invito-squadra",
    de: "/registrieren/team-einladung",
    bn: "/register/teamInvitation",
    ko: "/register/teamInvitation",
    el: "/register/teamInvitation",
    fi: "/register/teamInvitation",
    hu: "/register/teamInvitation",
    id: "/register/teamInvitation",
    is: "/register/teamInvitation",
    nl: "/register/teamInvitation",
    no: "/register/teamInvitation",
    pl: "/register/teamInvitation",
    sv: "/register/teamInvitation",
    th: "/register/teamInvitation",
    vi: "/register/teamInvitation",
  },
  "/forgot-password": {
    en: "/forgot-password",
    fr: "/mot-de-passe-oublie",
    es: "/olvide-mi-contrasena",
    hi: "/forgot-password",
    zh: "/forgot-password",
    tr: "/forgot-password",
    ja: "/forgot-password",
    pt: "/esqueci-minha-senha",
    ar: "/forgot-password",
    ru: "/forgot-password",
    it: "/password-dimenticata",
    de: "/passwort-vergessen",
    bn: "/forgot-password",
    ko: "/forgot-password",
    el: "/forgot-password",
    fi: "/forgot-password",
    hu: "/forgot-password",
    id: "/forgot-password",
    is: "/forgot-password",
    nl: "/forgot-password",
    no: "/forgot-password",
    pl: "/forgot-password",
    sv: "/forgot-password",
    th: "/forgot-password",
    vi: "/forgot-password",
  },
  "/register/verifyemail": {
    en: "/register/verifyemail",
    fr: "/inscription/verifier-email",
    es: "/registro/verificar-correo",
    hi: "/register/verifyemail",
    zh: "/register/verifyemail",
    tr: "/register/verifyemail",
    ja: "/register/verifyemail",
    pt: "/registro/verificar-email",
    ar: "/register/verifyemail",
    ru: "/register/verifyemail",
    it: "/registrare/verifica-email",
    de: "/registrieren/e-mail-bestatigen",
    bn: "/register/verifyemail",
    ko: "/register/verifyemail",
    el: "/register/verifyemail",
    fi: "/register/verifyemail",
    hu: "/register/verifyemail",
    id: "/register/verifyemail",
    is: "/register/verifyemail",
    nl: "/register/verifyemail",
    no: "/register/verifyemail",
    pl: "/register/verifyemail",
    sv: "/register/verifyemail",
    th: "/register/verifyemail",
    vi: "/register/verifyemail",
  },
  "/dashboard#Billing": {
    en: "/dashboard#Billing",
    fr: "/tableau-de-bord#Billing",
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
    es: "/contact",
    hi: "/contact",
    zh: "/contact",
    tr: "/contact",
    ja: "/contact",
    pt: "/contact",
    ar: "/contact",
    ru: "/contact",
    it: "/contact",
    de: "/contact",
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
    fr: "/fonctionnement",
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
  "/refill/success": {
    en: "/refill/success",
    fr: "/recharger/succes",
    es: "/recargar/exito",
    hi: "/refill/success",
    zh: "/refill/success",
    tr: "/refill/success",
    ja: "/refill/success",
    pt: "/recarregar/sucesso",
    ar: "/refill/success",
    ru: "/refill/success",
    it: "/ricaricare/successo",
    de: "/nachfullen/erfolg",
    bn: "/refill/success",
    ko: "/refill/success",
    el: "/refill/success",
    fi: "/refill/success",
    hu: "/refill/success",
    id: "/refill/success",
    is: "/refill/success",
    nl: "/refill/success",
    no: "/refill/success",
    pl: "/refill/success",
    sv: "/refill/success",
    th: "/refill/success",
    vi: "/refill/success",
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
  "/blog/category/[slug]": {
    en: "/blog/category/[slug]",
    fr: "/blog/categorie/[slug]",
    es: "/blog/category/[slug]",
    hi: "/blog/category/[slug]",
    zh: "/blog/category/[slug]",
    tr: "/blog/category/[slug]",
    ja: "/blog/category/[slug]",
    pt: "/blog/category/[slug]",
    ar: "/blog/category/[slug]",
    ru: "/blog/category/[slug]",
    it: "/blog/category/[slug]",
    de: "/blog/category/[slug]",
    bn: "/blog/category/[slug]",
    ko: "/blog/category/[slug]",
    el: "/blog/category/[slug]",
    fi: "/blog/category/[slug]",
    hu: "/blog/category/[slug]",
    id: "/blog/category/[slug]",
    is: "/blog/category/[slug]",
    nl: "/blog/category/[slug]",
    no: "/blog/category/[slug]",
    pl: "/blog/category/[slug]",
    sv: "/blog/category/[slug]",
    th: "/blog/category/[slug]",
    vi: "/blog/category/[slug]",
  },
  "/blog/read/[slug]/[id]": {
    en: "/blog/read/[slug]/[id]",
    fr: "/blog/lecture/[slug]/[id]",
    es: "/blog/read/[slug]/[id]",
    hi: "/blog/read/[slug]/[id]",
    zh: "/blog/read/[slug]/[id]",
    tr: "/blog/read/[slug]/[id]",
    ja: "/blog/read/[slug]/[id]",
    pt: "/blog/read/[slug]/[id]",
    ar: "/blog/read/[slug]/[id]",
    ru: "/blog/read/[slug]/[id]",
    it: "/blog/read/[slug]/[id]",
    de: "/blog/read/[slug]/[id]",
    bn: "/blog/read/[slug]/[id]",
    ko: "/blog/read/[slug]/[id]",
    el: "/blog/read/[slug]/[id]",
    fi: "/blog/read/[slug]/[id]",
    hu: "/blog/read/[slug]/[id]",
    id: "/blog/read/[slug]/[id]",
    is: "/blog/read/[slug]/[id]",
    nl: "/blog/read/[slug]/[id]",
    no: "/blog/read/[slug]/[id]",
    pl: "/blog/read/[slug]/[id]",
    sv: "/blog/read/[slug]/[id]",
    th: "/blog/read/[slug]/[id]",
    vi: "/blog/read/[slug]/[id]",
  },
  "/blog/tag/[slug]": {
    en: "/blog/tag/[slug]",
    fr: "/blog/tag/[slug]",
    es: "/blog/tag/[slug]",
    hi: "/blog/tag/[slug]",
    zh: "/blog/tag/[slug]",
    tr: "/blog/tag/[slug]",
    ja: "/blog/tag/[slug]",
    pt: "/blog/tag/[slug]",
    ar: "/blog/tag/[slug]",
    ru: "/blog/tag/[slug]",
    it: "/blog/tag/[slug]",
    de: "/blog/tag/[slug]",
    bn: "/blog/tag/[slug]",
    ko: "/blog/tag/[slug]",
    el: "/blog/tag/[slug]",
    fi: "/blog/tag/[slug]",
    hu: "/blog/tag/[slug]",
    id: "/blog/tag/[slug]",
    is: "/blog/tag/[slug]",
    nl: "/blog/tag/[slug]",
    no: "/blog/tag/[slug]",
    pl: "/blog/tag/[slug]",
    sv: "/blog/tag/[slug]",
    th: "/blog/tag/[slug]",
    vi: "/blog/tag/[slug]",
  },
  "/admin/blog/edit/[id]/[slug]": {
    en: "/admin/blog/edit/[id]/[slug]",
    fr: "/admin/blog/edit/[id]/[slug]",
    es: "/admin/blog/edit/[id]/[slug]",
    hi: "/admin/blog/edit/[id]/[slug]",
    zh: "/admin/blog/edit/[id]/[slug]",
    tr: "/admin/blog/edit/[id]/[slug]",
    ja: "/admin/blog/edit/[id]/[slug]",
    pt: "/admin/blog/edit/[id]/[slug]",
    ar: "/admin/blog/edit/[id]/[slug]",
    ru: "/admin/blog/edit/[id]/[slug]",
    it: "/admin/blog/edit/[id]/[slug]",
    de: "/admin/blog/edit/[id]/[slug]",
    bn: "/admin/blog/edit/[id]/[slug]",
    ko: "/admin/blog/edit/[id]/[slug]",
    el: "/admin/blog/edit/[id]/[slug]",
    fi: "/admin/blog/edit/[id]/[slug]",
    hu: "/admin/blog/edit/[id]/[slug]",
    id: "/admin/blog/edit/[id]/[slug]",
    is: "/admin/blog/edit/[id]/[slug]",
    nl: "/admin/blog/edit/[id]/[slug]",
    no: "/admin/blog/edit/[id]/[slug]",
    pl: "/admin/blog/edit/[id]/[slug]",
    sv: "/admin/blog/edit/[id]/[slug]",
    th: "/admin/blog/edit/[id]/[slug]",
    vi: "/admin/blog/edit/[id]/[slug]",
  },

  "[[...rest]]": "[[...rest]]",
} satisfies Pathnames<typeof locales>;

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createLocalizedPathnamesNavigation({ locales, localePrefix, pathnames });
