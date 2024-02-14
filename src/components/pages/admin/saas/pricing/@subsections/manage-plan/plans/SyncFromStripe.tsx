"use client";
import { Button } from "@/src/components/ui/button";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { getPlans } from "@/src/helpers/utils/plans";
import { getPlansToFeatures } from "@/src/helpers/utils/plansToFeatures";
import useSaasMRRSPlansStore from "@/src/stores/admin/saasMRRSPlansStore";
import { useSaasMRRSPlanToFeatureStore } from "@/src/stores/admin/saasMRRSPlanToFeatureStore";
import { Info, RefreshCcw } from "lucide-react";
import React from "react";
import { Tooltip } from "react-tooltip";

type Props = {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};
export const SyncFromStripe = ({ setLoading }: Props) => {
  const { setSaasMRRSPlans, saasMRRSPlans } = useSaasMRRSPlansStore();
  const { setSaasMRRSPlanToFeature, saasMRRSPlanToFeature } =
    useSaasMRRSPlanToFeatureStore();
  const handleSyncWithStripe = async () => {
    // Sync with Stripe
    setLoading(true);
    setSaasMRRSPlans([]);
    const plans = await getPlans();
    if (!plans.success) {
      toaster({ type: "error", description: plans.error });
    }
    const toFeatures = await getPlansToFeatures();
    if (!toFeatures.success) {
      toaster({ type: "error", description: toFeatures.error });
    }
    if (plans) setSaasMRRSPlans(plans.data);
    if (toFeatures) setSaasMRRSPlanToFeature(toFeatures.data);

    toaster({ type: "success", description: "Plans synced from Stripe" });
    setLoading(false);
  };
  return (
    <>
      <Button variant={"link"} onClick={handleSyncWithStripe}>
        <RefreshCcw className="icon" /> Sync plans (products) from{" "}
        <Info className="icon" data-tooltip-id="sync-plan-stripe-info" />
      </Button>
      <Tooltip
        className="tooltip flex flex-col"
        opacity={100}
        id="sync-plan-stripe-info">
        <span>
          If you have created or updated a plan or price in Stripe, you can sync
          it here to reflect the changes in this view. Otherwise, refresh the
          page to see the changes.
        </span>
      </Tooltip>
    </>
  );
};
