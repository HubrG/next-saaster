"use client";
import { Button } from "@/src/components/ui/button";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { getPlans } from "@/src/helpers/utils/plans";
import { getPlansToFeatures } from "@/src/helpers/utils/plansToFeatures";
import useSaasPlansStore from "@/src/stores/admin/saasPlansStore";
import { useSaasPlanToFeatureStore } from "@/src/stores/admin/saasPlanToFeatureStore";
import { Info, RefreshCcw } from "lucide-react";
import React from "react";
import { Tooltip } from "react-tooltip";

type Props = {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};
export const SyncFromStripe = ({ setLoading }: Props) => {
  const { setSaasPlans, saasPlans } = useSaasPlansStore();
  const { setSaasPlanToFeature, saasPlanToFeature } =
    useSaasPlanToFeatureStore();
  const handleSyncWithStripe = async () => {
    // Sync with Stripe
    setLoading(true);
    setSaasPlans([]);
    const plans = await getPlans();
    if (!plans.success) {
      toaster({ type: "error", description: plans.error });
    }
    const toFeatures = await getPlansToFeatures();
    if (!toFeatures.success) {
      toaster({ type: "error", description: toFeatures.error });
    }
    if (plans) setSaasPlans(plans.data);
    if (toFeatures) setSaasPlanToFeature(toFeatures.data);

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
