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
} from "@prisma/client";
import { useCallback, useEffect, useState } from "react";
import { useSaasStripePricesStore } from "@/src/stores/stripePricesStore";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/src/components/ui/resizable";
import { stripeGetPrices, stripeGetProducts } from "@/app/[locale]/queries";
import { useQuery } from "@tanstack/react-query";

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
  const {
    data: productsData,
  } = useQuery({
    queryKey: ["stripeProducts"],
    queryFn: stripeGetProducts,
  });

  // Deuxième appel de useQuery pour obtenir les prix
  const {
    data: pricesData,
  } = useQuery({
    queryKey: ["stripePrices"],
    queryFn: stripeGetPrices,
  });
  const [mounted, setMounted] = useState<boolean>(false);
  const setAllStores = useCallback(() => {
    useSaasStripeProductsStore.getState().setSaasStripeProducts(productsData as StripeProduct[]);
    useSaasStripePricesStore.getState().setSaasStripePrices(pricesData as StripePrice[]);
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
    pricesData,
    productsData,
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
