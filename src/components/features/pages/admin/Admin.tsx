"use client";
import { AdminMain } from "@/src/components/features/pages/admin/@subcomponents/Main";
import { AdminNavbar } from "@/src/components/features/pages/admin/@subcomponents/Navbar";
import { Loader } from "@/src/components/ui/loader";
import { UserInterfaceMainWrapper } from "@/src/components/ui/user-interface/UserInterfaceMainWrapper";
import { UserInterfaceNavWrapper } from "@/src/components/ui/user-interface/UserInterfaceNavWrapper";
import { UserInterfaceWrapper } from "@/src/components/ui/user-interface/UserInterfaceWrapper";
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
} from "@prisma/client";
import { useCallback, useEffect, useState } from "react";


type Props = {
  saasMRRSFeaturesCategories: MRRSFeatureCategory[];
  saasMRRSPlans: MRRSPlan[];
  saasMRRSFeatures: MRRSFeature[];
  saasMRRSPlanToFeatures: MRRSPlanToFeatureWithPlanAndFeature[];
  saasSettings: SaasSettings;
};

export const AdminComponent = ({
  saasMRRSPlans,
  saasMRRSFeatures,
  saasSettings,
  saasMRRSPlanToFeatures,
  saasMRRSFeaturesCategories,
}: Props) => {
  const [mounted, setMounted] = useState<boolean>(false);
  const setAllStores = useCallback(() => {
    useSaasMRRSFeaturesCategoriesStore
      .getState()
      .setSaasMRRSFeaturesCategories(saasMRRSFeaturesCategories);
    useSaasMRRSFeaturesStore.getState().setSaasMRRSFeatures(saasMRRSFeatures);
    useSaasMRRSPlansStore.getState().setSaasMRRSPlans(saasMRRSPlans);
    useSaasSettingsStore.getState().setSaasSettings(saasSettings);
    useSaasMRRSPlanToFeatureStore
      .getState()
      .setSaasMRRSPlanToFeature(saasMRRSPlanToFeatures);
  }, [
    saasMRRSFeaturesCategories,
    saasSettings,
    saasMRRSFeatures,
    saasMRRSPlans,
    saasMRRSPlanToFeatures,
  ]);

  useEffect(() => {
    if (mounted === false) {
      setAllStores();
      setMounted(true);
    }
  }, [mounted, setAllStores]);

  if (!mounted) {
    return <Loader />;
  }
  return (
    <UserInterfaceWrapper>
      <UserInterfaceNavWrapper>
        <AdminNavbar />
      </UserInterfaceNavWrapper>
      <UserInterfaceMainWrapper text="Administration">
        <AdminMain />
      </UserInterfaceMainWrapper>
    </UserInterfaceWrapper>
  );
};
