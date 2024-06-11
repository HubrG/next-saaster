"use client";
import { useIsClient } from "@/src/hooks/useIsClient";
import { useSessionQuery } from "@/src/queries/useSessionQuery";
import { useSaasFeaturesCategoriesStore } from "@/src/stores/admin/saasFeatureCategoriesStore";
import { useSaasFeaturesStore } from "@/src/stores/admin/saasFeaturesStore";
import { useSaasPlansStore } from "@/src/stores/admin/saasPlansStore";
import { useSaasStripeCoupons } from "@/src/stores/admin/stripeCouponsStore";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { useUserStore } from "@/src/stores/userStore";
import { SaasSettings, appSettings } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";

type Props = {
  appSettings: appSettings;
  saasSettings: SaasSettings;
};

export const Init = ({ appSettings, saasSettings }: Props) => {
    const { data: session, isLoading } = useSessionQuery();

  const { setAppSettings } = useAppSettingsStore();
  const { setSaasSettings } = useSaasSettingsStore();
  const { fetchSaasStripeCoupons } = useSaasStripeCoupons();
  const { fetchSaasFeaturesCategories } = useSaasFeaturesCategoriesStore();
  const { fetchSaasFeatures } = useSaasFeaturesStore();
  const { fetchSaasPlan } = useSaasPlansStore();
  const { fetchUserStore } = useUserStore();

  const isClient = useIsClient();
  const [hasLoadedData, setHasLoadedData] = useState(false); // Nouvel état pour suivre si les données ont été chargées

  const initialize = useCallback(() => {
    if (isClient && !isLoading && !hasLoadedData) {
      // Vérifiez si les données ont déjà été chargées
      setAppSettings(appSettings);
      setSaasSettings(saasSettings);
      if (session?.user !== undefined || session !== undefined) {
        const user = session?.user;
        if (user?.email) {
          fetchUserStore(user.email);
        }
        if (user?.role !== "USER") {
          fetchSaasStripeCoupons();
          fetchSaasFeaturesCategories();
          fetchSaasFeatures();
        }
      }
      Promise.all([fetchSaasPlan()]).then(() => {
        setHasLoadedData(true); 
      });
    }
  }, [
    isClient,
    session,
    setAppSettings,
    appSettings,
    setSaasSettings,
    saasSettings,
    fetchUserStore,
    // fetchSaasStripeProducts,
    // fetchSaasStripePrices,
    fetchSaasStripeCoupons,
    fetchSaasFeaturesCategories,
    fetchSaasFeatures,
    fetchSaasPlan,
    hasLoadedData, // Ajoutez hasLoadedData comme dépendance
  ]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isLoading) {
    return <></>;
  }

  return <></>;
};