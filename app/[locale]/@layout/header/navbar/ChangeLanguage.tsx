"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Skeleton } from "@/src/components/ui/skeleton";
import languages from "@/src/lib/intl/languages.json";
import { usePathname, useRouter } from "@/src/lib/intl/navigation";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import useInternationalizationStore from "@/src/stores/internationalizationStore";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";

import { useEffect, useState } from "react";
import Flag from "react-world-flags";

const ChangeLanguage = () => {
  const { appSettings } = useAppSettingsStore();
  const { internationalizations } = useInternationalizationStore();

  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();

  const [open, setOpen] = useState(false);
  const [localeState, setLocaleState] = useState("EN");
  const loc = useLocale();

  const handleLanguageChange = (locale: string) => {
    router.replace(
      // @ts-expect-error -- TypeScript will validate that only known `params`
      // are used in combination with a given `pathname`. Since the two will
      // always match for the current route, we can skip runtime checks.
      { pathname, params },
      { locale }
    );
  };

  useEffect(() => {
    setLocaleState(loc.toUpperCase());
  }, [loc]);

  const getFlagCode = (locale: string) => {
    const language = languages.find(
      (lang) => lang.code === locale.toLowerCase()
    );
    return language ? language.flag : locale;
  };

  const mergedInternationalizations = internationalizations.map((intl) => {
    const language = languages.find((lang) => lang.code === intl.code);
    return {
      ...intl,
      popularity: language ? language.popularity : 0,
    };
  });

  if (!appSettings.id && !appSettings.activeInternationalization)
    return (
      <div className="flex items-center space-x-3 h-11">
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    );
  if (!appSettings.activeInternationalization) return null;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="ml-1" asChild>
        <div
          role="img"
          aria-label={`${localeState} flag`}
          className="w-8 h-8 rounded-full push-effect border-theming-text-400/20 dark:border-theming-text-800/20 cursor-pointer border-4 overflow-hidden">
          <Flag
            alt={`${localeState} flag`}
            code={getFlagCode(localeState)}
            className="h-full push-effect  w-full object-cover object-center"
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className={`!grid  ${
          mergedInternationalizations.length > 7
            ? "grid-cols-7"
            : "grid-flow-col"
        } !max-w-96 user-profile-dd   overflow-y-auto`}>
        {mergedInternationalizations
          .sort((b, a) => b.popularity - a.popularity) // Trier par popularité
          .map((locale) => (
            <DropdownMenuItem
              key={locale.code}
              className="p-2 rounded-default profile-link hover:cursor-pointer"
              onClick={() => handleLanguageChange(locale.code)}>
              <div className="flex flex-row items-center">
                <div
                  role="img"
                  aria-label={`${locale.code} flag`}
                  className="w-8 h-8 rounded-full overflow-hidden">
                  <Flag
                    alt={`${locale.code} flag`}
                    code={getFlagCode(locale.code)}
                    fallback={`${locale}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ChangeLanguage;
