"use client";
import { createNewPlan } from "@/app/[locale]/admin/queries/saas/saas-pricing/stripe-plan.action";
import { SimpleLoader } from "@/src/components/ui/@fairysaas/loader";
import { toaster } from "@/src/components/ui/@fairysaas/toaster/ToastConfig";
import { Button } from "@/src/components/ui/button";
import { SaasTypeReadableName } from "@/src/helpers/functions/SaasTypes";
import { isStripeSetted } from "@/src/helpers/functions/isStripeSetted";
import useScrollToSection from "@/src/hooks/useScrollToSection";
import { cn } from "@/src/lib/utils";
import { useSaasPlanToFeatureStore } from "@/src/stores/admin/saasPlanToFeatureStore";
import { useSaasPlansStore } from "@/src/stores/admin/saasPlansStore";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { iPlanToFeature } from "@/src/types/db/iPlanToFeature";
import { iPlan } from "@/src/types/db/iPlans";
import { PlusSquare, Settings2 } from "lucide-react";
import { useState } from "react";
import { AddButtonWrapper } from "../@ui/AddButtonWrapper";

export const AddPlan = () => {
  const { saasSettings } = useSaasSettingsStore();
  const { saasPlans, setSaasPlans } = useSaasPlansStore();
  const { saasPlanToFeature, setSaasPlanToFeature } =
    useSaasPlanToFeatureStore();
  let saasType = SaasTypeReadableName(saasSettings.saasType);
  const [loading, setLoading] = useState(false);
  const handleScroll = useScrollToSection();

  const handleAddPlan = async () => {
    setLoading(true);
    const newPlan = await createNewPlan(saasSettings.saasType);

    if (newPlan.error) {
      setLoading(false);
      return toaster({
        type: "error",
        description: newPlan.error,
      });
    }

    setSaasPlans([...saasPlans, newPlan.plan as iPlan]);

    if (newPlan.features && newPlan.features.length > 0) {
      const newFeaturesMapped = newPlan.features?.map((feature) => {
        return {
          ...feature,
          plan: newPlan.plan,
        };
      });
      
      setSaasPlanToFeature([
        ...saasPlanToFeature,
        ...(newFeaturesMapped as unknown as iPlanToFeature[]),
      ]);
    }
    toaster({
      type: "success",
      description: `New ${saasType} plan created`,
    });
    setTimeout(() => {
      handleScroll("dd" + newPlan.plan?.id, "smooth");
    }, 1000);
    setLoading(false);
    return newPlan;
  };
  const scrollToBusinessModel = useScrollToSection();

  return (
    <div className="w-full flex flex-row justify-between items-center">
      <AddButtonWrapper id="plan-tooltip">
        <Button
          className={cn("!p-0")}
          disabled={!isStripeSetted()}
          variant={"link"}
          onClick={handleAddPlan}>
          {loading ? <SimpleLoader /> : <PlusSquare className="icon" />}
          Add a new {saasType} plan
        </Button>
      </AddButtonWrapper>
      <Button
        onClick={(e) => {
          scrollToBusinessModel("sub-saas-set-saas-type");
        }}
        variant={"link"}>
        <Settings2 className="icon" /> Change business model
      </Button>
    </div>
  );
};
