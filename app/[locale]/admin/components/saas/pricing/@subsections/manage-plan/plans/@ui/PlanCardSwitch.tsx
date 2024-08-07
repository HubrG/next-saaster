"use client";
import { Label } from "@/src/components/ui/@shadcn/label";
import { Switch } from "@/src/components/ui/@shadcn/switch";
import { iPlan } from "@/src/types/db/iPlans";
type Props = {
  plan: iPlan;
  planState: boolean | null;
  name: string;
  label: string;
  disabled?: boolean;
  handleInputChange: (e: boolean, name: string) => void;
};
export const PlanCardSwitch = ({
  plan,
  planState,
  label,
  name,
  handleInputChange,
}: Props) => {
  return (
    <div className="switch !justify-between">
      <Switch
        name={name}
        checked={planState ?? false}
        id={`${plan.id}${name}`}
        onCheckedChange={(e) => handleInputChange(e, name)}
      />
      <Label className="col-span-10 text-left" htmlFor={`${plan.id}${name}`}>
        {label}
      </Label>
    </div>
  );
};
