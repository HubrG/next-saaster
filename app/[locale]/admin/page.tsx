import {
  getSaasMRRSFeatures,
  getSaasMRRSFeaturesCategories,
  getSaasMRRSPlanToFeature,
  getSaasMRRSPlans,
  getSaasSettings,
  stripeGetPrices,
  stripeGetProducts,
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
} from "@prisma/client";
import { Loader } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { queryClient } from "../../../src/lib/queryClient";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

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
  await queryClient.prefetchQuery({
    queryKey: ["stripeProducts"],
    queryFn: stripeGetProducts,
  });
  await queryClient.prefetchQuery({
    queryKey: ["stripePrices"],
    queryFn: stripeGetPrices,
  });

  if (
    !saasMRRSPlans ||
    !saasMRRSFeatures ||
    !saasMRRSPlanToFeatures ||
    !saasMRRSFeaturesCategories ||
    !saasSettings
  ) {
    toaster({
      type: "error",
      description: "An error occured while loading the data",
    });
    redirect("/");
  }

  return (
    <div className="admin user-interface !min-w-full ">
      <Suspense fallback={<Loader />}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <AdminComponent
            saasSettings={saasSettings}
            saasMRRSPlanToFeatures={saasMRRSPlanToFeatures}
            saasMRRSPlans={saasMRRSPlans}
            saasMRRSFeaturesCategories={saasMRRSFeaturesCategories}
            saasMRRSFeatures={saasMRRSFeatures}
          />
        </HydrationBoundary>
      </Suspense>
    </div>
  );
}
