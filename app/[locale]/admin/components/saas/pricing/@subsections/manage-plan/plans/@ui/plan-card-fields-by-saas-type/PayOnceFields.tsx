"use client";

import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
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
        </div>
      )}
    </>
  );
};
