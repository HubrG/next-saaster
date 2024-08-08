"use client";
import { Goodline } from "@/src/components/ui/@aceternity/good-line";
import { Card } from "@/src/components/ui/@shadcn/card";
import {
  ReturnUserDependencyProps,
  getUserInfos,
} from "@/src/helpers/dependencies/user-info";
import { cn } from "@/src/lib/utils";
import { useSessionQuery } from "@/src/queries/useSessionQuery";
import useSaasPlansStore from "@/src/stores/admin/saasPlansStore";
import { useSaasStripeCoupons } from "@/src/stores/admin/stripeCouponsStore";
import { useSaasStripePricesStore } from "@/src/stores/admin/stripePricesStore";
import { usePublicSaasPricingStore } from "@/src/stores/publicSaasPricingStore";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { useUserStore } from "@/src/stores/userStore";
import { iPlan } from "@/src/types/db/iPlans";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { PriceCardBadge } from "../PriceCardBadge";
import { PriceCardBuyButton } from "../PriceCardBuyButton";
import { PriceCardFeatures } from "../PriceCardFeatures";
import { CustomPriceCardHeader } from "./CustomPriceCardHeader";

type PriceCardProps = {
  planId?: string;
  productId?: string;
  priceId: string;
  discountId?: string;
  customPrice?: number;
  reccurence?: "monthly" | "yearly" | "weekly" | "daily";
  reccurenceEvery?: string;
  customPriceStroke?: number;
  slash?: string;
  className?: string;
  children?: React.ReactNode;
  creditByMonth?: number;
  trialDays?: number;
  customQuantity?: number;
  smallPriceDescription?: string;
  customMode: "subscription" | "payment";
  enableQuantity?: boolean;
  displayOnRecurrence?: "custom1" | "custom2" | "custom3" | "custom4";
};
export const CustomPriceCard = ({
  customQuantity,
  className,
  customPriceStroke,
  discountId,
  smallPriceDescription,
  slash,
  priceId,
  enableQuantity,
  customMode,
  customPrice,
  trialDays,
  creditByMonth,
  displayOnRecurrence,
  children,
}: PriceCardProps) => {
  const { saasPlans } = useSaasPlansStore();
  const { saasSettings } = useSaasSettingsStore();
  const { saasStripeCoupons, fetchSaasStripeCoupons } = useSaasStripeCoupons();
  const [priceWithDiscount, setPriceWithDiscount] = useState<number>();
  const { saasStripePrices, fetchSaasStripePrices } =
    useSaasStripePricesStore();
  const t = useTranslations("Pricing.Components.CardHeader");
  useEffect(() => {
    fetchSaasStripePrices();
    fetchSaasStripeCoupons();
  }, []);
  const { customIs1, customIs2, customIs3, customIs4 } =
    usePublicSaasPricingStore();

  const stripePrice = saasStripePrices.find((price) => price.id === priceId);
  const discount = saasStripeCoupons.find((coupon) => coupon.id === discountId);
  const [plan, setPlan] = useState<iPlan>();
  const { data: session } = useSessionQuery();
  const [userInfo, setUserInfo] = useState<
    ReturnUserDependencyProps | undefined
  >(undefined);
  const { seatQuantity, setSeatQuantity } = usePublicSaasPricingStore();
  const { userStore, fetchUserStore } = useUserStore();
  const [customSeatQuantity, setCustomSeatQuantity] = useState(1);
  const [stripeSeatQuantity, setStripeSeatQuantity] = useState(1);

  const handleIncrement = (type: "custom" | "stripe") => {
    if (type === "custom") {
      setCustomSeatQuantity(customSeatQuantity + 1);
      updatePrice(customSeatQuantity + 1, "custom");
    } else {
      setStripeSeatQuantity(stripeSeatQuantity + 1);
      updatePrice(stripeSeatQuantity + 1, "stripe");
    }
  };

  const handleDecrement = (type: "custom" | "stripe") => {
    if (type === "custom" && customSeatQuantity > 1) {
      setCustomSeatQuantity(customSeatQuantity - 1);
      updatePrice(customSeatQuantity - 1, "custom");
    } else if (type === "stripe" && stripeSeatQuantity > 1) {
      setStripeSeatQuantity(stripeSeatQuantity - 1);
      updatePrice(stripeSeatQuantity - 1, "stripe");
    }
  };

  const updatePrice = (quantity: number, type: "custom" | "stripe") => {
    if (type === "stripe" && stripePrice) {
      const newPrice = ((stripePrice.unit_amount ?? 0) * quantity) / 100;
      setPriceWithDiscount(newPrice);
    } else if (type === "custom" && customPrice) {
      const newPrice = customPrice * quantity;
      setPriceWithDiscount(newPrice);
    }
  };
  useEffect(() => {
    setUserInfo(
      getUserInfos({ user: userStore, email: session?.user.email ?? "" })
    );
  }, [userStore, session?.user?.email]);

  useEffect(() => {
    if (stripePrice && discount) {
      if (discount.percent_off) {
        const priceW =
          (stripePrice?.unit_amount ?? 0) -
          ((stripePrice?.unit_amount ?? 0) * (discount?.percent_off ?? 0)) /
            100;
        setPriceWithDiscount(priceW / 100);
      } else if (discount.amount_off) {
        const priceW =
          (stripePrice?.unit_amount ?? 0) / 100 - discount.amount_off / 100;
        setPriceWithDiscount(priceW / 100);
      }
    } else {
      setPriceWithDiscount((stripePrice?.unit_amount ?? 0) / 100);
    }
  }, [stripePrice, discount]);

  useEffect(() => {
    if (stripePrice) {
      const foundPlan = saasPlans.find(
        (e) => e.id === stripePrice?.productRelation?.PlanId
      );
      setPlan(foundPlan);
    }
  }, [stripePrice, saasPlans]);

  if (!plan) {
    return <></>;
  }


  // Vérifier si displayOnRecurrence est défini
  if (displayOnRecurrence) {
    // Vérifier la valeur de customIs1, customIs2, customIs3 ou customIs4 en fonction de displayOnRecurrence
    const isDisplayed =
      (displayOnRecurrence === "custom1" && customIs1) ||
      (displayOnRecurrence === "custom2" && customIs2) ||
      (displayOnRecurrence === "custom3" && customIs3) ||
      (displayOnRecurrence === "custom4" && customIs4);
    if (!isDisplayed) {
      return <></>;
    }
  } else {
    // Si displayOnRecurrence n'est pas défini, afficher uniquement customIs1
    if (!customIs1) {
      return <></>;
    }
  }


  return (
    <Card
      className={cn(
        {
          "card-popular": plan.isPopular || plan.isRecommended,
        },
        `price-card-wrapper flex flex-col justify-between z-0 ${className}`
      )}>
      <PriceCardBadge
        text={
          plan.isPopular
            ? t("popular")
            : plan.isRecommended
            ? t("recommended")
            : null
        }
      />
      <div className="flex flex-col justify-between">
        <CustomPriceCardHeader
          plan={plan}
          priceId={priceId}
          trialDays={trialDays}
          userInfo={userInfo}
          customPrice={(customPrice ?? 0) * seatQuantity}
          slash={slash}
          smallPriceDescription={smallPriceDescription}
          stripePrice={stripePrice}
          discountId={discountId}
          customPriceStroke={customPriceStroke}
          priceWithDiscount={priceWithDiscount}
          saasSettings={saasSettings}
          creditByMonth={creditByMonth}
        />

        {enableQuantity ? (
          <>
            <Goodline />
            <div className="grid grid-cols-3">
              <button
                onClick={() =>
                  handleDecrement(
                    enableQuantity && !customPrice ? "stripe" : "custom"
                  )
                }
                className="btn-decrement">
                -
              </button>
              <span className={className}>{stripeSeatQuantity}</span>
              <button
                onClick={() => handleIncrement("stripe")}
                className="btn-increment">
                +
              </button>
            </div>
            <Goodline />
          </>
        ) : (
          <div className="block !mt-20">&nbsp;</div>
        )}
        <PriceCardBuyButton
          isMeteredUsage={stripePrice?.recurring_usage_type === "metered"}
          plan={plan}
          className="mt-0"
          customQte={
            customQuantity ? customQuantity : enableQuantity ? seatQuantity : 1
          }
          customTrialDays={trialDays}
          planPrice={priceId}
          creditByMonth={creditByMonth}
          customMode={customMode}
          customDiscountId={discountId}
        />
        <Goodline />
        <PriceCardFeatures plan={plan} />
      </div>
      {children}
    </Card>
  );
};
