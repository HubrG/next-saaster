import { addNewMMRSFeature } from "@/src/components/features/pages/admin/actions.server";
import { Button } from "@/src/components/ui/button";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { SaasTypeReadableName } from "@/src/functions/SaasTypes";
import { useSaasMRRSFeaturesStore } from "@/src/stores/saasMRRSFeaturesStore";
import { useSaasMRRSPlanToFeatureStore } from "@/src/stores/saasMRRSPlanToFeatureStore";
import { useSaasMRRSPlansStore } from "@/src/stores/saasMRRSPlansStore";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { MRRSPlanToFeatureWithPlanAndFeature } from "@/src/types/MRRSPlanToFeatureWithPlanAndFeature";
import { PlusSquare } from "lucide-react";

export const AddFeature = () => {
  const { saasSettings } = useSaasSettingsStore();
  const { saasMRRSPlans, setSaasMRRSPlans } = useSaasMRRSPlansStore();
  const { saasMRRSFeatures, setSaasMRRSFeatures } = useSaasMRRSFeaturesStore();
  const { saasMRRSPlanToFeature, setSaasMRRSPlanToFeature } = useSaasMRRSPlanToFeatureStore();
  let saasType = SaasTypeReadableName(saasSettings.saasType);

  const handleAddPlan = async () => {
    if (saasSettings.saasType === "MRR_SIMPLE") {
      const newFeature = await addNewMMRSFeature();
      setSaasMRRSFeatures([...saasMRRSFeatures, newFeature.newFeature]);
      // On met à jour le saasMRRSPlanToFeature
      if (newFeature.newFeatures.length > 0) {
         console.log(newFeature.newFeatures);
        //  const newFeaturesMapped = newFeature.newFeatures.map((feature) => {
        //    // Créer un nouvel objet MRRSPlanToFeatureWithPlanAndFeature pour chaque fonctionnalité
        //    return {
        //      ...feature, // Supposons que 'feature' est déjà du type approprié
        //      { newFeature.newFeatures } // Ajouter le plan associé
        //    };
        //  });
         setSaasMRRSPlanToFeature([
           ...saasMRRSPlanToFeature,
           ...(newFeature.newFeatures as MRRSPlanToFeatureWithPlanAndFeature[]),
         ]);
       }

       console.log(saasMRRSPlanToFeature);

      toaster({
        type: "success",
        description: `New ${saasType} feature created`,
      });
      return newFeature;
    }
  };

  return (
    <>
      <div className="flex justify-start my-5 mb-10">
        <Button className="!p-0" variant={"link"} onClick={handleAddPlan}>
          <PlusSquare className="icon" />
          Add a new {saasType} feature
        </Button>
      </div>
    </>
  );
};
