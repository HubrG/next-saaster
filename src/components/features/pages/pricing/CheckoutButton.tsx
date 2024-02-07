"use client";
import { Button } from "@/src/components/ui/button";
import { usePublicSaasPricingStore } from "@/src/stores/admin/publicSaasPricingStore";
import { MRRSPlan } from "@prisma/client";
import { useRouter } from "next/navigation";
import { createCheckoutSession } from "./queries";

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
        plan.stripeFreePriceId,
        plan
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
        plan.stripeYearlyPriceId,
        plan
      );
      if (createCheckout) {
        return router.push(createCheckout);
      }
    } else {
      if (!plan.stripeMonthlyPriceId) {
        return;
      }
      const createCheckout = await createCheckoutSession(
        plan.stripeMonthlyPriceId,
        plan
      );
      if (createCheckout) {
        return router.push(createCheckout);
      }
    }
  };

  return (
    <Button
      onClick={handleClick}
      className="relative mt-5 inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-secondary/5 dark:bg-slate-950 px-3 py-1 text-sm font-medium text-text-950 dark:text-primary-foreground backdrop-blur-3xl">
        Select this plan
      </span>
    </Button>
  );
};
