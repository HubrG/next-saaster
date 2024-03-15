"use client";

import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Separator } from "@/src/components/ui/separator";
import { sliced } from "@/src/helpers/functions/slice";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { iPlan } from "@/src/types/db/iPlans";
import { Plan } from "@prisma/client";
import { PlanCardSwitch } from "../PlanCardSwitch";

interface UsageInputFieldsProps {
  planState: iPlan;
  plan: iPlan;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement> | string,
    name: string
  ) => void;
}

export const UsageInputFields = ({
  planState,
  plan,
  handleInputChange,
}: UsageInputFieldsProps) => {
  const { saasSettings } = useSaasSettingsStore();

  return (
    <>
      {!planState.isFree && !planState.isCustom && (
        <>
          <div className="flex flex-row items-center">
            <Label htmlFor={`${plan.id}meteredMode`} className="w-2/3">
              Usage mode
            </Label>
            <Select
              defaultValue={planState.meteredMode ?? "unit"}
              onValueChange={(e) => {
                handleInputChange(e, "meteredMode");
              }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a usage mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Usage mode</SelectLabel>
                  <SelectItem value="UNIT">Per unit</SelectItem>
                  <SelectItem value="PACKAGE">Per package</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-row items-center">
            <Label htmlFor={`${plan.id}monthlyPrice`} className="w-2/3">
              Billing period
            </Label>
            <Select
              defaultValue={planState.meteredBillingPeriod ?? "weekly"}
              onValueChange={(e) => {
                handleInputChange(e, "meteredBillingPeriod");
              }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a usage mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Billing usage period</SelectLabel>
                  <SelectItem value="DAY">Daily</SelectItem>
                  <SelectItem value="WEEK">Weekly</SelectItem>
                  <SelectItem value="MONTH">Monthly</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

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
      {!planState.isFree &&
        !planState.isCustom && (
        <>
         <Separator />
          <div className="flex flex-col">
            <div className="inputs">
              <Label htmlFor={`${plan.id}monthlyPrice`}>
                Price {planState.meteredMode === "UNIT" && "per unit"}
              </Label>
              <Input
                id={`${plan.id}monthlyPrice`}
                name="monthlyPrice"
                type="number"
                className="!col-span-6"
                value={planState.monthlyPrice ?? ""}
                onChange={(e) => handleInputChange(e, "monthlyPrice")}
              />
              <p className="col-span-2">{saasSettings.currency}</p>
            </div>
          </div>
          </>
        )}
      {planState.meteredMode === "PACKAGE" && 
        !planState.isFree &&
        !planState.isCustom && (
        <div className="inputs">
          <Label htmlFor={`${plan.id}UsageBatch`}>Per</Label>
          <Input
            id={`${plan.id}UsageBatch`}
            type="number"
            name="meteredUnit"
            value={planState.meteredUnit ?? ""}
            onChange={(e) => handleInputChange(e, "meteredUnit")}
          />
          <p>{sliced(saasSettings.creditName ?? "credits", 5)}</p>
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
