"use client";
import { updateMRRSPlan } from "@/src/components/features/pages/admin/actions.server";
import { manageClashes } from "@/src/components/features/pages/admin/saas/saas-pricing/@subsections/manage-plan/@subcomponents/@functions/manageClashes";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/src/components/ui/collapsible";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Separator } from "@/src/components/ui/separator";
import { Switch } from "@/src/components/ui/switch";
import { Textarea } from "@/src/components/ui/textarea";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { parseIntInput } from "@/src/functions/parse";
import { sliced } from "@/src/functions/slice";
import { cn } from "@/src/lib/utils";
import { useSaasMRRSPlans } from "@/src/stores/saasMRRSPlans";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { MRRSPlan } from "@prisma/client";
import {
  ChevronsUpDown,
  Eye,
  EyeOff
} from "lucide-react";
import { useEffect, useState } from "react";
import { PlanCardButtons } from "./PlanCardButtons";
import { PlanCardSwitch } from "./PlanCardSwitch";

type Props = {
  plan: MRRSPlan;
  modeAdmin?: boolean;
  className?: string;
};
export const PlanCard = ({ plan, modeAdmin, className }: Props) => {
  const [planState, setPlanState] = useState(plan);
  const [isOpen, setIsOpen] = useState(false);
  const [initialPlanState, setInitialPlanState] = useState({ ...plan });
  const [cancel, setCancel] = useState(false);
  const [save, setSave] = useState(false);
  const { saasSettings } = useSaasSettingsStore();
  const { saasMRRSPlans, setSaasMRRSPlans } = useSaasMRRSPlans();

  // Handle input change, and manage clashes
  const handleInputChange = (e: any, name: string) => {
    let value: any;
    if (e?.target?.value !== undefined) {
      value = e.target.value;
    } else {
      value = e;
    }
    value = parseIntInput(
      ["trialDays", "monthlyPrice", "yearlyPrice", "creditAllouedByMonth"],
      name,
      value
    ); 
    setPlanState((prevState) => {
      const newData = { ...prevState, [name]: value };
      return manageClashes(newData, name);
    });
  };

  // Check if the plan has changed
  useEffect(() => {
    const initialPlanStr = JSON.stringify(initialPlanState);
    const currentPlanStr = JSON.stringify(planState);
    initialPlanStr !== currentPlanStr
      ? setSaveAndCancel(true)
      : setSaveAndCancel(false);
  }, [initialPlanState, planState]);

  const handleSave = async () => {
    const dataToSet = await updateMRRSPlan(planState.id, {
      ...planState,
      trialDays: planState.trialDays ?? 0,
    });
    if (dataToSet) {
      setSaveAndCancel(false);
      setInitialPlanState({ ...dataToSet });
      return toaster({
        description: `Plan ${planState.name} changed successfully`,
        type: "success",
      });
    } else {
      return toaster({
        description: `Error while changing plan ${planState.name}, please try again later`,
        type: "error",
      });
    }
  };

  // Set save and cancel to true or false
  const setSaveAndCancel = (value: boolean) => {
    setSave(value);
    setCancel(value);
  };

  // Handle delete plan
  const handleDelete = async () => {
    const dataToSet = await updateMRRSPlan(planState.id, {
      ...planState,
      deleted: true,
      deletedAt: new Date(),
    });
    if (dataToSet) {
      setSaasMRRSPlans(
        saasMRRSPlans.map((plan) =>
          plan.id === planState.id
            ? { ...plan, deleted: true, deletedAt: new Date() }
            : plan
        )
      );
      setSaveAndCancel(false);
      setInitialPlanState({ ...dataToSet });
      return toaster({
        description: `« ${planState.name} » deleted successfully, you can restore it in the trash.`,
        type: "success",
        duration: 8000,
      });
    } else {
      return toaster({
        description: `Error while deleting plan ${planState.name}, please try again later`,
        type: "error",
      });
    }
  };

  const handleCancel = () => {
    setPlanState(initialPlanState);
    setCancel(false);
  };

  if (!plan.deleted) {
    return (
      <div
        className={`admin-plan-card  ${className}  ${
          planState.active && "active"
        } `}>
        {planState.active && (
          <Badge className="absolute badge !font-semibold !rounded-bl-none !rounded-tr-none !rounded-default -mt-8 left-0  bg-primary dark:text-text-900 text-text-900">
            <strong className="!text-xs !font-semibold">Active</strong>
          </Badge>
        )}
        <Input
          name="name"
          value={planState.name ?? ""}
          onClick={(e) => {
            planState.name === "Plan name" && e.currentTarget.select();
          }}
          className="font-bold text-lg text-center"
          onChange={(e) => handleInputChange(e, "name")}
        />
        <Textarea
          name="description"
          onClick={(e) => {
            planState.description === "Plan description" &&
              e.currentTarget.select();
          }}
          className="text-center"
          value={planState.description ?? ""}
          onChange={(e) => handleInputChange(e, "description")}
        />

        <Separator />
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="space-y-2 w-full">
          <div className="switch">
            <Switch
              name="active"
              id={`${plan.id}active`}
              checked={planState.active ?? false}
              onCheckedChange={(e) => handleInputChange(e, "active")}
            />
            <Label htmlFor={`${plan.id}active`}>Active this plan</Label>
          </div>
          <div className="flex items-center justify-between rounded-default  p-2 bg-primary space-x-4">
            <h4 className="text-sm font-bold italic flex gap-x-2  flex-row items-center">
              {!isOpen && (
                <>
                  <Eye className="w-8" /> Show
                </>
              )}
              {isOpen && (
                <>
                  <EyeOff className="w-8" /> Hide
                </>
              )}{" "}
              all options
            </h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-9 p-0">
                <ChevronsUpDown className="h-4 w-4" />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent className="space-y-2">
            <PlanCardSwitch
              plan={plan}
              label="Free plan"
              planState={planState.isFree}
              name="isFree"
              handleInputChange={handleInputChange}
            />
            <PlanCardSwitch
              plan={plan}
              label="Custom plan"
              planState={planState.isCustom}
              name="isCustom"
              handleInputChange={handleInputChange}
            />
            <PlanCardSwitch
              plan={plan}
              label="Trial plan"
              planState={planState.isTrial}
              name="isTrial"
              handleInputChange={handleInputChange}
            />
            <Separator className="border-b bg-transparent border-dashed" />

            <PlanCardSwitch
              plan={plan}
              label="Popular plan"
              planState={planState.isPopular}
              name="isPopular"
              handleInputChange={handleInputChange}
            />

            <PlanCardSwitch
              plan={plan}
              label="Recommended plan"
              planState={planState.isRecommended}
              name="isRecommended"
              handleInputChange={handleInputChange}
            />
            <Separator
              className={cn(
                {
                  hidden:
                    planState.isCustom ||
                    ((planState.isFree || planState.isCustom) &&
                      !saasSettings.activeCreditSystem),
                },
                "!mb-4"
              )}
            />

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
            {saasSettings.activeYearlyPlans &&
              !planState.isFree &&
              !planState.isCustom && (
                <div className="inputs">
                  <Label htmlFor={`${plan.id}yearlyPrice`}>Yearly price</Label>
                  <Input
                    name="yearlyPrice"
                    value={planState.yearlyPrice ?? ""}
                    onChange={(e) => handleInputChange(e, "yearlyPrice")}
                  />
                  <p>{saasSettings.currency}</p>
                </div>
              )}
            {saasSettings.activeMonthlyPlans &&
              !planState.isFree &&
              !planState.isCustom && (
                <div className="inputs">
                  <Label htmlFor={`${plan.id}monthlyPrice`}>
                    Monthly price
                  </Label>
                  <Input
                    id={`${plan.id}monthlyPrice`}
                    name="monthlyPrice"
                    value={planState.monthlyPrice ?? ""}
                    onChange={(e) => handleInputChange(e, "monthlyPrice")}
                  />
                  <p>{saasSettings.currency}</p>
                </div>
              )}
            {saasSettings.activeCreditSystem && !planState.isCustom && (
              <div className="inputs">
                <Label htmlFor={`${plan.id}creditAllouedByMonth`}>
                  Credit alloued
                </Label>
                <Input
                  id={`${plan.id}creditAllouedByMonth`}
                  name="creditAllouedByMonth"
                  value={planState.creditAllouedByMonth ?? ""}
                  onChange={(e) => handleInputChange(e, "creditAllouedByMonth")}
                />
                <p>
                  <span>{sliced(saasSettings.creditName ?? "credits", 5)}</span>
                  <span>/month</span>
                </p>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>

        <Separator className="-mt-2 border-t border !border-dashed" />
        <div className="flex flex-row w-full justify-self-end justify-between place-items-end flex-1">
          <PlanCardButtons {...{ save, cancel, handleSave, handleCancel, handleDelete, setCancel }} />
        </div>
      </div>
    );
  }
};
