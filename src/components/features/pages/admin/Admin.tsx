"use client";
import { AdminMain } from "@/src/components/features/pages/admin/@subcomponents/Main";
import { AdminNavbar } from "@/src/components/features/pages/admin/@subcomponents/Navbar";
import { Loader } from "@/src/components/ui/loader";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { useSaasMRRSFeaturesCategoriesStore } from "@/src/stores/saasMRRSFeatureCategoriesStore";
import { useSaasMRRSFeaturesStore } from "@/src/stores/saasMRRSFeaturesStore";
import { useSaasMRRSPlanToFeatureStore } from "@/src/stores/saasMRRSPlanToFeatureStore";
import { useSaasMRRSPlansStore } from "@/src/stores/saasMRRSPlansStore";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { MRRSPlanToFeatureWithPlanAndFeature } from "@/src/types/MRRSPlanToFeatureWithPlanAndFeature";
import {
  MRRSFeature,
  MRRSFeatureCategory,
  MRRSPlan,
  SaasSettings,
  appSettings
} from "@prisma/client";
import { useCallback, useEffect, useState } from "react";

type Props = {
  appSettings: appSettings;
  saasMRRSFeaturesCategories: MRRSFeatureCategory[];
  saasSettings: SaasSettings;
  saasMRRSPlans: MRRSPlan[];
  saasMRRSFeatures: MRRSFeature[];
  saasMRRSPlanToFeatures: MRRSPlanToFeatureWithPlanAndFeature[];
};

export const AdminComponent = ({
  appSettings,
  saasSettings,
  saasMRRSPlans,
  saasMRRSFeatures,
  saasMRRSPlanToFeatures,
  saasMRRSFeaturesCategories,
}: Props) => {
  const setAllStores = useCallback(() => {
    useSaasMRRSFeaturesCategoriesStore.getState().setSaasMRRSFeaturesCategories(saasMRRSFeaturesCategories)
    useAppSettingsStore.getState().setAppSettings(appSettings);
    useSaasSettingsStore.getState().setSaasSettings(saasSettings);
    useSaasMRRSFeaturesStore.getState().setSaasMRRSFeatures(saasMRRSFeatures);
    useSaasMRRSPlansStore.getState().setSaasMRRSPlans(saasMRRSPlans);
    useSaasMRRSPlanToFeatureStore
      .getState()
      .setSaasMRRSPlanToFeature(saasMRRSPlanToFeatures);
  }, [
    appSettings,
    saasMRRSFeaturesCategories,
    saasSettings,
    saasMRRSFeatures,
    saasMRRSPlans,
    saasMRRSPlanToFeatures,
  ]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (appSettings.id) {
      setAllStores();
      setMounted(true);
    }
  }, [appSettings, setAllStores]);

  if (!mounted) {
    return (
      <div className="flex justify-center items-center w-full h-[90vh] ">
        <Loader />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 md:gap-5 gap-0">
      <AdminNavbar />
      <AdminMain />
    </div>
  );
};
