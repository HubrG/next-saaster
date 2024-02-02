import { CheckoutButton } from "@/src/components/features/pages/pricing/CheckoutButton";
import { SwitchRecurrence } from "@/src/components/features/pages/pricing/SwitchRecurrence";
import { Suspense } from "react";
import { getSaasMRRSPlans } from "../server.actions";

export default async function Pricing({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const plans = await getSaasMRRSPlans();

  return (
    <div>
      <h1>Pricing</h1>
      <Suspense>
        <SwitchRecurrence />
        <ul className="flex flex-row items-center gap-2 justify-center mt-10">
          {plans
            .filter((plan) => plan.active && !plan.deleted)
            .map((plan) => (
              <CheckoutButton key={plan.id} plan={plan} />
            ))}
        </ul>
      </Suspense>
    </div>
  );
}
