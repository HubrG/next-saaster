"use client";
import { addNewMRRSPlan } from "@/src/components/features/pages/admin/actions.server";
import { Button } from "@/src/components/ui/button";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { SaasTypeReadableName } from "@/src/functions/SaasTypes";
import { useSaasMRRSPlansStore } from '@/src/stores/saasMRRSPlansStore';
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { PlusSquare } from "lucide-react";

export const AddPlan = () => {
  const { saasSettings } = useSaasSettingsStore();
  const  { saasMRRSPlans, setSaasMRRSPlans } = useSaasMRRSPlansStore();
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
      <div className="flex justify-start my-5 mb-5">
        <Button
          className="!p-0"
          variant={"link"}
         
          onClick={handleAddPlan}>
          <PlusSquare className="icon" />
          Add a new {saasType} plan
        </Button>
      </div>
    </>
  );
};
