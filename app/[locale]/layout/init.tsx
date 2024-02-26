"use client";
import { useIsClient } from "@/src/hooks/useIsClient";
import { useSaasFeaturesCategoriesStore } from "@/src/stores/admin/saasFeatureCategoriesStore";
import { useSaasFeaturesStore } from "@/src/stores/admin/saasFeaturesStore";
import { useSaasPlansStore } from "@/src/stores/admin/saasPlansStore";
import { useSaasStripeCoupons } from "@/src/stores/admin/stripeCouponsStore";
import { useSaasStripePricesStore } from "@/src/stores/admin/stripePricesStore";
import { useSaasStripeProductsStore } from "@/src/stores/admin/stripeProductsStore";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { SaasSettings, appSettings } from "@prisma/client";
import { useEffect, useState } from "react";
type Props = {
  appSettings: appSettings;
  saasSettings: SaasSettings;
};
export const Init = ({ appSettings, saasSettings }: Props) => {
  const { setAppSettings } = useAppSettingsStore();
  const { setSaasSettings } = useSaasSettingsStore();
  const { fetchSaasStripeProducts } = useSaasStripeProductsStore();
  const { fetchSaasStripePrices } = useSaasStripePricesStore();
  const { fetchSaasStripeCoupons } = useSaasStripeCoupons();
  const { fetchSaasFeaturesCategories } = useSaasFeaturesCategoriesStore();
  const { fetchSaasFeatures } = useSaasFeaturesStore();
  const { fetchSaasPlan } = useSaasPlansStore();

  const isClient = useIsClient();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isClient) {
      setAppSettings(appSettings);
      setSaasSettings(saasSettings);
      Promise.all([
        fetchSaasStripeProducts(),
        fetchSaasStripePrices(),
        fetchSaasStripeCoupons(),
        fetchSaasFeaturesCategories(),
        fetchSaasFeatures(),
        fetchSaasPlan(),
      ]).then(() => {
        setIsLoading(false);
      });
    }
  }, [isClient]);

  if (isLoading) {
    return; 
  }

  return;
};
