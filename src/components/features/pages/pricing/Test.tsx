"use client";
import { getAppSettings } from "@/app/[locale]/server.actions";
import { Button } from "@/src/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { changeCssTheme } from "./actions.server";
import colorThemes from "@/src/jsons/css-themes.json";
import { useTheme } from "next-themes";
import { Tooltip } from "react-tooltip";
import { Card } from "@/src/components/ui/card";

export const Test = () => {
  const { data } = useQuery({
    queryKey: ["appSettings"],
    queryFn: getAppSettings,
  });
  const [cssTheme, setCssTheme] = useState(data?.theme);
  const { theme } = useTheme();
  const [darkTheme, setDarkTheme] = useState<string | undefined>(theme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setDarkTheme(theme);
  }, [theme]);
  useEffect(() => {
    setMounted(true)
}, [])
  const handleChangeColorTheme = async (themes: string) => {
    const actualTheme = data?.theme;
    const htmlTag = document.getElementsByTagName("html")[0];
    if (actualTheme && theme && cssTheme) {
      htmlTag.classList.remove(cssTheme);
      htmlTag.classList.remove(actualTheme);
      htmlTag.classList.add(themes);
      setCssTheme(themes);
      changeCssTheme(themes);
    }
  };
 
    return mounted && (
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
                  darkTheme === "dark"
                    ? themeVariants.dark.background
                    : themeVariants.light.background,
                borderColor:
                  darkTheme === "dark"
                    ? themeVariants.dark.secondary
                    : themeVariants.light.secondary,
              }}>
              <p
                style={{
                  color:
                    darkTheme === "dark"
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
                    darkTheme === "dark"
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
                    darkTheme === "dark"
                      ? themeVariants.dark.secondary
                      : themeVariants.light.primary,
                  color:
                    darkTheme === "dark"
                      ? themeVariants.dark.color
                      : themeVariants.light.color,
                }}>
                <span className="font-bold">Apply {themeVariants.name}</span>
              </Tooltip>
            </Card>
          ))}
        </div>
      </div>
    );
  
};
