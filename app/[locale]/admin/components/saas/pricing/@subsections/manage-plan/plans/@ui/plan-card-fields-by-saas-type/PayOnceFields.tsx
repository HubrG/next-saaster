"use client";

import { Input } from "@/src/components/ui/@shadcn/input";
import { Label } from "@/src/components/ui/@shadcn/label";
import { useSlice } from "@/src/hooks/utils/useSlice";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { iPlan } from "@/src/types/db/iPlans";
import { PopoverCoupon } from "../../../stripe-coupons/@ui/PopoverCoupon";
import { CouponApplied } from "../CouponApplied";

interface PayOnceInputFieldsProps {
  planState: iPlan;
  plan: iPlan;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => void | ((e: boolean, name: string) => void);
}

export const PayOnceFields = ({
  planState,
  plan,
  handleInputChange,
}: PayOnceInputFieldsProps) => {
  const { saasSettings } = useSaasSettingsStore();

  return (
    <>
      {!planState.isCustom && (
        <div className="flex flex-col">
          <CouponApplied
            className="w-full"
            recurrence={"once"}
            plan={plan}
            onceP={planState.oncePrice ?? 0}
          />
          <div className="inputs">
            <Label htmlFor={`${plan.id}monthlyPrice`} className="!self-start">
              Price
            </Label>
            <Input
              id={`${plan.id}Price`}
              name="oncePrice"
              type="number"
              onClick={(e) => e.currentTarget.select()}
              className="!col-span-5"
              value={planState.oncePrice ?? ""}
              onChange={(e) => handleInputChange(e, "oncePrice")}
            />
            <PopoverCoupon
              type={plan.saasType}
              planId={plan.id}
              recurrence="once"
              />
            <p className="col-span-2 text-right">{saasSettings.currency}</p>
          </div>
              {saasSettings.activeCreditSystem && !planState.isCustom && (
                <div className="inputs mt-3">
                  <Label htmlFor={`${plan.id}creditAllouedByMonth`}>
                    Credit alloued
                  </Label>
                  <Input
                    id={`${plan.id}creditAllouedByMonth`}
                    type="number"
                    name="creditAllouedByMonth"
                    className="!col-span-5"
                    value={planState.creditAllouedByMonth ?? ""}
                    onChange={(e) => handleInputChange(e, "creditAllouedByMonth")}
                  />
                  <p className="!col-span-1 flex flex-col items-start justify-end">
                    <span>
                      {useSlice(saasSettings.creditName ?? "credits", 6)}
                    </span>
                    <span>{planState.saasType === "PER_SEAT" && <>/user</>}</span>
                  </p>
                </div>
              )}
        </div>
      )}
    </>
  );
};
