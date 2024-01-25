"use client";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import {
    appSettings,
    PricingFeatureCategory,
    SaasSettings,
} from "@prisma/client";
import React, { useEffect } from "react";
type Props = {
  settings: appSettings;
  featureCategories?: PricingFeatureCategory[];
  saasSettings?: SaasSettings;
};
export const Init = ({ settings }: Props) => {
  const { appSettings, setAppSettings } = useAppSettingsStore();
  const [mounted, setMounted] = React.useState(false);
  useEffect(() => {
    if (settings && mounted === false) {
      setAppSettings(settings );
      setMounted(true);
    }
  }, [settings, setAppSettings, mounted]);
  return <></>;
};
