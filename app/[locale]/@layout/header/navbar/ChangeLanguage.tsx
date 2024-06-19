"use client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import languages from "@/src/lib/intl/languages.json"; // Importation du fichier JSON
import { Link, locales } from "@/src/lib/intl/navigation";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import Flag from "react-world-flags";

const ChangeLanguage = () => {
  const [open, setOpen] = useState(false);
  const [localeState, setLocaleState] = useState("EN");
  const loc = useLocale();
  const handleLanguageChange = (locale: string) => {
    // useRouter().push("/", { locale });
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

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        {/* <Button
          className="relative !w-8 !h-8 !rounded-full overflow-hidden"
          variant={open ? "default" : "ghost"}> */}
          <div className="w-8 h-8 rounded-full border-theming-text-400/20 cursor-pointer border-4 overflow-hidden">
            <Flag
              code={getFlagCode(localeState)}
              className="h-full w-full object-cover object-center"
            />
          </div>
        {/* </Button> */}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="!grid grid-cols-7 user-profile-dd !w-96 overflow-y-auto">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            className="p-2 rounded-default profile-link hover:cursor-pointer"
            onClick={() => handleLanguageChange(locale)}>
            <Link
              href="/"
              locale={locale}
              className="flex flex-row items-center">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <Flag
                  code={getFlagCode(locale)}
                  fallback={`${locale}`}
                  className="h-full w-full object-cover"
                />
              </div>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ChangeLanguage;
