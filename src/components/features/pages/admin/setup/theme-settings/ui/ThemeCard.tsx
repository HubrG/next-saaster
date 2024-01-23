import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { ThemeVariants } from "@/src/types/admin/cssThemes";
import React from "react";
import { Tooltip } from "react-tooltip";

type Props = {
  theme: string | undefined;
  themeKey: string;
  themeVariants: ThemeVariants;
  handleClick: (e: any) => void;
};

export const ThemeCard = ({
  theme,
  themeKey,
  themeVariants,
  handleClick,
}: Props) => {
  return (
    <Card
      className={`theme-card`}
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
        className="font-bold"
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
        onClick={() => handleClick(themeKey)}
        size="lg"
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
        className="card-tooltip"
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
        <span className="font-bold">
          Apply <strong>{themeVariants.name}</strong>
        </span>
      </Tooltip>
    </Card>
  );
};
