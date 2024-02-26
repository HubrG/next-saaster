"use client";
import { ButtonWithLoader } from "@/src/components/ui/@fairysaas/button-with-loader";
import { usePublicSaasPricingStore } from "@/src/stores/publicSaasPricingStore";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { iPlan } from "@/src/types/iPlans";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createCheckoutSessionPonctual } from "../queries/queries";

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

const getStripePrice = (plan: iPlan, isYearly: boolean) => {
  if (plan.isFree) {
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
    const stripePrice = getStripePrice(plan, isYearly);
    if (plan.saasType === "PAY_ONCE") {
      stripeCheckout = await createCheckoutSessionPonctual({planPrice:stripePrice??"0", plan:plan, seatQuantity:seatQuantity??"1"});
    } else {
      stripeCheckout = await createCheckoutSessionPonctual({
        planPrice: stripePrice??"0",
        plan,
        isYearly,
        seatQuantity}
      );
    }
    setIsLoading(false);
    if (!stripeCheckout) return;
    return router.push(stripeCheckout);
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
