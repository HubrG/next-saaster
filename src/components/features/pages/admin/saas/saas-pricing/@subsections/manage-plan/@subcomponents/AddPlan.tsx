"use client";
import { addNewMRRSPlan } from "@/src/components/features/pages/admin/queries/queries";
import { Button } from "@/src/components/ui/button";
import { SimpleLoader } from "@/src/components/ui/loader";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { SaasTypeReadableName } from "@/src/functions/SaasTypes";
import { cn } from "@/src/lib/utils";
import { useSaasMRRSPlanToFeatureStore } from "@/src/stores/saasMRRSPlanToFeatureStore";
import { useSaasMRRSPlansStore } from "@/src/stores/saasMRRSPlansStore";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { MRRSPlan, StripeProduct } from "@prisma/client";
import { PlusSquare } from "lucide-react";
import { useState } from "react";
import { Tooltip } from "react-tooltip";
import { useSaasStripeProductsStore } from "@/src/stores/stripeProductsStore";

export const AddPlan = () => {
  const { saasSettings } = useSaasSettingsStore();
  const { saasMRRSPlans, setSaasMRRSPlans } = useSaasMRRSPlansStore();
  const { saasStripeProducts, setSaasStripeProducts } =
    useSaasStripeProductsStore();
  const { saasMRRSPlanToFeature, setSaasMRRSPlanToFeature } =
    useSaasMRRSPlanToFeatureStore();
  let saasType = SaasTypeReadableName(saasSettings.saasType);
  const [loading, setLoading] = useState(false);

  const handleAddPlan = async () => {
    setLoading(true);
    if (saasSettings.saasType === "MRR_SIMPLE") {
      const newPlan = await addNewMRRSPlan();
      if (!newPlan || !newPlan.newPlan) {
        setLoading(false);
        return;
      }
      setSaasMRRSPlans([...saasMRRSPlans, newPlan.newPlan as MRRSPlan]);
      if (newPlan.newFeatures.length > 0) {
        const newFeaturesMapped = newPlan.newFeatures.map((feature) => {
          return {
            ...feature,
            plan: newPlan.newPlan,
          };
        });
        setSaasMRRSPlanToFeature([
          ...saasMRRSPlanToFeature,
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

      setLoading(false);
      return newPlan;
    }
  };

  return (
    <>
      <div className="flex justify-start my-5 mb-5">
        <div
          className={cn(
            {
              "cursor-not-allowed":
                process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined ||
                process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY?.length < 4,
            },
            "flex items-center gap-2"
          )}
          data-tooltip-id="add-plan-tooltip">
          <Button
            className={cn("!p-0")}
            disabled={
              process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined ||
              process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY?.length < 4
            }
            variant={"link"}
            onClick={handleAddPlan}>
            {loading ? <SimpleLoader /> : <PlusSquare className="icon" />}
            Add a new {saasType} plan
          </Button>
          {process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined ||
            (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY?.length < 4 && (
              <Tooltip id="add-plan-tooltip" className="tooltip">
                <span>
                  You need to fill your Stripe API keys in the <code>.env</code>{" "}
                  file to be able to add a new plan.
                </span>
              </Tooltip>
            ))}
        </div>
      </div>
    </>
  );
};
