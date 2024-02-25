"use client";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { useIsClient } from "@/src/hooks/useIsClient";
import { useSaasFeaturesCategoriesStore } from "@/src/stores/admin/saasFeatureCategoriesStore";
import { useSaasFeaturesStore } from "@/src/stores/admin/saasFeaturesStore";
import { useSaasPlanToFeatureStore } from "@/src/stores/admin/saasPlanToFeatureStore";
import { useSaasPlansStore } from "@/src/stores/admin/saasPlansStore";
import { useSaasStripeCoupons } from "@/src/stores/admin/stripeCouponsStore";
import { useSaasStripePricesStore } from "@/src/stores/admin/stripePricesStore";
import { useSaasStripeProductsStore } from "@/src/stores/admin/stripeProductsStore";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { SaasSettings, appSettings } from "@prisma/client";
import { useCallback, useEffect } from "react";
type Props = {
  appSettings: appSettings;
  saasSettings: SaasSettings;
};
export const Init = ({ appSettings, saasSettings }: Props) => {
  const { setAppSettings } = useAppSettingsStore();
  const { setSaasSettings,isStoreLoading } = useSaasSettingsStore();
  const setAllStores = useCallback(async () => {
    try {
      await Promise.all([
        useSaasStripeProductsStore.getState().fetchSaasStripeProducts(),
        useSaasStripePricesStore.getState().fetchSaasStripePrices(),
        useSaasStripeCoupons.getState().fetchSaasStripeCoupons(),
        useSaasFeaturesCategoriesStore.getState().fetchSaasFeaturesCategories(),
        useSaasFeaturesStore.getState().fetchSaasFeatures(),
        useSaasPlansStore.getState().fetchSaasPlan(),
        useSaasPlanToFeatureStore.getState().fetchSaasPlanToFeature(),
      ]);
    } catch (error) {
      toaster({
        type: "error",
        description: "Erreur lors du chargement des données",
      });
    }
  }, []);
  const isClient = useIsClient();
  useEffect(() => {
    if (isClient) {
      setAppSettings(appSettings);
      setSaasSettings(saasSettings);
      setAllStores();
    }
  }, [
    isClient,
    setAppSettings,
    saasSettings,
    setSaasSettings,
    appSettings,
    setAllStores,
  ]);

  return <></>;
};
