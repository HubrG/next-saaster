"use client";
import { updateMRRSPlan } from "@/src/components/features/pages/admin/queries/queries";
import { manageClashes } from "@/src/components/features/pages/admin/saas/saas-pricing/@subsections/manage-plan/MRRS/@functions/manageClashes";
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
import { sliced } from "@/src/functions/slice";
import { cn } from "@/src/lib/utils";
import { useSaasMRRSPlanToFeatureStore } from "@/src/stores/admin/saasMRRSPlanToFeatureStore";
import { useSaasMRRSPlansStore } from "@/src/stores/admin/saasMRRSPlansStore";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { MRRSPlan } from "@prisma/client";
import isEqual from "lodash/isEqual";
import { ChevronsUpDown, Eye, EyeOff, Grip } from "lucide-react";
import { useEffect, useState } from "react";
import { SortableKnob } from "react-easy-sort";
import { PlanCardButtons } from "./PlanCardButtons";
import { PlanCardSwitch } from "./PlanCardSwitch";
import { useSaasStripeProductsStore } from "@/src/stores/admin/stripeProductsStore";
import { PopoverCoupon } from "../../../@subcomponents/@ui/PopoverCoupon";
import { useSaasStripeCoupons } from "@/src/stores/admin/stripeCouponsStore";
import { CouponApplied } from "./CouponApplied";

type Props = {
  plan: MRRSPlan;
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
  const { saasMRRSPlans, setSaasMRRSPlans } = useSaasMRRSPlansStore();
  const { saasStripeProducts, setSaasStripeProducts } =
    useSaasStripeProductsStore();
  const { saasMRRSPlanToFeature, setSaasMRRSPlanToFeature } =
    useSaasMRRSPlanToFeatureStore();
  const { saasStripeCoupons } = useSaasStripeCoupons();
  // console.log(saasMRRSPlans);

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
      ["trialDays", "monthlyPrice", "yearlyPrice", "creditAllouedByMonth"],
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
    const dataToSet = await updateMRRSPlan(planState.id, {
      ...planState,
      trialDays: planState.trialDays ?? 0,
    });
    if (dataToSet) {
      setSaveAndCancel(false);
      setInitialPlanState({ ...planState });
      setSaasMRRSPlans(
        saasMRRSPlans.map((plan) =>
          plan.id === planState.id ? { ...planState } : plan
        )
      );
      setSaasMRRSPlanToFeature(
        saasMRRSPlanToFeature.map((item) =>
          item.planId === planState.id ? { ...item, plan: planState } : item
        )
      );
      setSaasStripeProducts(
        saasStripeProducts.map((product) =>
          product.MRRSPlanId === planState.id
            ? {
                ...product,
                name: planState.name ?? product.name,
                MRRSPlanRelation: planState,
                description: planState.description,
                active: planState.active ? planState.active : false,
                product: product.MRRSPlanId,
              }
            : product
        )
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
    const dataToSet = await updateMRRSPlan(planState.id, {
      ...planState,
      deleted: true,
      deletedAt: new Date(),
    });
    if (dataToSet) {
      setSaasMRRSPlans(
        saasMRRSPlans.map((plan) =>
          plan.id === planState.id
            ? { ...plan, deleted: true, position: 999, deletedAt: new Date() }
            : plan
        )
      );
      setSaasMRRSPlanToFeature(
        saasMRRSPlanToFeature.map((item) =>
          item.planId === planState.id
            ? { ...item, plan: { ...planState, deleted: true } }
            : item
        )
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
              label="Popular"
              planState={planState.isPopular}
              name="isPopular"
              handleInputChange={handleInputChange}
            />

            <PlanCardSwitch
              plan={plan}
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
              {/* {saasStripeCoupons.forEach((coupon) => {
              if (Object.keys(coupon.StripePlanCoupons).includes(plan.id)) {
                console.log(coupon);
              }
           } */}

              {saasSettings.activeMonthlyPlans &&
                !planState.isFree &&
                !planState.isCustom && (
                  <div className="flex flex-col">
                    <div className="inputs">
                      <Label htmlFor={`${plan.id}monthlyPrice`}>
                        Monthly price
                        <CouponApplied
                          recurrence={"monthly"}
                          plan={plan}
                          monthlyP={planState.monthlyPrice ?? 0}
                          yearlyP={planState.yearlyPrice ?? 0}
                        />
                      </Label>
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
                      <p className="col-span-3">{saasSettings.currency}</p>
                    </div>
                  </div>
                )}
              {saasSettings.activeYearlyPlans &&
                !planState.isFree &&
                !planState.isCustom && (
                  <div className="flex flex-col">
                    <div className="inputs">
                      <Label htmlFor={`${plan.id}yearlyPrice`}>
                        Yearly price
                        <CouponApplied
                          recurrence={"yearly"}
                          plan={plan}
                          monthlyP={planState.monthlyPrice ?? 0}
                          yearlyP={planState.yearlyPrice ?? 0}
                        />
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
                      <p className="col-span-3">{saasSettings.currency}</p>
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
                    value={planState.creditAllouedByMonth ?? ""}
                    onChange={(e) =>
                      handleInputChange(e, "creditAllouedByMonth")
                    }
                  />
                  <p>
                    <span>
                      {sliced(saasSettings.creditName ?? "credits", 5)}
                    </span>
                    <span>/month</span>
                  </p>
                </div>
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
