"use client";
import { AdminMain } from "@/app/[locale]/admin/components/@subcomponents/Main";
import { AdminNavbar } from "@/app/[locale]/admin/components/@subcomponents/Navbar";
import { UserInterfaceMainWrapper } from "@/src/components/ui/user-interface/UserInterfaceMainWrapper";
import { UserInterfaceNavWrapper } from "@/src/components/ui/user-interface/UserInterfaceNavWrapper";
import { UserInterfaceWrapper } from "@/src/components/ui/user-interface/UserInterfaceWrapper";
import { useIsClient } from "@/src/hooks/useIsClient";
import { useSaasFeaturesCategoriesStore } from "@/src/stores/admin/saasFeatureCategoriesStore";
import { useSaasFeaturesStore } from "@/src/stores/admin/saasFeaturesStore";
import { useSaasPlanToFeatureStore } from "@/src/stores/admin/saasPlanToFeatureStore";
import { useSaasPlansStore } from "@/src/stores/admin/saasPlansStore";
import { useSaasStripeCoupons } from "@/src/stores/admin/stripeCouponsStore";
import { useSaasStripePricesStore } from "@/src/stores/admin/stripePricesStore";
import { useSaasStripeProductsStore } from "@/src/stores/admin/stripeProductsStore";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { useCallback, useEffect } from "react";
import { toaster } from "../../../../src/components/ui/toaster/ToastConfig";

// TODO : Séparer les queries en fonction des composants
// TODO : Mieux gérer les erreurs (renvoyer un message)
// TODO : Clean le typage du retour en me basant sur appSettings (voir helpers/users.ts)
// TODO : Ajouter un composant "error" pour les erreurs (trhow new Error)
export const Index = () => {
  const isClient = useIsClient();

  const setAllStores = useCallback(async () => {
    try {
      await Promise.all([
        useSaasStripeProductsStore.getState().fetchSaasStripeProducts(),
        useSaasStripePricesStore.getState().fetchSaasStripePrices(),
        useSaasStripeCoupons.getState().fetchSaasStripeCoupons(),
        useSaasFeaturesCategoriesStore.getState().fetchSaasFeaturesCategories(),
        useSaasFeaturesStore.getState().fetchSaasFeatures(),
        useSaasPlansStore.getState().fetchSaasPlan(),
        useSaasPlanToFeatureStore.getState().fetchSaasPlanToFeature(),
        useSaasSettingsStore.getState().fetchSaasSettings(),
        useAppSettingsStore.getState().fetchAppSettings(),
      ]);
    } catch (error) {
      toaster({
        type: "error",
        description: "Erreur lors du chargement des données",
      });
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      setAllStores();
    }
  }, [isClient, setAllStores]);

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
