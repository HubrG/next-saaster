"use client";
import { AdminNavbar } from "@/app/[locale]/admin/components/Navbar";
import { SkeletonLoader } from "@/src/components/ui/loader";
import { UserInterfaceMainWrapper } from "@/src/components/ui/user-interface/UserInterfaceMainWrapper";
import { UserInterfaceNavWrapper } from "@/src/components/ui/user-interface/UserInterfaceNavWrapper";
import { UserInterfaceWrapper } from "@/src/components/ui/user-interface/UserInterfaceWrapper";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { AdminSaas } from "./saas/AdminSaas";
import { AdminSetup } from "./setup/AdminSetup";

// TODO : Dans la doc, ajouter des liens d'affiliation, comme sur Shipfast
// TODO : Modifier les formulaires save/cancel comme sur InfoApp.tsx (avec le hook)
// FIX : Bug "first user" selon qu'on créé un compte avec Next Auth ou par credentials --> Du coup, pas de Stripe ID, ni d'inscription dans Resend (par ailleurs ce bug existe aussi lors d'une connexion avec Gmail. sur un ouveau compte)
// FIX : Bug création de compte avec Github
// FIX : Bug avec le "allDatas" lorsqu'on obtient un abonnement (webhook)
// FIX : Sécurité : toutes les requêtes qui passent par un x.action depuis le client doivent être vérifiées avec un secret (et pas depuis le server)
export const Index = () => {
  const { isStoreLoading } = useSaasSettingsStore();

  return (
    <UserInterfaceWrapper>
      <UserInterfaceNavWrapper>
        <AdminNavbar />
      </UserInterfaceNavWrapper>
      <UserInterfaceMainWrapper text="Admin panel">
        {isStoreLoading ? (
          <SkeletonLoader type="card-page" />
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
