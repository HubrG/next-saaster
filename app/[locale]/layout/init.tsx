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
import { useUserStore } from "@/src/stores/userStore";
import { SaasSettings, appSettings } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";

type Props = {
  appSettings: appSettings;
  saasSettings: SaasSettings;
};

export const Init = ({ appSettings, saasSettings }: Props) => {
  const { data: session, status } = useSession();
  const { setAppSettings } = useAppSettingsStore();
  const { setSaasSettings } = useSaasSettingsStore();
  const { fetchSaasStripeProducts } = useSaasStripeProductsStore();
  const { fetchSaasStripePrices } = useSaasStripePricesStore();
  const { fetchSaasStripeCoupons } = useSaasStripeCoupons();
  const { fetchSaasFeaturesCategories } = useSaasFeaturesCategoriesStore();
  const { fetchSaasFeatures } = useSaasFeaturesStore();
  const { fetchSaasPlan } = useSaasPlansStore();
  const { fetchUserStore } = useUserStore();

  const isClient = useIsClient();
  const [isLoading, setIsLoading] = useState(true);

  const initialize = useCallback(() => {
    if (isClient && status !== "loading") {
      setAppSettings(appSettings);
      setSaasSettings(saasSettings);
      if (session?.user !== undefined || session !== undefined) {
        const user = session?.user;
        if (user?.email) {
          fetchUserStore(user.email);
        }
        if (user?.role !== "USER") {
          fetchSaasStripeProducts();
          fetchSaasStripePrices();
          fetchSaasStripeCoupons();
          fetchSaasFeaturesCategories();
          fetchSaasFeatures();
        }
      }
      Promise.all([fetchSaasPlan()]).then(() => {
        setIsLoading(false);
      });
    }
  }, [
    isClient,
    status,
    session,
    setAppSettings,
    appSettings,
    setSaasSettings,
    saasSettings,
    fetchUserStore,
    fetchSaasStripeProducts,
    fetchSaasStripePrices,
    fetchSaasStripeCoupons,
    fetchSaasFeaturesCategories,
    fetchSaasFeatures,
    fetchSaasPlan,
  ]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isLoading) {
    return <></>;
  }

  return <></>;
};
