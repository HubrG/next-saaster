import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "./navigation";

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) notFound();
  const URI = process.env.NEXT_URI;
  const apiUrl = `${URI}/api/locales`;
  const apiResponseLocales = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ defaultLocale: true }),
  });
  if (!apiResponseLocales.ok) {
    throw new Error(`API request failed with status ${apiResponseLocales.status}`);
  }
  const defaultLocal = await apiResponseLocales.json();
  console.log(defaultLocal);
  return {
    messages: await(
      locale === defaultLocal
        ? // When using Turbopack, this will enable HMR for `en`
          import(`./messages/${defaultLocal}.json`)
        : import(`./messages/${locale}.json`)
    ).then((res) => res.default),
  };
});
