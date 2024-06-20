import {
  locales,
  pathnames
} from "@/src/lib/intl/navigation";
import {
  default as createIntlMiddleware
} from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
type Locale = (typeof locales)[number];
// Middleware next-intl
// const nextIntlMiddleware = createMiddleware({
//   localePrefix,
//   locales,
//   defaultLocale,
//   pathnames,
// });

// Custom middleware that encapsulates next-intl
export async function middleware(req: NextRequest) {
  const URI = process.env.NEXT_URI;

  if (!URI) {
    console.error("NEXT_URI environment variable is not defined");
    return NextResponse.redirect(new URL("/", req.url));
  }
  try {
    // Initiazation of the app (first opening of the app, or after a reset of the app)
    // Only if home page
    if (req.url === "/") {
      const apiUrl = `${URI}/api/initialization`;
      const apiResponse = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!apiResponse.ok) {
        throw new Error(`API request failed with status ${apiResponse.status}`);
      }
    }
  } catch (error) {
    console.error("API request error:", error);
  }

  // SECTION : Next-Intl

  let locales: Locale[] = [];
  let defaultLocale: Locale = "en";
  let localesFormattedToTable: string[] = [];
  //
  const apiUrl = `${URI}/api/locales`;
  const apiResponseDefaultLocal = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ defaultLocale: true }),
  });
  if (apiResponseDefaultLocal.ok) {
    defaultLocale = await apiResponseDefaultLocal.json();
  }
  const apiResponseLocales = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ locales: true }),
  });
  if (apiResponseLocales.ok) {
    locales = await apiResponseLocales.json();
    localesFormattedToTable = locales.map((locale) => {
      return locale;
    });
  }
  req.headers.set("accept-language", "");
  const handleI18nRouting = createIntlMiddleware({
    locales: localesFormattedToTable,
    defaultLocale,
    localePrefix: "never",
    localeDetection: true,
    pathnames,
  });
  const response = handleI18nRouting(req);
  response.headers.set("x-your-custom-locale", defaultLocale);

  return response;
}

export const config = {
  // Matcher entries are linked with a logical "or", therefore
  // if one of them matches, the middleware will be invoked.
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    "/((?!api|_next|_vercel|.*\\..*).*)",
    // However, match all pathnames within `/users`, optionally with a locale prefix
    "/([\\w-]+)?/users/(.+)",
  ],
};
