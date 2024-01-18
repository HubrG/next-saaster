import createMiddleware from "next-intl/middleware";
import { locales, localePrefix, defaultLocale } from "@/src/lib/intl/navigation";

export default createMiddleware({
  // A list of all locales that are supported
  localePrefix,
  locales,
  defaultLocale,
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(fr|en)/:path*']
};
