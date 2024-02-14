"use client";

import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { MRRSPlan } from "@prisma/client";
import { PopoverCoupon } from "../../../stripe-coupons/@ui/PopoverCoupon";
import { CouponApplied } from "../CouponApplied";

interface PayOnceInputFieldsProps {
  planState: MRRSPlan;
  plan: MRRSPlan;
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
          <div className="inputs">
            <Label htmlFor={`${plan.id}monthlyPrice`}>
              Price
              <CouponApplied
                recurrence={"once"}
                plan={plan}
                onceP={planState.oncePrice ?? 0}
              />
            </Label>
            <Input
              id={`${plan.id}Price`}
              name="oncePrice"
              type="number"
              className="!col-span-4"
              value={planState.oncePrice ?? ""}
              onChange={(e) => handleInputChange(e, "oncePrice")}
            />
            <PopoverCoupon
              type={plan.saasType}
              planId={plan.id}
              recurrence="once"
            />
            <p className="col-span-3">{saasSettings.currency}</p>
          </div>
        </div>
      )}
    </>
  );
};
