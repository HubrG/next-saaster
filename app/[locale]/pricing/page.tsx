import { SwitchRecurrence } from "@/app/[locale]/pricing/components/SwitchRecurrence";
import { DivFullScreenGradient } from "@/src/components/ui/@fairysaas/layout-elements/gradient-background";
import { SkeletonLoader } from "@/src/components/ui/@fairysaas/loader";
import createMetadata from "@/src/lib/metadatas";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { PriceCardsFeaturesByCategories } from "./components/PriceCardFeaturesByCategories";
import { PriceCardsSimple } from "./components/PriceCardsSimple";

export const generateMetadata = async () => {
  const t = await getTranslations();

  return createMetadata({
    // Voir la configuration des métadonnées dans metadatas.ts
    // @/src/lib/metadatas
    title: t("Pricing.metadatas.title"),
    type: "website",
    url: process.env.NEXT_PUBLIC_URI + "/pricing",
  });
};

export default async function Pricing() {
  const t = await getTranslations();

  return (
    <>
      <DivFullScreenGradient gradient="gradient-to-tl" />
      <div className="flex flex-col  gap-y-8 mx-auto self-center ">
        <h1 className="!bg-gradient2">{t("Pricing.title")}</h1>
        <Suspense
          fallback={
            <div className="grid grid-cols-3  items-center gap-10">
              <SkeletonLoader type="card" className="!h-60" />
              <SkeletonLoader type="card" className="!h-60" />
              <SkeletonLoader type="card" className="!h-60" />
            </div>
          }>
          {/* Display recurrence if not "Pay once" or "Metered" business model */}
          <SwitchRecurrence
          // yearlypercent_off={20}
          // -> display a percentage off for yearly payment
          />
          <PriceCardsSimple />
          {/* If « display features by categories » is activated » */}
          <PriceCardsFeaturesByCategories />
        </Suspense>
      </div>
    </>
  );
}
