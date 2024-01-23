"use client";
import { Button } from "@/src/components/ui/button";
import { Fragment, useEffect, useState } from "react";
import { changeCssTheme } from "../actions.server";
import colorThemes from "@/src/jsons/css-themes.json";
import { useTheme } from "next-themes";
import { Toastify } from "@/src/components/layout/toastify/Toastify";
import { appSettings } from "@prisma/client";
import { Loader } from "@/src/components/ui/loader";
import { ThemeCard } from "./ui/ThemeCard";

type Props = {
  data: appSettings;
};
// FIX: refactoriser
export const ThemeColorChange = ({ data }: Props) => {
  const { theme } = useTheme(); // is dark or light
  const [cssTheme, setCssTheme] = useState<string | null>(null);
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
    }
  };

  const handleSaveColorTheme = async () => {
    if (cssTheme) {
      const dataToSet = await changeCssTheme(data.id, cssTheme);
      if (dataToSet === true) {
        return Toastify({
          type: "success",
          value: "Theme changed",
          position: "bottom-right",
        });
      } else {
        return Toastify({
          type: "error",
          value: "Theme not changed",
        });
      }
    }
  };

  function getNameForTheme(themeKey: string | null | undefined) {
    const key = themeKey as keyof typeof colorThemes;
    if (colorThemes[key]) {
      return colorThemes[key].name;
    }
    return null;
  }

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
          <div className="flex justify-end">
            <Button onClick={handleSaveColorTheme} className="mt-5">
              Apply&nbsp;<strong>{getNameForTheme(cssTheme)}</strong>&nbsp;for
              all users
            </Button>
      </div>
    </div>
        
  );
};
