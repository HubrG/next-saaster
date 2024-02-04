import { BackgroundGrad } from "@/src/components/features/pages/pricing/Background";
import { SwitchRecurrence } from "@/src/components/features/pages/pricing/SwitchRecurrence";
import Spotlight from "@/src/components/ui/@aceternity/Spotlight";
import { HoverEffect } from "@/src/components/ui/@aceternity/pricing-card-hover-effect";
import SparklesCore from "@/src/components/ui/@aceternity/sparkles";
import { Separator } from "@/src/components/ui/separator";
import { Suspense } from "react";
import { getSaasMRRSPlans } from "../queries";
import { PriceCard } from "@/src/components/features/pages/pricing/PriceCard";
import { Goodline } from "@/src/components/ui/@aceternity/good-line";

export default async function Pricing({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const plans = await getSaasMRRSPlans();

  return (
    <div className="flex flex-col gap-y-8 !bg-gradient1">
      <h1 className="!bg-gradient2">Pricing</h1>
      <Goodline />
      <Suspense>
        <div className="w-full flex my-10 justify-center items-center">
          <SwitchRecurrence />
        </div>
        <div className="grid grid-cols-3 w-full mx-auto gap-5">
          {plans
            .filter((plan) => plan.active && !plan.deleted)
            .map((plan) => (
              <div key={plan.id}>
                <PriceCard plan={plan} />
              </div>
            ))}
        </div>
      </Suspense>
    </div>
  );
}
