"use client";
import { Fragment, useEffect, useState } from "react";
import colorThemes from "@/src/jsons/css-themes.json";
import { useTheme } from "next-themes";
import { appSettings } from "@prisma/client";
import { ThemeCard } from "@/src/components/features/pages/admin/setup/design-settings/subsections/ui/ThemeCard";

type Props = {
  data: appSettings;
  set: (value: string) => void;
};
// FIX: refactoriser
export const ThemeColorChange = ({ data, set }: Props) => {
  const { theme } = useTheme(); // is dark or light
  const [cssTheme, setCssTheme] = useState<string | null>("sandra");
  const actualTheme = data.theme;

  useEffect(() => {
    setCssTheme(actualTheme);
  }, [actualTheme]);

  const handleChangeColorTheme = async (themes: string) => {
    if (actualTheme && cssTheme) {
      const htmlTag = document.getElementsByTagName("html")[0];
      htmlTag.classList.remove(cssTheme);
      htmlTag.classList.remove(actualTheme);
      htmlTag.classList.add(themes);
      setCssTheme(themes);
      set(themes);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-12 gap-5 mx-auto">
        {Object.entries(colorThemes).map(([themeKey, themeVariants]) => (
          <Fragment key={themeKey}>
            <ThemeCard
              theme={theme}
              handleClick={handleChangeColorTheme}
              themeKey={themeKey}
              themeVariants={themeVariants}
            />
          </Fragment>
        ))}
      </div>
    </div>
  );
};
