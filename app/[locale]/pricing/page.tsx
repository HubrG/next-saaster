import { SwitchRecurrence } from "@/app/[locale]/pricing/components/SwitchRecurrence";
import { Goodline } from "@/src/components/ui/@aceternity/good-line";
import { DivFullScreenGradient } from "@/src/components/ui/layout-elements/gradient-background";
import createMetadata from "@/src/lib/metadatas";
import { Suspense } from "react";
import { PriceCardsFeaturesByCategories } from "./components/PriceCardFeaturesByCategories";
import { PriceCardsSimple } from "./components/PriceCardsSimple";
export const generateMetadata = async () => {
  return createMetadata({
    // Voir la configuration des métadonnées dans metadatas.ts
    // @/src/lib/metadatas
    title: "Pricing",
  });
};

export default async function Pricing({
  params: { locale },
}: {
  params: { locale: string };
}) {


  return (
    <>
      <DivFullScreenGradient gradient="gradient-to-tl" />
      <div className="flex flex-col gap-y-8 ">
        <h1 className="!bg-gradient2">Pricing</h1>
        {/* <Goodline /> */}
          <div className="w-full flex mt-10 my-2 justify-center items-center">
            {/* Display recurrence if not "Pay once" or "Metered" business model */}
            <SwitchRecurrence
            // yearlyPercentOff={20}
            // -> display a percentage off for yearly payment
            />
          </div>
          <PriceCardsSimple />
          {/* If « display features by categories » is activated » */}
          <PriceCardsFeaturesByCategories />
      </div>
    </>
  );
}
