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
import { useSaasStripeProductsStore } from "@/src/stores/stripeProductsStore";
import { MRRSPlanToFeatureWithPlanAndFeature } from "@/src/types/MRRSPlanToFeatureWithPlanAndFeature";
import {
  MRRSFeature,
  MRRSFeatureCategory,
  MRRSPlan,
  SaasSettings,
  StripePrice,
  StripeProduct,
  appSettings,
} from "@prisma/client";
import { useCallback, useEffect, useState } from "react";
import { useSaasStripePricesStore } from "@/src/stores/stripePricesStore";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";

type Props = {
  saasMRRSFeaturesCategories: MRRSFeatureCategory[];
  saasMRRSPlans: MRRSPlan[];
  saasMRRSFeatures: MRRSFeature[];
  saasMRRSPlanToFeatures: MRRSPlanToFeatureWithPlanAndFeature[];
  saasSettings: SaasSettings;
  saasStripeProducts: StripeProduct[];
  saasStripePrices: StripePrice[];
  appSettings: appSettings;
};

export const AdminComponent = ({
  saasMRRSPlans,
  saasMRRSFeatures,
  saasSettings,
  saasMRRSPlanToFeatures,
  saasMRRSFeaturesCategories,
  saasStripeProducts,
  appSettings,
  saasStripePrices,
}: Props) => {

  const [mounted, setMounted] = useState<boolean>(false);
  const setAllStores = useCallback(() => {
    useSaasStripeProductsStore.getState().setSaasStripeProducts(saasStripeProducts);
    useSaasStripePricesStore.getState().setSaasStripePrices(saasStripePrices);
    useSaasMRRSFeaturesCategoriesStore
      .getState()
      .setSaasMRRSFeaturesCategories(saasMRRSFeaturesCategories);
    useSaasMRRSFeaturesStore.getState().setSaasMRRSFeatures(saasMRRSFeatures);
    useSaasMRRSPlansStore.getState().setSaasMRRSPlans(saasMRRSPlans);
    useSaasSettingsStore.getState().setSaasSettings(saasSettings);
    useAppSettingsStore.getState().setAppSettings(appSettings);
    useSaasMRRSPlanToFeatureStore
      .getState()
      .setSaasMRRSPlanToFeature(saasMRRSPlanToFeatures);
  }, [
    saasMRRSFeaturesCategories,
    saasSettings,
    appSettings,
    saasMRRSFeatures,
    saasMRRSPlans,
    saasMRRSPlanToFeatures,
    saasStripeProducts,
    saasStripePrices,
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
      <UserInterfaceMainWrapper text="Admin panel">
        <AdminMain />
      </UserInterfaceMainWrapper>
    </UserInterfaceWrapper>
  );
};
