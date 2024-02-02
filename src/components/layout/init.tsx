"use client";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { appSettings } from "@prisma/client";
import { useEffect, useState } from "react";
type Props = {
  settings: appSettings;
};
export const Init = ({ settings }: Props) => {
  const { setAppSettings } = useAppSettingsStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (mounted === false) {
      setMounted(true);
    } else {
      setAppSettings(settings);
    }
  }, [settings, mounted, setAppSettings]);

  return (
        <></>
  );
};
