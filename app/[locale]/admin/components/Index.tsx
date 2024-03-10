"use client";
import { AdminNavbar } from "@/app/[locale]/admin/components/Navbar";
import { Loader } from "@/src/components/ui/loader";
import { UserInterfaceMainWrapper } from "@/src/components/ui/user-interface/UserInterfaceMainWrapper";
import { UserInterfaceNavWrapper } from "@/src/components/ui/user-interface/UserInterfaceNavWrapper";
import { UserInterfaceWrapper } from "@/src/components/ui/user-interface/UserInterfaceWrapper";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { AdminSaas } from "./saas/AdminSaas";
import { AdminSetup } from "./setup/AdminSetup";

// TODO : Séparer les queries en fonction des composants
// TODO : Dans la doc, ajouter des liens d'affiliation, comme sur Shipfast
// TODO : Modifier les formulaires save/cancel comme sur InfoApp.tsx (avec le hook)
// FIX : Bug "first user" selon qu'on créé un compte avec Next Auth ou par credentials --> Du coup, pas de Stripe ID, ni d'inscription dans Resend (par ailleurs ce bug existe aussi lors d'une connexion avec Gmail. sur un ouveau compte)

export const Index = () => {
  const { isStoreLoading } = useSaasSettingsStore();

  return (
    <UserInterfaceWrapper>
      <UserInterfaceNavWrapper>
        <AdminNavbar />
      </UserInterfaceNavWrapper>
      <UserInterfaceMainWrapper text="Admin panel">
        {isStoreLoading ? (
          <Loader />
        ) : (
          <>
            <AdminSetup />
            <AdminSaas />
          </>
        )}
      </UserInterfaceMainWrapper>
    </UserInterfaceWrapper>
  );
};
