"use client";
import { Button } from "@/src/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
type ThemeToggleProps = {
  className?: string;
  classNameMoon?: string;
};
export const ThemeToggle = ({ className, classNameMoon }: ThemeToggleProps) => {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="ghost"
      className={`${className} relative`}
      size="lg"
      onClick={() => {
        setTheme(theme === "light" ? "dark" : "light");
      }}>
      <Sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className={`absolute ${classNameMoon} rotate-90 scale-0 transition-all dark:-rotate-0 dark:scale-100`} />
      <span className="sr-only">Toggle Theme</span>
    </Button>
  );
};
