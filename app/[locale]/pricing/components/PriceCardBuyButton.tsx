"use client";
import { Button } from "@/src/components/ui/button";
import { usePublicSaasPricingStore } from "@/src/stores/publicSaasPricingStore";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { iPlan } from "@/src/types/iPlans";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createCheckoutSessionPonctual } from "../queries/queries";

type PriceCardBuyButtonProps = {
  plan: iPlan;
  className: string;
};

export const PriceCardBuyButton = ({
  plan,
  className,
}: PriceCardBuyButtonProps) => {
  const { isYearly } = usePublicSaasPricingStore();
  const { saasSettings } = useSaasSettingsStore();
  const router = useRouter();
  const { data: session } = useSession();

  const handleStripe = async () => {
    let stripeCheckout;
    if (plan.saasType === "PAY_ONCE") {
      stripeCheckout = await createCheckoutSessionPonctual(
        plan.StripeProduct[0].default_price ?? "",
        plan
      );
    } else {
      stripeCheckout = await createCheckoutSessionPonctual(
        plan.isFree
          ? plan.StripeProduct[0].default_price ?? ""
          : isYearly
          ? plan.stripeYearlyPriceId ?? ""
          : plan.stripeMonthlyPriceId ?? "",
        plan
      );
    }
    if (!stripeCheckout) return;
    return router.push(stripeCheckout);
  };

  const handleSignin = () => {
    router.push("/login");
  };
  if (session?.user === undefined || session === undefined) {
    return (
      <Button variant={"second"} onClick={handleSignin} className={className}>
        {saasSettings.saasType === "PAY_ONCE"
          ? "Buy now"
          : plan.isTrial
          ? `Start free ${plan.trialDays} days trial`
          : "Subscribe now"}
      </Button>
    );
  }
  return (
    <Button variant={"second"} onClick={handleStripe} className={className}>
      {saasSettings.saasType === "PAY_ONCE"
        ? "Buy now"
        : plan.isTrial
        ? `Start free ${plan.trialDays} days trial`
        : "Subscribe now"}
    </Button>
  );
};
