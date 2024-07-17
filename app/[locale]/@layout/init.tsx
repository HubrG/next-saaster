"use client";
import { useIsClient } from "@/src/hooks/useIsClient";
import { useBlogPostsQuery } from "@/src/queries/useBlogPostsQuery";
import { useSaasPlanQuery } from "@/src/queries/useSaasPlanQuery";
import { useSessionQuery } from "@/src/queries/useSessionQuery";
import { useUserInfoQuery } from "@/src/queries/useUserInfoQuery";
import { useUserQuery } from "@/src/queries/useUserQuery";
import { useNotificationSettingsStore } from "@/src/stores/admin/notificationSettingsStore";
import { useSaasFeaturesCategoriesStore } from "@/src/stores/admin/saasFeatureCategoriesStore";
import { useSaasFeaturesStore } from "@/src/stores/admin/saasFeaturesStore";
import { useSaasPlanToFeatureStore } from "@/src/stores/admin/saasPlanToFeatureStore";
import { useSaasPlansStore } from "@/src/stores/admin/saasPlansStore";
import { useSaasStripeCoupons } from "@/src/stores/admin/stripeCouponsStore";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import useBlogStore from "@/src/stores/blogStore";
import useInternationalizationStore from "@/src/stores/internationalizationStore";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { useUserInfoStore } from "@/src/stores/userInfoStore";
import { useUserStore } from "@/src/stores/userStore";
import { iUsers } from "@/src/types/db/iUsers";
import { SaasSettings, appSettings } from "@prisma/client";
import { Session } from "next-auth";
import { useCallback, useEffect } from "react";

type Props = {
  appSettings: appSettings;
  saasSettings: SaasSettings;
};

const DataInitializer = ({
  session,
  user,
  appSettingsProp,
  saasSettingsProp,
}: {
  session: Session;
  user?: iUsers;
  appSettingsProp: appSettings;
  saasSettingsProp: SaasSettings;
}) => {
  const { setAppSettings } = useAppSettingsStore();
  const { fetchSaasPlanToFeature } = useSaasPlanToFeatureStore();
  const { fetchInternationalizations, fetchDictionaries } =
    useInternationalizationStore();
  const { setSaasSettings } = useSaasSettingsStore();
  const { setUserInfoStore } = useUserInfoStore();
  const { fetchSaasStripeCoupons } = useSaasStripeCoupons();
  const { fetchNotificationTypesStore, fetchNotificationSettingsStore } =
    useNotificationSettingsStore();
  const { fetchSaasFeaturesCategories } = useSaasFeaturesCategoriesStore();
  const { fetchSaasFeatures } = useSaasFeaturesStore();
  const { fetchSaasPlan, setSaasPlans } = useSaasPlansStore();
  const { fetchBlogPosts, fetchBlogCategories, setBlogPosts } = useBlogStore();
  const { data: userInfo } = useUserInfoQuery(session?.user?.email ?? "");
  const { data: saasPlan } = useSaasPlanQuery();
  const { data: blogPosts } = useBlogPostsQuery();

  useEffect(() => {
    if (userInfo) {
      setUserInfoStore(userInfo);
    }
  }, [userInfo, setUserInfoStore]);

  const initialize = useCallback(async () => {
    if (appSettingsProp?.activeInternationalization) {
      await Promise.all([fetchInternationalizations(), fetchDictionaries()]);
    }

    if (session?.user && user?.role !== "USER") {
      await Promise.all([
        fetchSaasStripeCoupons(),
        fetchSaasFeaturesCategories(),
        fetchSaasFeatures(),
        fetchBlogCategories(),
        fetchSaasPlanToFeature(),
      ]);
      if (appSettingsProp?.activeNotification) {
        fetchNotificationTypesStore();
        fetchNotificationSettingsStore(session?.user?.userId ?? "");
      }
      if (blogPosts) {
        setBlogPosts(blogPosts);
      }
      if (saasPlan) {
        setSaasPlans(saasPlan);
      }
    } else if (session?.user && user?.role === "USER") {
      if (appSettingsProp?.activeNotification) {
        fetchNotificationTypesStore();
        fetchNotificationSettingsStore(session?.user?.userId ?? "");
      }
    } else {
      if (saasPlan) {
        setSaasPlans(saasPlan);
      }
      if (blogPosts) {
        setBlogPosts(blogPosts);
      }
    }
  }, [
    appSettingsProp,
    saasSettingsProp,
    session,
    user,
    blogPosts,
    saasPlan,
    fetchInternationalizations,
    fetchDictionaries,
    fetchSaasStripeCoupons,
    fetchSaasFeaturesCategories,
    fetchSaasFeatures,
    fetchBlogPosts,
    fetchBlogCategories,
    fetchSaasPlan,
    fetchSaasPlanToFeature,
    setAppSettings,
    setSaasSettings,
  ]);

  useEffect(() => {
    initialize();
  }, [initialize, session, user, saasPlan, appSettingsProp, saasSettingsProp]);

  return null;
};

export const Init = ({ appSettings, saasSettings }: Props) => {
  const { data: session, isLoading: isSessionLoading } = useSessionQuery();
  const { data: user, isLoading: isUserLoading } = useUserQuery(
    session?.user?.email ?? ""
  );
  const { setAppSettings } = useAppSettingsStore();
  const { setSaasSettings } = useSaasSettingsStore();
  const { setUserStore } = useUserStore();

  useEffect(() => {
    if (user && session?.user) {
      setUserStore(user as iUsers);
    }
    setAppSettings(appSettings);
    setSaasSettings(saasSettings);
  }, [
    user,
    session,
    setUserStore,
    appSettings,
    saasSettings,
    setAppSettings,
    setSaasSettings,
  ]);

  const isClient = useIsClient();
  if (isSessionLoading || isUserLoading || !isClient) {
    return null;
  }
  if (user) {
    return (
      <DataInitializer
        session={session!}
        user={user}
        appSettingsProp={appSettings}
        saasSettingsProp={saasSettings}
      />
    );
  } else {
    <DataInitializer
      session={session!}
      appSettingsProp={appSettings}
      saasSettingsProp={saasSettings}
    />;
  }
};
