"use client";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { appSettings } from "@prisma/client";
import { ThemeProvider } from "next-themes";
import React, { useEffect } from "react";
import { Loader } from "../ui/loader";
type Props = {
  settings: appSettings;
  children?: React.ReactNode;
};
export const Init = ({ settings, children }: Props) => {
  const { setAppSettings } = useAppSettingsStore();
  const [mounted, setMounted] = React.useState(false);
  useEffect(() => {
    if (mounted === false) {
      setMounted(true);
    } else {
      setAppSettings(settings);
    }
  }, [settings, mounted, setAppSettings]);

  if (!mounted) return <Loader />;
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme={settings.defaultDarkMode ? "dark" : "system"}
        enableSystem>
        {children}
      </ThemeProvider>
    </>
  );
};
