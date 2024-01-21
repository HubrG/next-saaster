import { authOptions } from "@/src/lib/next-auth/auth";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import createMetadata from "@/src/lib/metadatas";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getAppSettings } from "@/app/[locale]/server.actions";
import { ThemeColorChange } from "@/src/components/features/pages/admin/settings/ThemeColorChange";
import { Separator } from "@/src/components/ui/separator";
import ToggleDefaultDarkMode from "@/src/components/features/pages/admin/settings/ToggleDefaultDarkMode";
import ToggleTopLoader from "@/src/components/features/pages/admin/settings/ToggleTopLoader";
import { appSettings } from "@prisma/client";
import ToggleActiveDarkMode from "@/src/components/features/pages/admin/settings/ToggleActiveDarkMode";
import ToggleCtaOnNavbar from "../../../src/components/features/pages/admin/settings/ToggleCtaOnNavbar";
import { BadgeDollarSign, FilePenLine, Palette, StickyNote } from "lucide-react";

export const generateMetadata = async () => {
  return createMetadata({
    // Voir la configuration des métadonnées dans metadatas.ts
    // @/src/lib/metadatas
    title: "Admin",
  });
};

export default async function Admin() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const appSettings = await getAppSettings();

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["appSettings"],
    queryFn: getAppSettings,
  });
  console.log(appSettings?.defaultDarkMode);
  return (
    <div className="w-full">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="my-card">
          <div className="grid grid-cols-12 gap-10">
            <div className="col-span-3 bg-primary/20 text-left rounded-lg p-5">
              <div className="flex flex-col gap-y-5">
                <div>
                  <h4 className="font-bold flex flex-row items-center justify-between">Affichage<Palette className="icon" /></h4>
                  <ul className="text-left">
                    <li>Informations</li>
                    <li>Thème</li>
                    <li>Configuration</li>
                    <li>Langues</li>
                    <li>APIs</li>
                    <li>Réseaux</li>
                  </ul>
                </div>
                <div>
                  <h4  className="font-bold flex flex-row items-center justify-between">SaaS <BadgeDollarSign className="icon"  /></h4>
                  <ul className="text-left">
                    <li>Offres</li>
                    <li>Clients</li>
                    <li>Abonnements</li>
                  </ul>
                </div>
                <div>
                <h4  className="font-bold flex flex-row items-center justify-between">Blog <StickyNote  className="icon"  /></h4>
                  <ul className="text-left">
                    <li>Créer un billet</li>
                    <li>Voir les billets</li>
                  </ul>
                </div>
                <div>
                <h4  className="font-bold flex flex-row items-center justify-between">Édition <FilePenLine className="icon"  /></h4>
                  <ul className="text-left">
                    <li>CGV</li>
                    <li>CGU</li>
                    <li>Mentions légales</li>
                    <li>Confidentialité</li>
                    <li>FAQ</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-span-9 text-center flex flex-col gap-y-5">
              <Separator />
              <ThemeColorChange data={appSettings as appSettings} />
              <Separator />
              <ToggleDefaultDarkMode data={appSettings as appSettings} />
              <ToggleActiveDarkMode data={appSettings as appSettings} />
              <ToggleTopLoader data={appSettings as appSettings} />
              <ToggleCtaOnNavbar data={appSettings as appSettings} />
            </div>
          </div>
        </div>
      </HydrationBoundary>
    </div>
  );
}
