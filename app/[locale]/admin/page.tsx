import { getAppSettings } from "@/app/[locale]/server.actions";
import { AdminComponent } from "@/src/components/features/pages/admin/Admin";
import { getFeatureCategories } from "@/src/components/features/pages/admin/actions.server";
import createMetadata from "@/src/lib/metadatas";
import { authOptions } from "@/src/lib/next-auth/auth";
import { PricingFeatureCategory, appSettings } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { getSaasSettings } from "../server.actions";

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
  const featureCategories = await getFeatureCategories();
  const saasSettings = await getSaasSettings();

  if (!appSettings || !featureCategories || !saasSettings) {
    return null;
  }

  return (
    <div className="admin">
      <AdminComponent
        featureCategories={featureCategories as PricingFeatureCategory[]}
        appSettings={appSettings as appSettings}
        saasSettings={saasSettings}
      />
    </div>
  );
}
