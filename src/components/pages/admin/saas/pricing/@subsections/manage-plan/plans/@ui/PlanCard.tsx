"use client";
import { updatePlan } from "@/src/components/pages/admin/queries/queries";
import { manageClashes } from "@/src/components/pages/admin/saas/pricing/@subsections/manage-plan/plans/@functions/manageClashes";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/src/components/ui/collapsible";
import { CopySomething } from "@/src/components/ui/copy-something";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Separator } from "@/src/components/ui/separator";
import { Switch } from "@/src/components/ui/switch";
import { Textarea } from "@/src/components/ui/textarea";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { parseIntInput } from "@/src/functions/parse";
import { cn } from "@/src/lib/utils";
import { useSaasPlanToFeatureStore } from "@/src/stores/admin/saasPlanToFeatureStore";
import { useSaasPlansStore } from "@/src/stores/admin/saasPlansStore";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { iPlanToFeature } from "@/src/types/iPlanToFeature";
import { iPlan } from "@/src/types/iPlans";
import { Plan } from "@prisma/client";
import isEqual from "lodash/isEqual";
import { ChevronsUpDown, Eye, EyeOff, Grip } from "lucide-react";
import { useEffect, useState } from "react";
import { SortableKnob } from "react-easy-sort";
import { PlanCardButtons } from "./PlanCardButtons";
import { PlanCardSwitch } from "./PlanCardSwitch";
import { PayOnceFields } from "./plan-card-fields-by-saas-type/PayOnceFields";
import {
  ReccuringInputFields,
  RecurringSwitchFields,
} from "./plan-card-fields-by-saas-type/RecurringFields";

type Props = {
  plan: Plan;
  className?: string;
  draggableId?: string;
};
export const PlanCard = ({ plan, className }: Props) => {
  const [loading, setLoading] = useState(false);
  const [planState, setPlanState] = useState(plan);
  const [isOpen, setIsOpen] = useState(false);
  const [initialPlanState, setInitialPlanState] = useState({ ...plan });
  const [cancel, setCancel] = useState(false);
  const [save, setSave] = useState(false);
  const { saasSettings } = useSaasSettingsStore();
  const { updatePlanFromStore, deletePlanFromStore } = useSaasPlansStore();
  const { saasPlanToFeature, setSaasPlanToFeature } =
    useSaasPlanToFeatureStore();

  // Check if the plan has changed
  useEffect(() => {
    const hasChanged = !isEqual(initialPlanState, planState);
    hasChanged ? setSaveAndCancel(true) : setSaveAndCancel(false);
  }, [initialPlanState, planState]);

  // Handle input change, and manage clashes
  const handleInputChange = (e: any, name: string) => {
    let value: any;
    if (e?.target?.value !== undefined) {
      value = e.target.value;
    } else {
      value = e;
    }
    value = parseIntInput(
      [
        "trialDays",
        "monthlyPrice",
        "yearlyPrice",
        "creditAllouedByMonth",
        "oncePrice",
      ],
      name,
      value
    );
    setPlanState((prevState) => {
      const newData = { ...prevState, [name]: value };
      return manageClashes(newData, name);
    });
  };

  // Handle save plan
  const handleSave = async () => {
    setLoading(true);
    const dataToSet = await updatePlan(planState.id, {
      ...planState,
      trialDays: planState.trialDays ?? 0,
    });
    if (dataToSet) {
      setSaveAndCancel(false);
      setInitialPlanState({ ...planState });
      updatePlanFromStore(planState.id, planState);
      setSaasPlanToFeature(
        saasPlanToFeature.map((item) =>
          item.planId === planState.id ? { ...item, plan: planState } : item
        ) as iPlanToFeature[]
      );
      setLoading(false);
      return toaster({
        description: `Plan ${planState.name} changed successfully`,
        type: "success",
      });
    } else {
      setLoading(false);
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
    const dataToSet = await updatePlan(planState.id, {
      ...planState,
      deleted: true,
      deletedAt: new Date(),
    });
    if (dataToSet) {
      deletePlanFromStore(planState.id);
      setSaasPlanToFeature(
        saasPlanToFeature.map((item) =>
          item.planId === planState.id
            ? { ...item, plan: { ...planState, deleted: true } }
            : item
        ) as iPlanToFeature[]
      );
      setSaveAndCancel(false);
      setInitialPlanState({ ...dataToSet });
      return toaster({
        description: `« ${planState.name} » archived successfully.`,
        type: "success",
        duration: 8000,
      });
    } else {
      return toaster({
        description: `Error while archiving plan ${planState.name}, please try again later`,
        type: "error",
      });
    }
  };

  const handleReset = () => {
    setPlanState(initialPlanState);
    setCancel(false);
  };

  return (
    <div className="item-content" id={"dd" + plan.id}>
      <div
        className={`admin-plan-card !pb-4  ${className}  ${
          planState.active && "active"
        } `}>
        {planState.active && (
          <Badge className="plan-card-active-badge">Active</Badge>
        )}
        <SortableKnob>
          <Grip
            className="dd-icon absolute top-0 right-0.5 w-5"
            data-tooltip-id={"tt-knob-" + plan.id}
          />
        </SortableKnob>
        <Input
          name="name"
          value={planState.name ?? ""}
          onClick={(e) => {
            planState.name === "Plan name" && e.currentTarget.select();
          }}
          className="font-bold text-lg text-center !bg-transparent"
          onChange={(e) => handleInputChange(e, "name")}
        />
        <Textarea
          name="description"
          onClick={(e) => {
            planState.description === "Plan description" &&
              e.currentTarget.select();
          }}
          className="text-center !bg-transparent"
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

          <CollapsibleContent className="space-y-2">
            <Separator className="border-b bg-transparent mt-4" />
            {saasSettings.saasType !== "PAY_ONCE" && (
              <RecurringSwitchFields
                planState={planState}
                plan={plan}
                handleInputChange={handleInputChange}
              />
            )}
            <PlanCardSwitch
              plan={plan as iPlan}
              label="Custom plan"
              planState={planState.isCustom}
              name="isCustom"
              handleInputChange={handleInputChange}
            />
            <Separator className="border-b bg-transparent border-dashed" />
            <PlanCardSwitch
              plan={plan as iPlan}
              label="Popular"
              planState={planState.isPopular}
              name="isPopular"
              handleInputChange={handleInputChange}
            />
            <PlanCardSwitch
              plan={plan as iPlan}
              label="Recommended"
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
            <div className="w-full flex flex-col gap-y-3">
              {saasSettings.saasType !== "PAY_ONCE" && (
                <ReccuringInputFields
                  plan={plan as iPlan}
                  planState={planState as iPlan}
                  handleInputChange={handleInputChange}
                />
              )}
              {saasSettings.saasType === "PAY_ONCE" && (
                <PayOnceFields
                  plan={plan as iPlan}
                  planState={planState as iPlan}
                  handleInputChange={handleInputChange}
                />
              )}
            </div>
          </CollapsibleContent>
          <div className="flex items-center justify-between rounded-default  p-2  space-x-4">
            <CollapsibleTrigger asChild>
              <h4 className="text-sm cursor-pointer w-full font-bold italic flex gap-x-2  flex-row items-center">
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
            </CollapsibleTrigger>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-9 p-0">
                <ChevronsUpDown className="h-4 w-4" />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
        </Collapsible>
        <Separator className="-mt-2 border-t border !border-dashed" />
        <div className="flex flex-row w-full justify-self-end justify-between place-items-end flex-1">
          <PlanCardButtons
            {...{
              isLoading: loading,
              save,
              cancel,
              handleSave,
              handleReset,
              handleDelete,
              handleInputChange,
              saasTypeState: planState.saasType,
            }}
          />
        </div>
      </div>
      <div>
        <div className="!text-xs mb-0 text-center py-2 flex flex-col flex-shrink w-2/3 mx-auto ">
          <CopySomething
            what="Plan ID"
            copyText={plan.id}
            id={"plan-id-copy-" + plan.id}>
            <strong className="!text-xs opacity-70 ">ID :</strong> {plan.id}
          </CopySomething>
          <CopySomething
            what="Stripe ID"
            copyText={plan.stripeId ?? ""}
            id={"plan-stripeid-copy-" + plan.id}>
            <strong className="!text-xs opacity-70 ">Stripe ID :</strong>{" "}
            {plan.stripeId}
          </CopySomething>
        </div>
      </div>
    </div>
  );
};
