"use client";

import { revokeCoupon } from "@/app/[locale]/admin/queries/saas/saas-pricing/stripe-coupon.action";
import { toaster } from "@/src/components/ui/@fairysaas/toaster/ToastConfig";
import { convertCurrencyName } from "@/src/helpers/functions/convertCurencies";
import { useSaasPlansStore } from "@/src/stores/admin/saasPlansStore";
import { useSaasStripeCoupons } from "@/src/stores/admin/stripeCouponsStore";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { iPlan } from "@/src/types/db/iPlans";
import { MinusCircle } from "lucide-react";
import { Tooltip } from "react-tooltip";

type Props = {
  plan: iPlan;
  recurrence: "monthly" | "yearly" | "once";
  monthlyP?: number;
  yearlyP?: number;
  onceP?: number;
  className?: string;
};

export const CouponApplied = ({
  plan,
  recurrence,
  monthlyP,
  onceP,
  className,
  yearlyP,
}: Props) => {
  const { saasPlans, setSaasPlans } = useSaasPlansStore();
  const { saasStripeCoupons } = useSaasStripeCoupons();
  const { saasSettings } = useSaasSettingsStore();
  const planCoupons = saasPlans.find((p) => p.id === plan.id)?.coupons;

  const calculatePriceWithDiscount = (
    price: number,
    discount: number,
    mode: "percent" | "fixed"
  ) => {
    if (mode === "percent") {
      return price - price * (discount / 100);
    } else if (mode === "fixed") {
      return price - discount;
    }
    return price;
  };
 const calculatePrice = (price: number, coupon: any) => {
   let discount = 0;
   let mode = "fixed"; 

   if (coupon?.percent_off) {
     discount = coupon.percent_off;
     mode = "percent";
   } else if (coupon?.amount_off) {
     discount = coupon.amount_off;
     mode = "fixed";
   }

   const discountedPrice =
     calculatePriceWithDiscount(price * 100, discount, mode as "percent" | "fixed") / 100;
   return discountedPrice.toFixed(2);
 };
  const handleRevokeCoupon = async (couponId: string) => {
    const revoke = await revokeCoupon(couponId);
    if (revoke) {
      setSaasPlans((currentPlans: iPlan[]) => {
        const updatedPlans = currentPlans.map((planItem) => {
          if (planItem.id === plan.id) {
            const updatedCoupons = planItem.coupons?.filter(
              (coupon) => coupon.id !== couponId
            );
            return {
              ...planItem,
              coupons: updatedCoupons,
            };
          }
          return planItem;
        });
        return updatedPlans;
      });

      toaster({
        type: "success",
        description: `Coupon has been revoked from the plan ${
          recurrence && `for ${recurrence} price`
        }`,
      });
    } else {
      toaster({
        type: "error",
        description: `Failed to revoke coupon from the plan ${
          recurrence && `for ${recurrence} price`
        }`,
      });
    }
  };

  return (
    <div className={className}>
      {planCoupons?.map((coupon) => {
        const stripeCoupon = saasStripeCoupons.find(
          (c) => c.id === coupon.couponId
        );
        if (coupon.recurrence === recurrence && coupon.PlanId === plan.id) {
          return (
            <div
              key={plan.id + coupon.couponId}
              className="flex flex-row items-center gap-x-2 ">
              <MinusCircle
                data-tooltip-id={`revoke-coupon-${plan.id}${coupon.id}`}
                onClick={() => handleRevokeCoupon(coupon.id)}
                size={12}
                className=" text-destructive opacity-80 hover:opacity-100 hover:cursor-pointer"
              />
              <p className="text-xs flex flex-row font-light self-center">
                <span>
                  - {stripeCoupon?.percent_off
                        ? stripeCoupon?.percent_off + "%"
                        : ((stripeCoupon?.amount_off??0)/100) +
                          `${convertCurrencyName(stripeCoupon?.currency ?? "usd","sigle")}`}{" "}
                  {stripeCoupon?.duration === "once"
                    ? "for once"
                    : stripeCoupon?.duration === "repeating"
                    ? stripeCoupon?.duration_in_months + " months"
                    : "for lifetime"}
                </span>
                <small className="opacity-50">
                  {stripeCoupon?.name} {stripeCoupon?.id}
                </small>
                <small className="opacity-50">
                  Tot.{" "}
                  {recurrence === "monthly" &&
                    monthlyP &&
                    calculatePrice(monthlyP, stripeCoupon)}
                  {recurrence === "yearly" &&
                    yearlyP &&
                    calculatePrice(yearlyP, stripeCoupon)}
                  {recurrence === "once" &&
                    onceP &&
                    calculatePrice(onceP, stripeCoupon)}
                  {saasSettings?.currency}
                </small>
              </p>

              <Tooltip
                id={`revoke-coupon-${plan.id}${coupon.id}`}
                opacity={100}
                place="top"
                className="tooltip">
                Revoke {recurrence} coupon
              </Tooltip>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};
