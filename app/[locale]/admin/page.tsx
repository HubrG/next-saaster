import {
  getAppSettings,
  getSaasMRRSFeatures,
  getSaasMRRSFeaturesCategories,
  getSaasMRRSPlanToFeature,
  getSaasMRRSPlans,
} from "@/app/[locale]/server.actions";
import { AdminComponent } from "@/src/components/features/pages/admin/Admin";
import { Loader } from "@/src/components/ui/loader";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import createMetadata from "@/src/lib/metadatas";
import { authOptions } from "@/src/lib/next-auth/auth";
import {
  MRRSFeature,
  MRRSPlan,
  SaasSettings,
  UserRole,
  appSettings,
} from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
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

  if (!session || session.user.role === ("USER" as UserRole)) {
    redirect("/");
  }
  const appSettings = (await getAppSettings()) as appSettings;
  const saasSettings = (await getSaasSettings()) as SaasSettings;
  const saasMRRSPlans = (await getSaasMRRSPlans()) as MRRSPlan[];
  const saasMRRSFeatures = (await getSaasMRRSFeatures()) as MRRSFeature[];
  const saasMRRSPlanToFeatures = await getSaasMRRSPlanToFeature();
  const saasMRRSFeaturesCategories = await getSaasMRRSFeaturesCategories();

  if (
    !appSettings ||
    !saasSettings ||
    !saasMRRSPlans ||
    !saasMRRSFeatures ||
    !saasMRRSPlanToFeatures ||
    !saasMRRSFeaturesCategories
  ) {
    toaster({
      type: "error",
      description: "An error occured while loading the data",
    });
    redirect("/");
  }

  return (
    <div className="admin user-interface">
      <Suspense fallback={<Loader />}>
        <AdminComponent
          saasMRRSPlanToFeatures={saasMRRSPlanToFeatures}
          appSettings={appSettings}
          saasSettings={saasSettings}
          saasMRRSPlans={saasMRRSPlans}
          saasMRRSFeaturesCategories={saasMRRSFeaturesCategories}
          saasMRRSFeatures={saasMRRSFeatures}
        />
      </Suspense>
    </div>
  );
}
