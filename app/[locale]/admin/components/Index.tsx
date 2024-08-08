"use client";
import { AdminNavbar } from "@/app/[locale]/admin/components/Navbar";
import { SkeletonLoader } from "@/src/components/ui/@blitzinit/loader";
import { UserInterfaceMainWrapper } from "@/src/components/ui/@blitzinit/user-interface/UserInterfaceMainWrapper";
import { UserInterfaceNavWrapper } from "@/src/components/ui/@blitzinit/user-interface/UserInterfaceNavWrapper";
import { UserInterfaceWrapper } from "@/src/components/ui/@blitzinit/user-interface/UserInterfaceWrapper";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { useEffect } from "react";
import { AdminBlog } from "./blog/AdminBlog";
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
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes("BlogPosts")) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, []);

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
            <AdminBlog />
          </>
        )}
      </UserInterfaceMainWrapper>
    </UserInterfaceWrapper>
  );
};
