"use client";
import { ButtonWithLoader } from "@/src/components/ui/@blitzinit/button-with-loader";
import { toaster } from "@/src/components/ui/@blitzinit/toaster/ToastConfig";
import {
  ReturnUserDependencyProps,
  getUserInfos,
} from "@/src/helpers/dependencies/user-info";
import { useRouter } from "@/src/lib/intl/navigation";
import { cn } from "@/src/lib/utils";
import { useSessionQuery } from "@/src/queries/useSessionQuery";
import { usePublicSaasPricingStore } from "@/src/stores/publicSaasPricingStore";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { useUserStore } from "@/src/stores/userStore";
import { iPlan } from "@/src/types/db/iPlans";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import {
  createCheckoutCustomSession,
  createCheckoutSession,
  createCheckoutUpdateSession,
} from "../queries/queries.action";

type PriceCardBuyButtonProps = {
  plan: iPlan;
  planPrice?: string;
  className?: string;
  customDiscountId?: string;
  customQte?: number;
  creditByMonth?: number;
  customTrialDays?: number;
  customMode?: "subscription" | "payment" | undefined;
  isMeteredUsage?: boolean;
};

export const PriceCardBuyButton = ({
  plan,
  className,
  customMode,
  customTrialDays,
  customQte,
  customDiscountId,
  planPrice,
  isMeteredUsage,
  creditByMonth,
}: PriceCardBuyButtonProps) => {
  const t = useTranslations("Pricing.Components.PriceCardBuyButton");
  const { userStore, fetchUserStore } = useUserStore();
  const [showConfetti, setShowConfetti] = useState(false);
  const { isYearly, seatQuantity } = usePublicSaasPricingStore();
  const [isCurrentPlan, setIsCurrentPlan] = useState(false);
  const { saasSettings } = useSaasSettingsStore();
  const router = useRouter();
  const { data: session } = useSessionQuery();
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<
    ReturnUserDependencyProps | undefined
  >(undefined);

  useEffect(() => {
    if (userInfo?.activeSubscription) {
      const isCurrent =
        userInfo.activeSubscription.priceObject.id ===
          stripePrice(plan, isYearly) ||
        userInfo.activeSubscription.priceObject.id === planPrice;
      setIsCurrentPlan(isCurrent);
    }
  }, [userInfo, plan, isYearly]);

  useEffect(() => {
    if (
      session?.user &&
      session.user.email &&
      userStore.id !== session.user.id
    ) {
      setUserInfo(getUserInfos({ user: userStore, email: session.user.email }));
    }
  }, [userStore, session?.user?.email, isYearly]);

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

  const handleUpdatePlan = async () => {
    setIsLoading(true);
    const stripeCheckout = await createCheckoutUpdateSession({
      planPrice: planPrice ?? stripePrice(plan, isYearly) ?? "",
      plan,
      si: userInfo?.activeSubscription.subscriptionItemId ?? "",
      isYearly,
      seatQuantity,
      isMeteredUsage,
      customQte,
      customMode,
      creditByMonth,
      customDiscountId,
      subscriptionId: userInfo?.activeSubscription?.subscription?.id ?? "",
    });
    if (!stripeCheckout) {
      setIsLoading(false);
      return;
    }
    if (stripeCheckout === true) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      setShowConfetti(true);
      fetchUserStore(session?.user?.email ?? "");
      const updatedUserInfo = getUserInfos({
        user: userStore,
        email: session?.user?.email ?? "",
      });
      setUserInfo(updatedUserInfo);
      setIsCurrentPlan(true);
      setIsLoading(false);
      toaster({
        type: "success",
        description: t("updateSuccess"),
      });
      return setTimeout(() => {
        router.push("/dashboard#Billing");
      }, 3000);
    }
  };

  const handleStripe = async () => {
    setIsLoading(true);
    const price = stripePrice(plan, isYearly);
    const stripeCheckout = await createCheckoutSession({
      planPrice: planPrice ?? price ?? "0",
      plan,
      isYearly,
      creditByMonth,
      customMode,
      seatQuantity,
    });
    setIsLoading(false);
    if (!stripeCheckout) return;
    return router.push(stripeCheckout as any);
  };

  const handleStripeCustom = async () => {
    setIsLoading(true);
    const stripeCheckout = await createCheckoutCustomSession({
      priceId: planPrice ?? stripePrice(plan, isYearly) ?? "",
      creditByMonth,
      customQte,
      isMeteredUsage,
      customMode,
      customDiscountId,
      customTrialDays,
    });
    setIsLoading(false);
    if (!stripeCheckout) return;
    return router.push(stripeCheckout as any);
  };

  const handleSignin = () => {
    router.push("/login");
  };

  return (
    <>
      {showConfetti && (
        <Confetti
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
          numberOfPieces={500}
          recycle={false}
          gravity={0.5}
          initialVelocityY={30}
        />
      )}
      <ButtonWithLoader
        type="button"
        disabled={isLoading || isCurrentPlan}
        loading={isLoading}
        variant={isCurrentPlan ? "outline" : "second"}
        className={cn(
          { "shadow-theming-text-100-second/50 !opacity-100": isCurrentPlan },
          className
        )}
        onClick={() => {
          session?.user === undefined || session === undefined
            ? handleSignin()
            : userInfo?.activeSubscription
            ? handleUpdatePlan()
            : customMode
            ? handleStripeCustom()
            : handleStripe();
        }}>
        {userInfo?.activeSubscription ? (
          isCurrentPlan ? (
            <>{t("currentPlan")}</>
          ) : (
            <>{t("upgrade")}</>
          )
        ) : (
          <>
            {saasSettings.saasType === "PAY_ONCE" || customMode === "payment"
              ? t("buyNow")
              : plan.isTrial
              ? t("startTrial", { varIntlTrialDays: plan.trialDays })
              : t("subscribeNow")}
          </>
        )}
      </ButtonWithLoader>
    </>
  );
};
