import { locales, pathnames } from "@/src/lib/intl/navigation";
import { default as createIntlMiddleware } from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
type Locale = (typeof locales)[number];
// NOTE : Middleware next-intl by default
// const nextIntlMiddleware = createMiddleware({
//   localePrefix,
//   locales,
//   defaultLocale,
//   pathnames,
// });
let cachedLocales: string[] | null = null;
let cachedDefaultLocale: string | null = null;

// NOTE : Custom middleware that encapsulates next-intl
export async function middleware(req: NextRequest) {
  const URI = process.env.NEXT_URI;
  const initCookie = req.cookies.get("init_done");

  if (!URI) {
    console.error("NEXT_URI environment variable is not defined");
    return NextResponse.redirect(new URL("/", req.url));
  }
  try {
    // SECTION : Initialization
    // NOTE : Initiazation of the app (first opening of the app, or after a reset of the app)
    if (!initCookie && req.url === "/") {
      try {
        const apiUrl = `${URI}/api/initialization`;
        const apiResponse = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!apiResponse.ok) {
          throw new Error(
            `API request failed with status ${apiResponse.status}`
          );
        }
        console.log("API request success");
        const response = NextResponse.next();
        response.cookies.set("init_done", "true", { path: "/" });
        return response;
      } catch (error) {
        console.error("API request error:", error);
      }
    }
  } catch (error) {
    console.error("API request error:", error);
  }

  // SECTION : Next-Intl

  if (!cachedLocales || !cachedDefaultLocale) {
    const response = await fetch(URI + "/api/locales", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ defaultLocaleAndLocales: true }),
    });

    if (response.ok) {
      const data = await response.json();
      cachedDefaultLocale = data.defaultLocale;
      cachedLocales = data.locales.map((locale: Locale) => locale);
    } else {
      console.error("Failed to fetch locales");
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
  req.headers.set("accept-language", "");
  const handleI18nRouting = createIntlMiddleware({
    locales: cachedLocales || ["en"],
    defaultLocale: cachedDefaultLocale || "en",
    localePrefix: "never",
    localeDetection: true,
    pathnames,
  });
  const response = handleI18nRouting(req);
  response.headers.set("x-your-custom-locale", cachedDefaultLocale || "en");

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
