"use client";
import { addNewMRRSPlan } from "@/src/components/features/pages/admin/actions.server";
import { Button } from "@/src/components/ui/button";
import { SimpleLoader } from "@/src/components/ui/loader";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { SaasTypeReadableName } from "@/src/functions/SaasTypes";
import { useSaasMRRSPlanToFeatureStore } from "@/src/stores/saasMRRSPlanToFeatureStore";
import { useSaasMRRSPlansStore } from '@/src/stores/saasMRRSPlansStore';
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { PlusSquare } from "lucide-react";
import { useState } from "react";

export const AddPlan = () => {
  const { saasSettings } = useSaasSettingsStore();
  const { saasMRRSPlans, setSaasMRRSPlans } = useSaasMRRSPlansStore();
  const { saasMRRSPlanToFeature, setSaasMRRSPlanToFeature } = useSaasMRRSPlanToFeatureStore();
  let saasType = SaasTypeReadableName(saasSettings.saasType);
  const [loading, setLoading] = useState(false);
 
  const handleAddPlan = async () => {
    setLoading(true);
    if (saasSettings.saasType === "MRR_SIMPLE") {
      const newPlan = await addNewMRRSPlan();
      if (!newPlan) {
        setLoading(false);
        return;
      }
      console.log("newPlan", newPlan);
      setSaasMRRSPlans([...saasMRRSPlans, newPlan.newPlan]);
      // On met à jour le saasMRRSPlanToFeature
      if (newPlan.newFeatures.length > 0) {
      const newFeaturesMapped = newPlan.newFeatures.map((feature) => {
        // Créer un nouvel objet MRRSPlanToFeatureWithPlanAndFeature pour chaque fonctionnalité
        return {
          ...feature,
          plan: newPlan.newPlan, 
        };
      });
         setSaasMRRSPlanToFeature([
           ...saasMRRSPlanToFeature,
           ...newFeaturesMapped as any,
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
        <Button className="!p-0" variant={"link"} onClick={handleAddPlan}>
          {loading ? <SimpleLoader /> : <PlusSquare className="icon" />}
          Add a new {saasType} plan
        </Button>
      </div>
    </>
  );
};
