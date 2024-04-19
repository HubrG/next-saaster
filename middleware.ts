import {
  defaultLocale,
  localePrefix,
  locales,
  pathnames,
} from "@/src/lib/intl/navigation";
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

// Middleware next-intl
const nextIntlMiddleware = createMiddleware({
  localePrefix,
  locales,
  defaultLocale,
  pathnames,
});

// Custom middleware that encapsulates next-intl
export async function middleware(req: NextRequest) {
  const URI = process.env.NEXT_URI;

  if (!URI) {
    console.error("NEXT_URI environment variable is not defined");
    return NextResponse.redirect(new URL("/", req.url));
  }
  try {
    // Initiazation of the app (first opening of the app, or after a reset of the app)
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
  } catch (error) {
    console.error("API request error:", error);
  }

  // Apply the next-intl middleware
  const response = nextIntlMiddleware(req);
  if (response) return response;
  //
  return NextResponse.next();
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
