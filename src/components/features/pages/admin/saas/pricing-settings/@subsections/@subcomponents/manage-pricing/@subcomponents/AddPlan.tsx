"use client";
import { addNewMRRSPlan } from "@/src/components/features/pages/admin/actions.server";
import { Button } from "@/src/components/ui/button";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { SaasTypeReadableName } from "@/src/functions/SaasTypeReadableName";
import { useSaasMRRSPlans } from '@/src/stores/saasMRRSPlans';
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";

export const AddPlan = () => {
  const { saasSettings } = useSaasSettingsStore();
  const  { saasMRRSPlans, setSaasMRRSPlans } = useSaasMRRSPlans();
  let saasType = SaasTypeReadableName(saasSettings.saasType);
 
  const handleAddPlan = async () => {
    if (saasSettings.saasType === "MRR_SIMPLE") {
      const newPlan = await addNewMRRSPlan();
      setSaasMRRSPlans([...saasMRRSPlans, newPlan]);
      toaster({
        type: "success",
        description: `New ${saasType} plan created`,
      });
      return newPlan;
    }
  };

  return (
    <>
      <div className="flex justify-center my-5 mb-12">
        <Button className="" onClick={handleAddPlan}>
          Add a new {saasType} plan
        </Button>
      </div>
    </>
  );
};
