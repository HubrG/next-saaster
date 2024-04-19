"use client";
import { ButtonWithLoader } from "@/src/components/ui/@fairysaas/button-with-loader";
import { useRouter } from "@/src/lib/intl/navigation";
import { usePublicSaasPricingStore } from "@/src/stores/publicSaasPricingStore";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { iPlan } from "@/src/types/db/iPlans";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { createCheckoutSession } from "../queries/queries.action";

type PriceCardBuyButtonProps = {
  plan: iPlan;
  className: string;
};

export const PriceCardBuyButton = ({
  plan,
  className,
}: PriceCardBuyButtonProps) => {
  
  const { isYearly, seatQuantity } = usePublicSaasPricingStore();
  const { saasSettings } = useSaasSettingsStore();
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

const stripePrice = (plan: iPlan, isYearly: boolean) => {
  if (plan.isFree || plan.saasType === "PAY_ONCE") {
    return plan.StripeProduct[0].default_price ?? "";
 } else if (plan.saasType === "METERED_USAGE") {
    return plan.stripeMonthlyPriceId;
  } else if (isYearly) {
    return plan.stripeYearlyPriceId ?? "";
  } else {
    return plan.stripeMonthlyPriceId ?? "";
  }
};


  const handleStripe = async () => {
    setIsLoading(true);
    let stripeCheckout;
    const price = stripePrice(plan, isYearly);
    if (plan.saasType === "PAY_ONCE") {
      stripeCheckout = await createCheckoutSession({
        planPrice: price ?? "0",
        plan: plan,
        seatQuantity: seatQuantity ?? "1",
      });
    } else {
      stripeCheckout = await createCheckoutSession({
        planPrice: price ?? "0",
        plan,
        isYearly,
        seatQuantity,
      });
    }
    setIsLoading(false);
    if (!stripeCheckout) return;
    return router.push(stripeCheckout as any);
  };

  const handleSignin = () => {
    router.push("/login");
  };
  if (session?.user === undefined || session === undefined) {
    return (
      <ButtonWithLoader
        type="button"
        disabled={isLoading}
        variant="second"
        className={className}
        loading={isLoading}
        onClick={() => {
          handleSignin();
        }}>
        {saasSettings.saasType === "PAY_ONCE"
          ? "Buy now"
          : plan.isTrial
          ? `Start free ${plan.trialDays} days trial`
          : "Subscribe now"}
      </ButtonWithLoader>
    );
  }
  return (
    <ButtonWithLoader
        type="button"
        disabled={isLoading}
        loading={isLoading}
        variant="second"
        className={className} onClick={handleStripe} >
      {saasSettings.saasType === "PAY_ONCE"
        ? "Buy now"
        : plan.isTrial
        ? `Start free ${plan.trialDays} days trial`
        : "Subscribe now"}
    </ButtonWithLoader>
  );
};
