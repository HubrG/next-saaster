"use client";
import { manageClashes } from "@/app/[locale]/admin/components/saas/pricing/@subsections/manage-plan/plans/@functions/manageClashes";
import { updatePlan } from "@/app/[locale]/admin/queries/saas/saas-pricing/stripe-plan.action";
import { CopySomething } from "@/src/components/ui/@blitzinit/copy-something";
import { toaster } from "@/src/components/ui/@blitzinit/toaster/ToastConfig";
import { Badge } from "@/src/components/ui/@shadcn/badge";
import { Button } from "@/src/components/ui/@shadcn/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/src/components/ui/@shadcn/collapsible";
import { Input } from "@/src/components/ui/@shadcn/input";
import { Label } from "@/src/components/ui/@shadcn/label";
import { Separator } from "@/src/components/ui/@shadcn/separator";
import { Switch } from "@/src/components/ui/@shadcn/switch";
import { Textarea } from "@/src/components/ui/@shadcn/textarea";
import { parseFloatInput, parseIntInput } from "@/src/helpers/functions/parse";
import { handleError } from "@/src/lib/error-handling/handleError";
import { cn } from "@/src/lib/utils";
import { useSaasPlanToFeatureStore } from "@/src/stores/admin/saasPlanToFeatureStore";
import { useSaasPlansStore } from "@/src/stores/admin/saasPlansStore";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { iPlanToFeature } from "@/src/types/db/iPlanToFeature";
import { iPlan } from "@/src/types/db/iPlans";
import { motion } from "framer-motion";
import isEqual from "lodash/isEqual";
import {
  BugPlay,
  ChevronsUpDown,
  Eye,
  EyeOff,
  Grip,
  Radio,
} from "lucide-react";
import { useEffect, useState } from "react";
import { SortableKnob } from "react-easy-sort";
import { Tooltip } from "react-tooltip";
import { PlanCardButtons } from "./PlanCardButtons";
import { PlanCardSwitch } from "./PlanCardSwitch";
import {
  MRRInputFields,
  RecurringSwitchFields,
} from "./plan-card-fields-by-saas-type/MRRFields";
import { PayOnceFields } from "./plan-card-fields-by-saas-type/PayOnceFields";
import { UsageInputFields } from "./plan-card-fields-by-saas-type/UsageFields";

type Props = {
  plan: iPlan;
  className?: string;
  draggableId?: string;
};
export const PlanCard = ({ plan, className }: Props) => {
  const [loading, setLoading] = useState(false);
  const [planState, setPlanState] = useState<iPlan>(plan);
  const [isOpen, setIsOpen] = useState(false);
  const [initialPlanState, setInitialPlanState] = useState({ ...plan });
  const [cancel, setCancel] = useState(false);
  const [save, setSave] = useState(false);
  const { saasSettings } = useSaasSettingsStore();
  const { updatePlanFromStore, deletePlanFromStore } = useSaasPlansStore();
  const { saasPlanToFeature, setSaasPlanToFeature } =
    useSaasPlanToFeatureStore();
  const [showOptions, setShowOptions] = useState(false);

  // Check if the plan has changed
  useEffect(() => {
    const hasChanged = !isEqual(initialPlanState, planState);
    hasChanged ? setSaveAndCancel(true) : setSaveAndCancel(false);
  }, [initialPlanState, planState]);

  const handleShowOptions = () => {
    setShowOptions(!showOptions);
  };
  // Handle input change, and manage clashes
  const handleInputChange = (e: any, name: string) => {
    let value: any;
    if (e?.target?.value !== undefined) {
      value = e.target.value;
    } else {
      value = e;
    }
    if (
      saasSettings.saasType === "PAY_ONCE" ||
      saasSettings.saasType === "MRR_SIMPLE" ||
      saasSettings.saasType === "PER_SEAT"
    ) {
      value = parseIntInput(
        [
          "trialDays",
          "monthlyPrice",
          "yearlyPrice",
          "creditAllouedByMonth",
          "oncePrice",
          "meteredUnit",
        ],
        name,
        value
      );
    } else {
      value = parseFloatInput(
        ["trialDays", "monthlyPrice", "yearlyPrice"],
        name,
        value
      );
      value = parseIntInput(
        ["meteredUnit", "meteredMonthlyFlatAmount", "meteredYearlyFlatAmount"],
        name,
        value
      );
    }
    setPlanState((prevState: iPlan) => {
      const newData = { ...prevState, [name]: value };
      return manageClashes(newData, name) as iPlan;
    });
  };
  const rand = Math.floor(Math.random() * 1000);
  // Handle save plan
  const handleSave = async () => {
    setLoading(true);
    if (!planState.stripeId) {
      toaster({
        description:
          "Plan has no stripe ID, it has been automaticly archived to fix the problem. You can now dearchived it to retrieve the plan with his StripeId. Note : Check that Stripe webhooks are active.",
        type: "error",
        duration: 20000,
      });
      // setTimeOut
      setTimeout(() => {
        handleDelete();
      }, 5000);
      handleDelete();
      setLoading(false);
      return;
    }
    const dataToSet = await updatePlan({
      ...planState,
      id: planState.id,
      trialDays: planState.trialDays ?? 0,
      updatedAt: new Date(),
    });
    if (handleError(dataToSet).error) {
      setLoading(false);
      return toaster({
        description: handleError(dataToSet).message,
        type: "error",
      });
    }
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
      description: `Plan « ${planState.name} » updated successfully`,
      type: "success",
    });
  };
  // Set save and cancel to true or false
  const setSaveAndCancel = (value: boolean) => {
    setSave(value);
    setCancel(value);
  };

  // Handle archive plan
  const handleDelete = async () => {
    const dataToSet = await updatePlan({
      ...planState,
      deleted: true,
      deletedAt: new Date(),
    });
    if (handleError(dataToSet).error) {
      return toaster({
        description: handleError(dataToSet).message,
        type: "error",
      });
    }
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
      // setInitialPlanState(dataToSet.data ?? planState);
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
    <motion.div
      initial={{ opacity: 0, scale: 1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={cn(
        { "!col-span-1": showOptions },
        "item-content !select-none"
      )}>
      <div
        className={`admin-plan-card !pb-4  ${className}  ${
          planState.active && "active"
        } `}>
        {planState.active && (
          <Badge className="plan-card-active-badge">Active</Badge>
        )}
        {!planState.StripeProduct.find(
          (product) => product.PlanId === planState.id
        )?.livemode ? (
          <Badge
            className="plan-card-test-mode-badge flex-row-center"
            data-tooltip-id={`stripe-test-mode-tooltip-${rand}`}>
            <BugPlay className="icon test-xs" /> Stripe test mode
          </Badge>
        ) : (
          <Badge className="plan-card-live-mode-badge">
            <Radio className="icon" /> Stripe live mode
          </Badge>
        )}
        <Tooltip id={`stripe-test-mode-tooltip-${rand}`} className="tooltip">
          This product is in "test" mode on Stripe and cannot be actually
          purchased by the user. To switch to "live" mode, you need to change
          the Stripe API key and recreate all theses products and prices on
          here.
        </Tooltip>
        <SortableKnob>
          <Grip
            className="dd-icon absolute top-0 right-0.5 w-5"
            data-tooltip-id={"tt-knob-" + plan.id}
          />
        </SortableKnob>
        <Input
          name="name"
          value={planState.name ?? ""}
          onFocus={(e) =>
            planState.name === "New plan" && e.currentTarget.select()
          }
          className="font-bold text-lg text-center !bg-transparent"
          onChange={(e) => handleInputChange(e, "name")}
        />
        <Textarea
          name="description"
          onFocus={(e) =>
            planState.description === "New plan description" &&
            e.currentTarget.select()
          }
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
            {saasSettings.saasType !== "PAY_ONCE" &&
              saasSettings.saasType !== "CUSTOM" && (
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
              {saasSettings.saasType === "MRR_SIMPLE" && (
                <MRRInputFields
                  plan={plan as iPlan}
                  planState={planState as iPlan}
                  handleInputChange={handleInputChange}
                />
              )}
              {saasSettings.saasType === "PER_SEAT" && (
                <MRRInputFields
                  plan={plan as iPlan}
                  planState={planState as iPlan}
                  handleInputChange={handleInputChange}
                />
              )}
              {saasSettings.saasType === "METERED_USAGE" && (
                <UsageInputFields
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
          <div
            onClick={handleShowOptions}
            className="flex items-center justify-between border rounded-default  p-2  space-x-4">
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
    </motion.div>
  );
};
