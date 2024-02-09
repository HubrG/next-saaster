import {
  applyCoupon,
  revokeCoupon,
} from "@/src/components/features/pages/admin/queries/queries";
import { Button } from "@/src/components/ui/button";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import {
  MRRSPlanStore,
  useSaasMRRSPlansStore,
} from "@/src/stores/admin/saasMRRSPlansStore";
import { useSaasStripeCoupons } from "@/src/stores/admin/stripeCouponsStore";
import { Delete, Minus, MinusCircle } from "lucide-react";
import React from "react";
import { Tooltip } from "react-tooltip";
import { SaasSettings } from '@prisma/client';
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
type Props = {
  plan: MRRSPlanStore;
  recurrence: "monthly" | "yearly" | "once";
  monthlyP: number;
  yearlyP: number;
};
export const CouponApplied = ({ plan, recurrence, monthlyP, yearlyP }: Props) => {
  const { saasMRRSPlans, setSaasMRRSPlans } = useSaasMRRSPlansStore();
  const { saasStripeCoupons } = useSaasStripeCoupons();
  const { saasSettings } = useSaasSettingsStore();
  const planCoupons = saasMRRSPlans.find((p) => p.id === plan.id)?.coupons;
  const calculYearlyPriceWithDiscount = (price: number, discount: number) => {
    return price - price * (discount / 100);
  };
  const calculMonthlyPriceWithDiscount = (price: number, discount: number) => {
    return price - price * (discount / 100);
  };
  const handleRevokeCoupon = async (couponId: string) => {
    const revoke = await revokeCoupon(couponId);
    if (revoke) {
      setSaasMRRSPlans((currentPlans: MRRSPlanStore[]) => {
        const updatedPlans = currentPlans.map((planItem) => {
          if (planItem.id === plan.id) {
            // Filtrer les coupons pour supprimer celui qui a l'ID correspondant à revoke.id
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
        description: `Coupon has been revoke to the plan ${
          recurrence && `for ${recurrence} price`
        }`,
      });
    } else {
      toaster({
        type: "error",
        description: `Coupon could not be applied to the plan ${
          recurrence && `for ${recurrence} price`
        }`,
      });
    }
  };
  // let monthlyPriceDiscounted =
  //   plan.StripeProduct?.findLast((e) => e.id === plan.stripeId)?.prices.find(
  //     (e) => e.id === plan.stripeMonthlyPriceId
  //   )?.unit_amount ?? 0 / 100;
  // let yearlyPriceDiscounted =
  //   plan.StripeProduct?.findLast((e) => e.id === plan.stripeId)?.prices.find(
  //     (e) => e.id === plan.stripeYearlyPriceId
  //   )?.unit_amount ?? 0 / 100;
  return (
    <div>
      {planCoupons?.map((coupon) => {
        const stripeCoupon = saasStripeCoupons.find(
          (c) => c.id === coupon.couponId
        );

        if (coupon.recurrence === recurrence && coupon.MRRSPlanId === plan.id) {
          return (
            <div
              key={plan.id + coupon.couponId}
              className="flex flex-row items-center gap-x-2 mt-1">
              <MinusCircle
                data-tooltip-id={`revoke-coupon-${plan.id}${coupon.id}`}
                onClick={() => handleRevokeCoupon(coupon.id)}
                size={12}
                className="self-start text-destructive opacity-80 hover:opacity-100 hover:cursor-pointer"
              />
              <p className="text-xs flex flex-col font-light">
                -{stripeCoupon?.percentOff ?? "Coupon"}%{" "}
                {stripeCoupon?.duration === "once"
                  ? "for once"
                  : stripeCoupon?.duration === "repeating"
                  ? stripeCoupon?.durationInMonths + " months"
                  : "for lifetime"}
                <small className="-mt-2 opacity-50">
                  {stripeCoupon?.name} — {stripeCoupon?.id}
                </small>
                <small className="-mt-3 opacity-50">
                  Tot.{" "}
                  {recurrence === "monthly" &&
                    (
                      calculMonthlyPriceWithDiscount(
                        monthlyP * 100,
                        stripeCoupon?.percentOff ?? 0
                      ) / 100
                    ).toFixed(2)}
                  {recurrence === "yearly" &&
                    (
                      calculYearlyPriceWithDiscount(
                        yearlyP * 100,
                        stripeCoupon?.percentOff ?? 0
                      ) / 100
                    ).toFixed(2)}{" "}
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
