import {
  getSaasMRRSFeatures,
  getSaasMRRSFeaturesCategories,
  getSaasMRRSPlanToFeature,
  getSaasMRRSPlans,
  getSaasSettings,
  stripeGetPrices,
  getCoupons,
  stripeGetProducts,
  getAppSettings,
} from "@/app/[locale]/queries";
import { AdminComponent } from "@/src/components/features/pages/admin/Admin";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import createMetadata from "@/src/lib/metadatas";
import { authOptions } from "@/src/lib/next-auth/auth";
import { MRRSPlanToFeatureWithPlanAndFeature } from "@/src/types/MRRSPlanToFeatureWithPlanAndFeature";
import {
  MRRSFeature,
  MRRSFeatureCategory,
  MRRSPlan,
  SaasSettings,
  StripePrice,
  StripeProduct,
  UserRole,
  appSettings,
} from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

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
  const saasMRRSPlans = (await getSaasMRRSPlans()) as MRRSPlan[];
  const saasMRRSFeatures = (await getSaasMRRSFeatures()) as MRRSFeature[];
  const saasMRRSPlanToFeatures =
    (await getSaasMRRSPlanToFeature()) as MRRSPlanToFeatureWithPlanAndFeature[];
  const saasMRRSFeaturesCategories =
    (await getSaasMRRSFeaturesCategories()) as MRRSFeatureCategory[];
  const saasSettings = (await getSaasSettings()) as SaasSettings;
  const saasStripeProducts = (await stripeGetProducts()) as StripeProduct[];
  const saasStripePrices = (await stripeGetPrices()) as StripePrice[];
  const appSettings = (await getAppSettings()) as appSettings;

  if (
    !saasMRRSPlans ||
    !saasMRRSFeatures ||
    !saasMRRSPlanToFeatures ||
    !saasMRRSFeaturesCategories ||
    !saasSettings ||
    !saasStripeProducts
  ) {
    toaster({
      type: "error",
      description: "An error occured while loading the data",
    });
    redirect("/");
  }
  return (
    <div className="admin user-interface !min-w-full ">
      {/* <Suspense fallback={<Loader />}> */}
      <AdminComponent
        saasSettings={saasSettings}
        saasMRRSPlanToFeatures={saasMRRSPlanToFeatures}
        saasMRRSPlans={saasMRRSPlans}
        saasMRRSFeaturesCategories={saasMRRSFeaturesCategories}
        saasMRRSFeatures={saasMRRSFeatures}
        saasStripePrices={saasStripePrices}
        saasStripeProducts={saasStripeProducts}
        appSettings={appSettings}
      />
      {/* </Suspense> */}
    </div>
  );
}
