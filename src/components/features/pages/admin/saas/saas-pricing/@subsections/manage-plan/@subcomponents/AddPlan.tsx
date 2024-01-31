"use client";
import { addNewMRRSPlan } from "@/src/components/features/pages/admin/actions.server";
import { Button } from "@/src/components/ui/button";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { SaasTypeReadableName } from "@/src/functions/SaasTypes";
import { useSaasMRRSPlanToFeatureStore } from "@/src/stores/saasMRRSPlanToFeatureStore";
import { useSaasMRRSPlansStore } from '@/src/stores/saasMRRSPlansStore';
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { PlusSquare } from "lucide-react";

export const AddPlan = () => {
  const { saasSettings } = useSaasSettingsStore();
  const { saasMRRSPlans, setSaasMRRSPlans } = useSaasMRRSPlansStore();
  const { saasMRRSPlanToFeature, setSaasMRRSPlanToFeature } = useSaasMRRSPlanToFeatureStore();
  let saasType = SaasTypeReadableName(saasSettings.saasType);
 
  const handleAddPlan = async () => {
    if (saasSettings.saasType === "MRR_SIMPLE") {
      const newPlan = await addNewMRRSPlan();
      setSaasMRRSPlans([...saasMRRSPlans, newPlan.newPlan]);
      
      // On met à jour le saasMRRSPlanToFeature
      if (newPlan.newFeatures.length > 0) {
      const newFeaturesMapped = newPlan.newFeatures.map((feature) => {
        // Créer un nouvel objet MRRSPlanToFeatureWithPlanAndFeature pour chaque fonctionnalité
        return {
          ...feature, // Supposons que 'feature' est déjà du type approprié
          plan: newPlan.newPlan, // Ajouter le plan associé
        };
      });
         setSaasMRRSPlanToFeature([
           ...saasMRRSPlanToFeature,
           ...newFeaturesMapped as any,
         ]);
      }

    // On met à jour l
  
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
