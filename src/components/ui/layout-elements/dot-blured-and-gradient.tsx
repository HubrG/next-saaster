"use client";
import { cn } from "@/src/lib/utils";
import { GradientsList } from "@/src/types/ui/gradientsList";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type DotBlurredAndGradientProps = {
  gradient: GradientsList;
  className?: string;
};

export const DotBlurredAndGradient = ({
  gradient,
  className,
}: DotBlurredAndGradientProps) => {
  const { theme } = useTheme();
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    theme === "dark" ? setIsDark(true) : setIsDark(false);
  }, [theme, isDark]);

  return (
    <div
      className={cn(
        `div-rounded-full-blured -z-10 ${theme === "dark" && gradient} ${className}`)}></div>
  );
};
