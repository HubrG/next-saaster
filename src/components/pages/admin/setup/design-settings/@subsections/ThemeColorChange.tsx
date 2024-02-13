"use client";
import { ThemeCard } from "@/src/components/pages/admin/setup/design-settings/@subsections/@ui/ThemeCard";
import colorThemes from "@/src/jsons/css-themes.json";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { useTheme } from "next-themes";
import { Fragment, useEffect, useState } from "react";

type Props = {
  set: (value: string) => void;
};
// FIX: refactoriser
export const ThemeColorChange = ({ set }: Props) => {
  const { theme } = useTheme(); // is dark or light
  const [cssTheme, setCssTheme] = useState<string | null>("sandra");
  const { appSettings } = useAppSettingsStore();
  const data = appSettings;
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
      <div className="grid 2xl:grid-cols-7 xl:grid-cols-8 grid-cols-5 gap-5 mx-auto">
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
