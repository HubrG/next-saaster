import { authOptions } from "@/src/lib/next-auth/auth";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import createMetadata from "@/src/lib/metadatas";
import { getAppSettings } from "../server.actions";
import { PricingFeatureCategory, appSettings } from "@prisma/client";
import { AdminComponent } from "@/src/components/features/pages/admin/Admin";
import { getFeatureCategories } from '@/src/components/features/pages/admin/actions.server';

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
  if (!appSettings) {
    return null;
  }
  if (!getFeatureCategories) {
    return null;
  }

  return (
    <div className="admin">
      <AdminComponent featureCategories={featureCategories as PricingFeatureCategory[]} appSettings={appSettings as appSettings} />
    </div>
  );
}
