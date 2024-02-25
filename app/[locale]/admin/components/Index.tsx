"use client";
import { AdminMain } from "@/app/[locale]/admin/components/@subcomponents/Main";
import { AdminNavbar } from "@/app/[locale]/admin/components/@subcomponents/Navbar";
import { Loader } from "@/src/components/ui/loader";
import { UserInterfaceMainWrapper } from "@/src/components/ui/user-interface/UserInterfaceMainWrapper";
import { UserInterfaceNavWrapper } from "@/src/components/ui/user-interface/UserInterfaceNavWrapper";
import { UserInterfaceWrapper } from "@/src/components/ui/user-interface/UserInterfaceWrapper";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";

// TODO : Séparer les queries en fonction des composants
// TODO : Mieux gérer les erreurs (renvoyer un message)
// TODO : Clean le typage du retour en me basant sur appSettings (voir helpers/plans.ts --> getPlans)
// TODO : Ajouter un composant "error" pour les erreurs (trhow new Error)
// TODO : Dans la doc, ajouter des liens d'affiliation, comme sur Shipfast
// TODO : Modifier les formulaires save/cancel comme sur InfoApp.tsx (avec le hook)
// TODO : Mettre du Zod, partout
export const Index = () => {
  const { isStoreLoading } = useSaasSettingsStore();

  return (
    <UserInterfaceWrapper>
      <UserInterfaceNavWrapper>
        <AdminNavbar />
      </UserInterfaceNavWrapper>
      <UserInterfaceMainWrapper text="Admin panel">
        {isStoreLoading ? <Loader /> : <AdminMain />}
      </UserInterfaceMainWrapper>
    </UserInterfaceWrapper>
  );
};
