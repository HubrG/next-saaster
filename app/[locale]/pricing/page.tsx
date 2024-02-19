import { PriceCard } from "@/app/[locale]/pricing/components/PriceCard";
import { SwitchRecurrence } from "@/app/[locale]/pricing/components/SwitchRecurrence";
import { Goodline } from "@/src/components/ui/@aceternity/good-line";
import { getPlans } from "@/src/helpers/utils/plans";
import { getStripeCoupons } from "@/src/helpers/utils/stripeCoupons";
import { iPlan } from "@/src/types/iPlans";
import { Suspense } from "react";

export default async function Pricing({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const plans = await getPlans();
  if (!plans.success || plans.error) {
    console.error(plans.error || "Failed to fetch plans");
    return;
  }
  const coupons = await getStripeCoupons();

  const fetchMail = async () => {
    const response = await fetch(`${process.env.NEXT_URI}/api/send-email`, {
      method: "POST",
      body: JSON.stringify({}),
    });
  };
  fetchMail();
  return (
    <div className="flex flex-col gap-y-8 !bg-gradient1">
      <h1 className="!bg-gradient2">Pricing</h1>
      <Goodline />
      <Suspense>
        <div className="w-full flex my-10 justify-center items-center">
          <SwitchRecurrence />
        </div>
        <div className="grid grid-cols-3 w-full mx-auto gap-5">
          {plans.data
            .filter((plan: iPlan) => plan.active && !plan.deleted)
            .map((plan: iPlan) => (
              <div key={plan.id}>
                <PriceCard plan={plan} coupons={coupons.data} />
              </div>
            ))}
        </div>
      </Suspense>
    </div>
  );
}
