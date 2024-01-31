"use client";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import {
  appSettings,
  SaasSettings,
} from "@prisma/client";
import React, { useEffect } from "react";
type Props = {
  settings: appSettings;
  saasSettings?: SaasSettings;
};
export const Init = ({ settings }: Props) => {
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
  return <></>;
};
