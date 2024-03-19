"use client";
import { ThemeCard } from "@/app/[locale]/admin/components/setup/design-settings/@subsections/@ui/ThemeCard";
import colorThemes from "@/src/jsons/css-themes.json";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { useTheme } from "next-themes";
import { Fragment, useCallback, useEffect, useState } from "react";

type Props = {
  set: (value: string) => void;
  setReseted: (value: boolean) => void;
  reseted: boolean;
};
// FIX: refactoriser
export const ThemeColorChange = ({ set, setReseted, reseted }: Props) => {
  const { appSettings } = useAppSettingsStore();
  const data = appSettings;
  const { theme } = useTheme(); // is dark or light
  const [cssTheme, setCssTheme] = useState<string | null>("sandra");
  const [actualTheme, setActualTheme] = useState<string | null>(data.theme);

  useEffect(() => {
    setCssTheme(actualTheme);
  }, [actualTheme]);

  const handleChangeColorTheme = useCallback(
    (themes: string) => {
      setReseted(false);
      if (actualTheme && cssTheme) {
        const htmlTag = document.getElementsByTagName("html")[0];
        htmlTag.classList.remove(cssTheme);
        htmlTag.classList.remove(actualTheme);
        htmlTag.classList.add(themes);
        setCssTheme(themes);
        setActualTheme(themes);
        set(themes);
      }
    },
    [actualTheme, cssTheme, set, setReseted]
  );
  useEffect(() => {
    if (reseted) {
      handleChangeColorTheme(data.theme ?? "sandra");
    }
  }, [handleChangeColorTheme, reseted, data.theme, cssTheme, actualTheme]);
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
              actualTheme={actualTheme}
            />
          </Fragment>
        ))}
      </div>
    </div>
  );
};
