"use client";

import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { sliced } from "@/src/helpers/functions/slice";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { iPlan } from "@/src/types/iPlans";
import { Plan } from "@prisma/client";
import { PopoverCoupon } from "../../../stripe-coupons/@ui/PopoverCoupon";
import { CouponApplied } from "../CouponApplied";
import { PlanCardSwitch } from "../PlanCardSwitch";

interface MRRInputFieldsProps {
  planState: iPlan;
  plan: iPlan;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => void | ((e: boolean, name: string) => void);
}

export const MRRInputFields = ({
  planState,
  plan,
  handleInputChange,
}: MRRInputFieldsProps) => {
  const { saasSettings } = useSaasSettingsStore();

  return (
    <>
      {planState.isTrial && (
        <div className="inputs">
          <Label htmlFor={`${plan.id}trialDays`}>Trial days</Label>
          <Input
            type="number"
            name="trialDays"
            value={planState.trialDays ?? ""}
            onChange={(e) => handleInputChange(e, "trialDays")}
          />
          <p>days</p>
        </div>
      )}
      {saasSettings.activeMonthlyPlans &&
        !planState.isFree &&
        !planState.isCustom && (
          <div className="flex flex-col">
            <CouponApplied
              recurrence={"monthly"}
              plan={plan}
              monthlyP={planState.monthlyPrice ?? 0}
              yearlyP={planState.yearlyPrice ?? 0}
            />
            <div className="inputs">
              <Label htmlFor={`${plan.id}monthlyPrice`}>Monthly price</Label>
              <Input
                id={`${plan.id}monthlyPrice`}
                name="monthlyPrice"
                type="number"
                className="!col-span-4"
                value={planState.monthlyPrice ?? ""}
                onChange={(e) => handleInputChange(e, "monthlyPrice")}
              />
              <PopoverCoupon
                type={plan.saasType}
                planId={plan.id}
                recurrence="monthly"
              />
              <p className="col-span-3 flex items-center justify-center">
                {saasSettings.currency}{" "}
                {planState.saasType === "PER_SEAT" && <span>/user</span>}
              </p>
            </div>
          </div>
        )}
      {saasSettings.activeYearlyPlans &&
        !planState.isFree &&
        !planState.isCustom && (
          <div className="flex flex-col">
                <CouponApplied
                  recurrence={"yearly"}
                  plan={plan}
                  monthlyP={planState.monthlyPrice ?? 0}
                  yearlyP={planState.yearlyPrice ?? 0}
                />
            <div className="inputs">
              <Label htmlFor={`${plan.id}yearlyPrice`}>
                Yearly price
              </Label>
              <Input
                type="number"
                name="yearlyPrice"
                value={planState.yearlyPrice ?? ""}
                className="!col-span-4"
                onChange={(e) => handleInputChange(e, "yearlyPrice")}
              />
              <PopoverCoupon
                type={plan.saasType}
                planId={plan.id}
                recurrence="yearly"
              />
              <p className="col-span-3 flex items-center justify-center">
                {saasSettings.currency}{" "}
                {planState.saasType === "PER_SEAT" && <span>/user</span>}
              </p>
            </div>
          </div>
        )}
      {saasSettings.activeCreditSystem && !planState.isCustom && (
        <div className="inputs">
          <Label htmlFor={`${plan.id}creditAllouedByMonth`}>
            Credit alloued
          </Label>
          <Input
            id={`${plan.id}creditAllouedByMonth`}
            type="number"
            name="creditAllouedByMonth"
            className="!col-span-4"
            value={planState.creditAllouedByMonth ?? ""}
            onChange={(e) => handleInputChange(e, "creditAllouedByMonth")}
          />
          <p className="!col-span-2 flex flex-col items-start justify-end">
            <span>{sliced(saasSettings.creditName ?? "credits", 6)}/month</span>
            <span>{planState.saasType === "PER_SEAT" && <>/user</>}</span>
          </p>
        </div>
      )}
    </>
  );
};
type ReccuringSwitchFieldsProps = {
  planState: Plan;
  plan: Plan;
  handleInputChange: (e: boolean, name: string) => void;
};
export const RecurringSwitchFields = ({
  planState,
  plan,
  handleInputChange,
}: ReccuringSwitchFieldsProps) => {
  return (
    <>
      <PlanCardSwitch
        plan={plan as iPlan}
        label="Free plan"
        planState={planState.isFree}
        name="isFree"
        handleInputChange={handleInputChange}
      />
      <PlanCardSwitch
        plan={plan as iPlan}
        label="Trial plan"
        planState={planState.isTrial}
        name="isTrial"
        handleInputChange={handleInputChange}
      />
    </>
  );
};
