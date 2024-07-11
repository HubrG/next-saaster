import { DivFullScreenGradient } from "@/src/components/ui/@fairysaas/layout-elements/gradient-background";
import { SkeletonLoader } from "@/src/components/ui/@fairysaas/loader";
import { getSaasSettings } from "@/src/helpers/db/saasSettings.action";
import createMetadata from "@/src/lib/metadatas";
import { env } from "@/src/lib/zodEnv";
import { SaasSettings } from "@prisma/client";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { AutomaticPriceCard } from "./components/AutomaticPriceCard";
import { CustomPriceCard } from "./components/CUSTOM/CustomPriceCard";
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
            // SECTION : Custom pricing page (METERED, PAY_ONCE, SAAS...)
            <div className="grid  sm:grid-cols-2 lg:grid-cols-4 grid-cols-1 justify-center items-start mx-5 gap-10">
              <CustomPriceCard
                className="lg:col-start-2"
                priceId="price_1PZvf2KEzhGWTuJbGiKm0BEz"
                customMode="subscription"
                // discountId="C9QAV0kr"
                creditByMonth={100}
                trialDays={10}
                // customQuantity={2}
                // enableQuantity={true}
                // If "tiered" mode
                // customPrice={10}
                // customPriceStroke={20}
              />
              <CustomPriceCard
                priceId="price_1PafXSKEzhGWTuJb8T4BYcrb"
                customPrice={12}
                slash={"titoken"}
                smallPriceDescription="per user"
                customPriceStroke={20}
                customMode="subscription"
                customQuantity={2}
                // trialDays={7}
                // discountId="iqroNjU5"
                creditByMonth={200}
              />
            </div>
          ) : (
            // SECTION : Automatic pricing page (METERED, PAY_ONCE, SAAS...)
            <AutomaticPriceCard />
          )}
        </Suspense>
      </div>
    </>
  );
}
