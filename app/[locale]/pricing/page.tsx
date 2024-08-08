import { DivFullScreenGradient } from "@/src/components/ui/@blitzinit/layout-elements/gradient-background";
import { SkeletonLoader } from "@/src/components/ui/@blitzinit/loader";
import { getSaasSettings } from "@/src/helpers/db/saasSettings.action";
import createMetadata from "@/src/lib/metadatas";
import { env } from "@/src/lib/zodEnv";
import { SaasSettings } from "@prisma/client";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { CustomPriceCards } from "./CustomPriceCards";
import { DynamicPriceCards } from "./components/DynamicPriceCards";
import { PageTitle } from "./components/PageTitle";

export const generateMetadata = async () => {
  const t = await getTranslations();

  return createMetadata({
    // Voir la configuration des métadonnées dans metadatas.ts
    // @/src/lib/metadatas
    title: t("Pricing.metadatas.title"),
    type: "website",
    url: env.NEXT_URI + "/pricing",
  });
};

export default async function Pricing() {
  const saasSettings = (await getSaasSettings()).data as SaasSettings;

  return (
    <>
      <DivFullScreenGradient gradient="gradient-to-tl" />
      <div className="flex flex-col  gap-y-8 mx-auto self-center ">
        <PageTitle />
        <Suspense
          fallback={
            <div className="grid grid-cols-3  items-center gap-10">
              <SkeletonLoader type="card" className="!h-60" />
              <SkeletonLoader type="card" className="!h-60" />
              <SkeletonLoader type="card" className="!h-60" />
            </div>
          }>
          {saasSettings.saasType === "CUSTOM" ? (
            // SECTION : Edits custom prices in CustomPriceCards.tsx
            <CustomPriceCards />
          ) : (
            // SECTION : Automatic pricing page (METERED, PAY_ONCE, SAAS...)
            <DynamicPriceCards />
          )}
        </Suspense>
      </div>
    </>
  );
}
