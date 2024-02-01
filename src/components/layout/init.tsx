"use client";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { appSettings, SaasSettings } from "@prisma/client";
import { ThemeProvider } from "next-themes";
import React, { useEffect } from "react";
type Props = {
  settings: appSettings;
  saasSettings?: SaasSettings;
  children?: React.ReactNode;
};
export const Init = ({ settings, children }: Props) => {
  const { appSettings, setAppSettings } = useAppSettingsStore();
  const { saasSettings, setSaasSettings } = useSaasSettingsStore();
  const [mounted, setMounted] = React.useState(false);
  useEffect(() => {
    if (settings && mounted === false) {
      setAppSettings(settings);
      setSaasSettings(saasSettings);
      setMounted(true);
    }
  }, [settings, setAppSettings, mounted, saasSettings, setSaasSettings]);
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme={appSettings.defaultDarkMode ? "dark" : "system"}
        enableSystem>
        {children}
      </ThemeProvider>
    </>
  );
};
