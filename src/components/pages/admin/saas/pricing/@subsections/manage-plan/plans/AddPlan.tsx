"use client";
import { addNewPlan } from "@/src/components/pages/admin/queries/queries";
import { Button } from "@/src/components/ui/button";
import { SimpleLoader } from "@/src/components/ui/loader";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { SaasTypeReadableName } from "@/src/functions/SaasTypes";
import { isStripeSetted } from "@/src/functions/isStripeSetted";
import useScrollToSection from "@/src/hooks/useScrollToSection";
import { cn } from "@/src/lib/utils";
import { useSaasPlanToFeatureStore } from "@/src/stores/admin/saasPlanToFeatureStore";
import { useSaasPlansStore } from "@/src/stores/admin/saasPlansStore";
import { useSaasStripeProductsStore } from "@/src/stores/admin/stripeProductsStore";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { Plan, StripeProduct } from "@prisma/client";
import { PlusSquare } from "lucide-react";
import { useState } from "react";
import { AddButtonWrapper } from "../@ui/AddButtonWrapper";

export const AddPlan = () => {
  const { saasSettings } = useSaasSettingsStore();
  const { saasPlans, setSaasPlans } = useSaasPlansStore();
  const { saasStripeProducts, setSaasStripeProducts } =
    useSaasStripeProductsStore();
  const { saasPlanToFeature, setSaasPlanToFeature } =
    useSaasPlanToFeatureStore();
  let saasType = SaasTypeReadableName(saasSettings.saasType);
  const [loading, setLoading] = useState(false);
  const handleScroll = useScrollToSection();

  const handleAddPlan = async () => {
    setLoading(true);
    const newPlan = await addNewPlan(saasSettings.saasType ?? "MRR_SIMPLE");
    if (!newPlan || !newPlan.newPlan) {
      setLoading(false);
      return toaster({
        type: "error",
        description: `Failed to create new ${saasType} plan. Please try again.`,
      });
    }
    const modifiedNewPlan = {
      ...newPlan.newPlan,
      stripeId: newPlan.lastProduct?.id,
    };
    setSaasPlans([...saasPlans, modifiedNewPlan as Plan]);

    if (newPlan.newFeatures.length > 0) {
      const newFeaturesMapped = newPlan.newFeatures.map((feature) => {
        return {
          ...feature,
          plan: newPlan.newPlan,
        };
      });
      setSaasPlanToFeature([
        ...saasPlanToFeature,
        ...(newFeaturesMapped as any),
      ]);
      setSaasStripeProducts([
        ...saasStripeProducts,
        newPlan.lastProduct as StripeProduct,
      ]);
    }
    toaster({
      type: "success",
      description: `New ${saasType} plan created`,
    });
    setTimeout(() => {
      handleScroll("dd" + newPlan.newPlan.id, "smooth");
    }, 1000);
    setLoading(false);
    return newPlan;
  };

  return (
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
  );
};
