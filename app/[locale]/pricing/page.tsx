import { SwitchRecurrence } from "@/app/[locale]/pricing/components/SwitchRecurrence";
import { Goodline } from "@/src/components/ui/@aceternity/good-line";
import { DivFullScreenGradient } from "@/src/components/ui/layout-elements/gradient-background";
import { Loader } from "@/src/components/ui/loader";
import { getPlans } from "@/src/helpers/db/plans";
import { getSaasSettings } from "@/src/helpers/db/saasSettings";
import createMetadata from "@/src/lib/metadatas";
import { cn } from "@/src/lib/utils";
import { SaasSettings } from "@prisma/client";
import { Suspense } from "react";
import { PriceCard } from "./components/PriceCard";
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
  const plans = await getPlans();
  if (!plans.data) {
    console.error(plans.error || "Failed to fetch plans");
    return;
  }

  const SaasSettings = await getSaasSettings();
  if (!SaasSettings.data) {
    console.error(SaasSettings.error || "Failed to fetch saas settings");
    return;
  }
  const plansFiltered = plans.data.filter(
    (plan) =>
      plan.active &&
      !plan.deleted &&
      plan.saasType === SaasSettings.data?.saasType
  );

  return (
    <>
      <DivFullScreenGradient gradient="gradient-to-tl" />
      <div className="flex flex-col gap-y-8 ">
        <h1 className="!bg-gradient2">Pricing</h1>
        <Goodline />
        <Suspense>
          <div className="w-full flex my-2 justify-center items-center">
            {/* Display recurrence if not "Pay once" business model */}
            <SwitchRecurrence
              saasSettings={SaasSettings.data}
              // yearlyPercentOff={20}
            />
          </div>
          <div
            className={cn(
              { "lg:w-1/3": plansFiltered.length === 1 },
              { "md:grid-cols-2 lg:w-2/3": plansFiltered.length === 2 },
              { "md:grid-cols-3 lg:w-3/3": plansFiltered.length === 3 },
              {
                "xl:grid-cols-4 md:grid-cols-2 lg:w-4/4":
                  plansFiltered.length === 4,
              },
              " justify-evenly grid grid-cols-1 w-full px-5 mx-auto gap-10"
            )}>
            <Suspense fallback={<Loader />}>
              {plansFiltered.map((plan) => (
                <div key={plan.id} className="w-full">
                  <PriceCard
                    plan={plan}
                    type={SaasSettings.data?.saasType || "PAY_ONCE"}
                    saasSettings={SaasSettings.data as SaasSettings}
                  />
                </div>
              ))}
            </Suspense>
          </div>
        </Suspense>
      </div>
    </>
  );
}
