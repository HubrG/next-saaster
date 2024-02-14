import { addNewMMRSFeature } from "@/src/components/pages/admin/queries/queries";
import { Button } from "@/src/components/ui/button";
import { SimpleLoader } from "@/src/components/ui/loader";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { SaasTypeReadableName } from "@/src/functions/SaasTypes";
import { useSaasFeaturesStore } from "@/src/stores/admin/saasFeaturesStore";
import { useSaasPlanToFeatureStore } from "@/src/stores/admin/saasPlanToFeatureStore";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { PlanToFeatureWithPlanAndFeature } from "@/src/types/PlanToFeatureWithPlanAndFeature";
import { PlusSquare } from "lucide-react";
import { useState } from "react";

export const AddFeature = () => {
  const { saasSettings } = useSaasSettingsStore();
  const { saasFeatures, setSaasFeatures } = useSaasFeaturesStore();
  const { saasPlanToFeature, setSaasPlanToFeature } =
    useSaasPlanToFeatureStore();
  let saasType = SaasTypeReadableName(saasSettings.saasType);
  const [loading, setLoading] = useState(false);

  const handleAddPlan = async () => {
    setLoading(true);
    if (saasSettings.saasType === "MRR_SIMPLE") {
      const newFeature = await addNewMMRSFeature();
      if (newFeature && newFeature.newFeatures.length > 0) {
        setSaasFeatures([...saasFeatures, newFeature.newFeature]);
        setSaasPlanToFeature([
          ...saasPlanToFeature,
          ...(newFeature.newFeatures as PlanToFeatureWithPlanAndFeature[]),
        ]);

        toaster({
          type: "success",
          description: `New ${saasSettings.saasType} feature created`,
        });
      } else {
        // Gère le cas où newFeature est false ou n'a pas de nouvelles fonctionnalités
        toaster({
          type: "error",
          description: "Failed to create new feature",
        });
      }
      setLoading(false);
      return newFeature;
    }
  };

  return (
    <>
      <div className="flex justify-start my-5 mb-10">
        <Button className="!p-0" variant={"link"} onClick={handleAddPlan}>
          {loading ? <SimpleLoader /> : <PlusSquare className="icon" />}
          Add a new {saasType} feature
        </Button>
      </div>
    </>
  );
};