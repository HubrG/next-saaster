"use client";
import { Button } from "@/src/components/ui/button";
import { usePublicSaasPricingStore } from "@/src/stores/publicSaasPricingStore";
import { MRRSPlan } from "@prisma/client";
import { useRouter } from "next/navigation";
import { createCheckoutSession } from "./actions.server";

type Props = {
  plan: MRRSPlan;
};
export const CheckoutButton = ({ plan }: Props) => {
  const { isYearly } = usePublicSaasPricingStore();
  const router = useRouter();
  const handleClick = async () => {
    if (plan.isFree) {
      if (!plan.stripeFreePriceId) {
        return;
      }
      const createCheckout = await createCheckoutSession(
        plan.stripeFreePriceId
      );
      if (createCheckout) {
        return router.push(createCheckout);
      }
    }
    else if (isYearly) {
      if (!plan.stripeYearlyPriceId) {
        return;
      }
      const createCheckout = await createCheckoutSession(
        plan.stripeYearlyPriceId
      );
      if (createCheckout) {
        return router.push(createCheckout);
      }
    } else {
      if (!plan.stripeMonthlyPriceId) {
        return;
      }
      const createCheckout = await createCheckoutSession(
        plan.stripeMonthlyPriceId
      );
      if (createCheckout) {
        return router.push(createCheckout);
      }
    }
  };
  return <Button onClick={handleClick}>{plan.name}</Button>;
};
