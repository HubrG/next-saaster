"use client";
import { AdminMain } from "@/src/components/pages/admin/@subcomponents/Main";
import { AdminNavbar } from "@/src/components/pages/admin/@subcomponents/Navbar";
import { UserInterfaceMainWrapper } from "@/src/components/ui/user-interface/UserInterfaceMainWrapper";
import { UserInterfaceNavWrapper } from "@/src/components/ui/user-interface/UserInterfaceNavWrapper";
import { UserInterfaceWrapper } from "@/src/components/ui/user-interface/UserInterfaceWrapper";
import { useIsClient } from "@/src/hooks/useIsClient";
import { useSaasMRRSFeaturesCategoriesStore } from "@/src/stores/admin/saasMRRSFeatureCategoriesStore";
import { useSaasMRRSFeaturesStore } from "@/src/stores/admin/saasMRRSFeaturesStore";
import { useSaasMRRSPlanToFeatureStore } from "@/src/stores/admin/saasMRRSPlanToFeatureStore";
import { useSaasMRRSPlansStore } from "@/src/stores/admin/saasMRRSPlansStore";
import { useSaasStripeCoupons } from "@/src/stores/admin/stripeCouponsStore";
import { useSaasStripePricesStore } from "@/src/stores/admin/stripePricesStore";
import { useSaasStripeProductsStore } from "@/src/stores/admin/stripeProductsStore";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { Suspense, useCallback, useEffect } from "react";
import { Loader } from "../../ui/loader";

// TODO : Séparer les queries en fonction des composants
// TODO : Utiliser les hooks pour les queries
// TODO : Mieux gérer les erreurs (renvoyer un message)
// TODO : dans "add plan", séparer la logique selon le SaaSType (pay once, MRR, etc)
// TODO : Améliorer les stores (créer plusieurs méthodes à l'intérieur des stores pour alléger le code)
// FIX : Réunir tous les stores dans un fichier (ce fichier est trop long et peu élégant)
export const AdminComponent = () => {
  const isClient = useIsClient();
  const setAllStores = useCallback(() => {
    useSaasStripeProductsStore.getState().fetchSaasStripeProducts();
    useSaasStripePricesStore.getState().fetchSaasStripePrices();
    useSaasStripeCoupons.getState().fetchSaasStripeCoupons();
    useSaasMRRSFeaturesCategoriesStore
      .getState()
      .fetchSaasMRRSFeaturesCategories();
    useSaasMRRSFeaturesStore.getState().fetchSaasMRRSFeatures();
    useSaasMRRSPlansStore.getState().fetchSaasMRRSPlan();
    useSaasMRRSPlanToFeatureStore.getState().fetchSaasMRRSPlanToFeature();
    useSaasSettingsStore.getState().fetchSaasSettings();
    useAppSettingsStore.getState().fetchAppSettings();
  }, []);

  useEffect(() => {
    if (isClient) {
      setAllStores();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient]);

  if (!isClient) {
    return <Loader />;
  }

  return (
    <UserInterfaceWrapper>
      <UserInterfaceNavWrapper>
        <AdminNavbar />
      </UserInterfaceNavWrapper>
      <UserInterfaceMainWrapper text="Admin panel">
        <Suspense fallback={<Loader noHFull />}>
          <AdminMain />
        </Suspense>
      </UserInterfaceMainWrapper>
    </UserInterfaceWrapper>
  );
};
