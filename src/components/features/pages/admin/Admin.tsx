"use client";
import { AdminMain } from "@/src/components/features/pages/admin/@subcomponents/Main";
import { AdminNavbar } from "@/src/components/features/pages/admin/@subcomponents/Navbar";
import { Loader } from "@/src/components/ui/loader";
import { UserInterfaceMainWrapper } from "@/src/components/ui/user-interface/UserInterfaceMainWrapper";
import { UserInterfaceNavWrapper } from "@/src/components/ui/user-interface/UserInterfaceNavWrapper";
import { UserInterfaceWrapper } from "@/src/components/ui/user-interface/UserInterfaceWrapper";
import { useSaasMRRSFeaturesCategoriesStore } from "@/src/stores/admin/saasMRRSFeatureCategoriesStore";
import { useSaasMRRSFeaturesStore } from "@/src/stores/admin/saasMRRSFeaturesStore";
import { useSaasMRRSPlanToFeatureStore } from "@/src/stores/admin/saasMRRSPlanToFeatureStore";
import { useSaasMRRSPlansStore } from "@/src/stores/admin/saasMRRSPlansStore";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { useSaasStripeProductsStore } from "@/src/stores/admin/stripeProductsStore";
import { MRRSPlanToFeatureWithPlanAndFeature } from "@/src/types/MRRSPlanToFeatureWithPlanAndFeature";
import {
  MRRSFeature,
  MRRSFeatureCategory,
  MRRSPlan,
  SaasSettings,
  StripeCoupon,
  StripePrice,
  StripeProduct,
  appSettings,
} from "@prisma/client";
import { useCallback, useEffect, useState } from "react";
import { useSaasStripePricesStore } from "@/src/stores/admin/stripePricesStore";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { useSaasStripeCoupons } from "@/src/stores/admin/stripeCouponsStore";
import { MRRSStripeCouponsWithPlans } from "@/src/types/MRRSStripeCouponsWithPlans";

type Props = {
  saasMRRSFeaturesCategories: MRRSFeatureCategory[];
  saasMRRSPlans: MRRSPlan[];
  saasMRRSFeatures: MRRSFeature[];
  saasMRRSPlanToFeatures: MRRSPlanToFeatureWithPlanAndFeature[];
  saasSettings: SaasSettings;
  saasStripeProducts: StripeProduct[];
  saasStripePrices: StripePrice[];
  appSettings: appSettings;
  saasStripeCoupons: MRRSStripeCouponsWithPlans[];
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
  saasStripeCoupons,
}: Props) => {

  const [mounted, setMounted] = useState<boolean>(false);
  const setAllStores = useCallback(() => {
    useSaasStripeProductsStore.getState().setSaasStripeProducts(saasStripeProducts);
    useSaasStripePricesStore.getState().setSaasStripePrices(saasStripePrices);
    useSaasStripeCoupons.getState().setSaasStripeCoupons(saasStripeCoupons);
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
    saasStripeCoupons,
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
