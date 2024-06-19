"use client";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import { ThemeVariants } from "@/src/types/admin/cssThemes";
import { Tooltip } from "react-tooltip";

type Props = {
  theme: string | undefined;
  themeKey: string;
  themeVariants: ThemeVariants;
  actualTheme: string | null;
  handleClick: (e: any) => void;
};

export const ThemeCard = ({
  theme,
  actualTheme,
  themeKey,
  themeVariants,
  handleClick,
}: Props) => {
  return (
    <div
      className={cn(
        {
          "!border-0 outline outline-offset-2 outline-2 dark:outline-theming-text-500":
            actualTheme === themeKey,
        },
        `theme-card`
      )}
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
              ? themeVariants.dark.background
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
    </div>
  );
};
