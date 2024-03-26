"use client";
import { Button } from "@/src/components/ui/button";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
type ThemeToggleProps = {
  className?: string;
  classNameMoon?: string;
};
export const ThemeToggle = ({ className, classNameMoon }: ThemeToggleProps) => {
  const { setTheme, theme } = useTheme();
  const { appSettings } = useAppSettingsStore();

  if (!appSettings.id && !appSettings.activeDarkMode)
    return (
      <div className="flex items-center space-x-3 h-11">
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    );
  if (!appSettings.activeDarkMode) return null;
  return (
    <Button
      variant="ghost"
      className={`${className} relative ml-2`}
      size="sm"
      onClick={() => {
        setTheme(theme === "light" ? "dark" : "light");
      }}>
      <Sun
        size={20}
        className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
      />
      <Moon
        size={20}
        className={`absolute -mt-5 rotate-90 scale-0 transition-all dark:-rotate-0 dark:scale-100`}
      />
      <span className="sr-only">Toggle Theme</span>
    </Button>
  );
};
