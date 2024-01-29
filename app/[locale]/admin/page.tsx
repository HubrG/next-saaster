import { getAppSettings, getSaasMRRSFeatures, getSaasMRRSPlans } from "@/app/[locale]/server.actions";
import { AdminComponent } from "@/src/components/features/pages/admin/Admin";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import createMetadata from "@/src/lib/metadatas";
import { authOptions } from "@/src/lib/next-auth/auth";
import { MRRSFeature, MRRSPlan, SaasSettings, UserRole, appSettings } from "@prisma/client";
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

  if (!session || session.user.role === "USER" as UserRole) {
    redirect("/");
  }
  const appSettings = await getAppSettings() as appSettings;
  const saasSettings = await getSaasSettings() as SaasSettings;
  const saasMRRSPlans = (await getSaasMRRSPlans()) as MRRSPlan[];
  const saasMRRSFeatures = (await getSaasMRRSFeatures()) as MRRSFeature[];

  if (!appSettings || !saasSettings || !saasMRRSPlans || !saasMRRSFeatures) {
    toaster({
      type: "error",
      description: "An error occured while loading the data",
    });
    redirect("/");
  }

  return (
    <div className="admin">
      <AdminComponent
        appSettings={appSettings}
        saasSettings={saasSettings}
        saasMRRSPlans={saasMRRSPlans}
        saasMRRSFeatures={saasMRRSFeatures}
      />
    </div>
  );
}
