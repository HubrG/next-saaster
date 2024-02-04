"use client";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { SaasSettings, appSettings } from "@prisma/client";
import { useEffect, useState } from "react";
type Props = {
  appSettings: appSettings;
  saasSettings: SaasSettings
};
export const Init = ({ appSettings, saasSettings }: Props) => {
  const { setAppSettings } = useAppSettingsStore();
  const { setSaasSettings } = useSaasSettingsStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (mounted === false) {
      setMounted(true);
    } else {
      setAppSettings(appSettings);
      setSaasSettings(saasSettings)
    }
  }, [mounted, setAppSettings, saasSettings, setSaasSettings, appSettings]);

  return <></>;
};
