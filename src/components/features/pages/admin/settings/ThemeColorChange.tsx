"use client";
import { Button } from "@/src/components/ui/button";
import { useEffect, useState } from "react";
import { changeCssTheme } from "./actions.server";
import colorThemes from "@/src/jsons/css-themes.json";
import { useTheme } from "next-themes";
import { Tooltip } from "react-tooltip";
import { Card } from "@/src/components/ui/card";
import { Toastify } from "@/src/components/layout/toastify/Toastify";
import { appSettings } from "@prisma/client";

type Props = {
  data: appSettings;
};

export const ThemeColorChange = ({ data }: Props) => {
  const { theme } = useTheme(); // is dark or light
  const [cssTheme, setCssTheme] = useState(data?.theme);
  const actualTheme = data?.theme ?? "slate";

  // NOTE : Active it if problem with hydration
  // const [mounted, setMounted] = useState(false);
  // useEffect(() => {
  //   setMounted(true);
  // }, []);

  useEffect(() => {
    setCssTheme(data?.theme);
  }, [data]);

  const handleChangeColorTheme = async (themes: string) => {
    if (actualTheme && theme && cssTheme) {
      const htmlTag = document.getElementsByTagName("html")[0];
      htmlTag.classList.remove(cssTheme);
      htmlTag.classList.remove(actualTheme);
      htmlTag.classList.add(themes);
      setCssTheme(themes);
    }
  };

  const handleSaveColorTheme = async () => {
    if (cssTheme && data?.id) {
      const dataToSet = await changeCssTheme(data?.id, cssTheme);
      if (dataToSet === true) {
        return Toastify({
          type: "success",
          value: "Theme changed",
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
          <Card
            key={themeKey}
            className={`p-2
            rounded-lg
            flex flex-col gap-1
            justify-center items-center
            w-full
            col-span-2
              border
            `}
            style={{
              backgroundColor:
                theme === "dark"
                  ? themeVariants.dark.background
                  : themeVariants.light.background,
              borderColor:
                theme === "dark"
                  ? themeVariants.dark.secondary
                  : themeVariants.light.secondary,
            }}>
            <p
              style={{
                color:
                  theme === "dark"
                    ? themeVariants.dark.color
                    : themeVariants.light.color,
              }}>
              {themeVariants.name}
            </p>
            <Button
              data-tooltip-id={`cssThemeName${themeKey}`}
              onClick={() => handleChangeColorTheme(themeKey)}
              size="lg"
              className="p-5 rounded-full w-10 h-10"
              style={{
                backgroundColor:
                  theme === "dark"
                    ? themeVariants.dark.primary
                    : themeVariants.light.primary,
              }}></Button>
            <Tooltip
              id={`cssThemeName${themeKey}`}
              opacity={1}
              variant="dark"
              place={"bottom"}
              className=" flex flex-col"
              style={{
                backgroundColor:
                  theme === "dark"
                    ? themeVariants.dark.secondary
                    : themeVariants.light.primary,
                color:
                  theme === "dark"
                    ? themeVariants.dark.color
                    : themeVariants.light.color,
              }}>
              <span className="font-bold">Apply <strong>{themeVariants.name}</strong></span>
            </Tooltip>
          </Card>
        ))}
      </div>
      <div className="flex justify-end">
        <Button onClick={handleSaveColorTheme} className="mt-5">
          Apply&nbsp;<strong>{getNameForTheme(cssTheme)}</strong>&nbsp;for all users
        </Button>
      </div>
    </div>
  );
};
