"use client";
import { revokeCoupon } from "@/src/components/pages/admin/queries/queries";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import {
  PlanStore,
  useSaasPlansStore,
} from "@/src/stores/admin/saasPlansStore";
import { useSaasStripeCoupons } from "@/src/stores/admin/stripeCouponsStore";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { MinusCircle } from "lucide-react";
import { Tooltip } from "react-tooltip";
type Props = {
  plan: PlanStore;
  recurrence: "monthly" | "yearly" | "once";
  monthlyP?: number;
  yearlyP?: number;
  onceP?: number;
};
export const CouponApplied = ({
  plan,
  recurrence,
  monthlyP,
  onceP,
  yearlyP,
}: Props) => {
  const { saasPlans, setSaasPlans } = useSaasPlansStore();
  const { saasStripeCoupons } = useSaasStripeCoupons();
  const { saasSettings } = useSaasSettingsStore();
  const planCoupons = saasPlans.find((p) => p.id === plan.id)?.coupons;

  const calculYearlyPriceWithDiscount = (price: number, discount: number) => {
    return price - price * (discount / 100);
  };
  const calculMonthlyPriceWithDiscount = (price: number, discount: number) => {
    return price - price * (discount / 100);
  };

  const calculOncePriceWithDiscount = (price: number, discount: number) => {
    return price - price * (discount / 100);
  };
  const handleRevokeCoupon = async (couponId: string) => {
    const revoke = await revokeCoupon(couponId);
    if (revoke) {
      setSaasPlans((currentPlans: PlanStore[]) => {
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
  console.log(saasPlans);
  return (
    <div>
      {planCoupons?.map((coupon) => {
        const stripeCoupon = saasStripeCoupons.find(
          (c) => c.id === coupon.couponId
        );

        if (coupon.recurrence === recurrence && coupon.PlanId === plan.id) {
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
                    monthlyP &&
                    (
                      calculMonthlyPriceWithDiscount(
                        monthlyP * 100,
                        stripeCoupon?.percentOff ?? 0
                      ) / 100
                    ).toFixed(2)}
                  {recurrence === "yearly" &&
                    yearlyP &&
                    (
                      calculYearlyPriceWithDiscount(
                        yearlyP * 100,
                        stripeCoupon?.percentOff ?? 0
                      ) / 100
                    ).toFixed(2)}{" "}
                  {recurrence === "once" &&
                    onceP &&
                    (
                      calculOncePriceWithDiscount(
                        onceP * 100,
                        stripeCoupon?.percentOff ?? 0
                      ) / 100
                    ).toFixed(2)}
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
