"use client";
import { useIsClient } from "@/src/hooks/useIsClient";
import { useSessionQuery } from "@/src/queries/useSessionQuery";
import { useUserQuery } from "@/src/queries/useUserQuery";
import { useSaasFeaturesCategoriesStore } from "@/src/stores/admin/saasFeatureCategoriesStore";
import { useSaasFeaturesStore } from "@/src/stores/admin/saasFeaturesStore";
import { useSaasPlansStore } from "@/src/stores/admin/saasPlansStore";
import { useSaasStripeCoupons } from "@/src/stores/admin/stripeCouponsStore";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import useBlogStore from "@/src/stores/blogStore";
import useInternationalizationStore from "@/src/stores/internationalizationStore";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { useUserStore } from "@/src/stores/userStore";
import { iUsers } from "@/src/types/db/iUsers";
import { SaasSettings, appSettings } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";

type Props = {
  appSettings: appSettings;
  saasSettings: SaasSettings;
};

export const Init = ({ appSettings, saasSettings }: Props) => {
  const { data: session, isLoading } = useSessionQuery();
  const { data: user } = useUserQuery(session?.user?.email ?? "");
  const { setAppSettings } = useAppSettingsStore();
  const { fetchInternationalizations, fetchDictionaries } =
    useInternationalizationStore();
  const { setSaasSettings } = useSaasSettingsStore();
  const { fetchSaasStripeCoupons } = useSaasStripeCoupons();
  const { fetchSaasFeaturesCategories } = useSaasFeaturesCategoriesStore();
  const { fetchSaasFeatures } = useSaasFeaturesStore();
  const { fetchSaasPlan } = useSaasPlansStore();
  const { fetchUserStore, setUserStore } = useUserStore();
  const { fetchBlogPosts } = useBlogStore();
  const isClient = useIsClient();
  const [hasLoadedData, setHasLoadedData] = useState(false);

  useEffect(() => {
    if (user && session?.user !== undefined) {
      setUserStore(user as iUsers);
    }
  }, [user, session, setUserStore]);

  const initialize = useCallback(async () => {
    if (isClient && !isLoading && !hasLoadedData) {
      setAppSettings(appSettings);
      setSaasSettings(saasSettings);
      if (appSettings?.activeInternationalization) {
        await fetchInternationalizations();
        await fetchDictionaries();
      }

      if (session?.user && user?.role !== "USER") {
        await Promise.all([
          fetchSaasStripeCoupons(),
          fetchSaasFeaturesCategories(),
          fetchSaasFeatures(),
          fetchBlogPosts(),
          fetchSaasPlan(),
        ]);
      } else {
        await fetchSaasPlan();
      }

      setHasLoadedData(true);
    }
  }, [
    isClient,
    isLoading,
    hasLoadedData,
    setAppSettings,
    appSettings,
    setSaasSettings,
    saasSettings,
    session,
    user,
    fetchInternationalizations,
    fetchSaasStripeCoupons,
    fetchSaasFeaturesCategories,
    fetchSaasFeatures,
    fetchBlogPosts,
    fetchSaasPlan,
  ]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isLoading) {
    return null;
  }

  return null;
};
