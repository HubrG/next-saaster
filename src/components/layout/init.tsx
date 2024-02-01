"use client";

import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { appSettings } from "@prisma/client";
import { ThemeProvider } from "next-themes";
import React, { useEffect, useState } from "react";
import { Loader } from "../ui/loader";
type Props = {
  settings: appSettings;
  children?: React.ReactNode;
  lang?: string;
};
export const Init = ({ settings, children, lang }: Props) => {

  const { setAppSettings } = useAppSettingsStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (mounted === false) {
      setMounted(true);
    } else {
      setAppSettings(settings);
    }
  }, [settings, mounted, setAppSettings]);

  
  if (!mounted) return <Loader />;
  return (
        <ThemeProvider
          attribute="class"
          defaultTheme={settings.defaultDarkMode ? "dark" : "system"}
          enableSystem>
          {children}
        </ThemeProvider>
  );
};
