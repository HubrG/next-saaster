"use client";
import { Button } from "@/src/components/ui/button";
import { Loader } from "@/src/components/ui/loader";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { getPlans } from "@/src/helpers/utils/plans";
import { useSaasMRRSPlansStore } from "@/src/stores/admin/saasMRRSPlansStore";
import { Info, RefreshCcw } from "lucide-react";
import { Suspense, useState } from "react";
import { Tooltip } from "react-tooltip";
import { AddPlan } from "./plans/AddPlan";
import { PlansList } from "./plans/PlansList";

export const ManagePlans = () => {
  const { setSaasMRRSPlans, saasMRRSPlans } = useSaasMRRSPlansStore();
  const [loading, setLoading] = useState(false);

  const handleSyncWithStripe = async () => {
    // Sync with Stripe
    setLoading(true);
    setSaasMRRSPlans([]);
    const response = await getPlans();

    if (!response.success) {
      toaster({ type: "error", description: response.error });
    }
    if (response.data) setSaasMRRSPlans(response.data);
    toaster({ type: "success", description: "Plans synced from Stripe" });
    setLoading(false);
  };

  return (
    <>
      <div className="flex md:flex-row flex-col justify-between items-center">
        <AddPlan />
        <Button variant={"link"} onClick={handleSyncWithStripe}>
          <RefreshCcw className="icon" /> Sync plans (products) from Stripe{" "}
          <Info className="icon" data-tooltip-id="sync-plan-stripe-info" />
        </Button>
        <Tooltip className="tooltip flex flex-col" id="sync-plan-stripe-info">
          <span>
            If you have created or updated a plan or price in Stripe, you can
            sync it here to reflect the changes in this view. Otherwise, refresh
            the page to see the changes.
          </span>
        </Tooltip>
      </div>
      <Suspense fallback={<Loader noHFull />}>
        {loading || !saasMRRSPlans ? (
          <div className="flex justify-center items-center py-10">
            <Loader noHFull />
          </div>
        ) : (
          <PlansList />
        )}
      </Suspense>
    </>
  );
};
