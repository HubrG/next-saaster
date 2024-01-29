import { addNewMMRSFeature } from "@/src/components/features/pages/admin/actions.server";
import { Button } from "@/src/components/ui/button";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { SaasTypeReadableName } from "@/src/functions/SaasTypes";
import { useSaasMRRSFeaturesStore } from "@/src/stores/saasMRRSFeaturesStore";
import { useSaasMRRSPlansStore } from "@/src/stores/saasMRRSPlansStore";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { PlusSquare } from "lucide-react";

export const AddFeature = () => {
 const { saasSettings } = useSaasSettingsStore();
  const { saasMRRSPlans, setSaasMRRSPlans } = useSaasMRRSPlansStore();
  const { saasMRRSFeatures, setSaasMRRSFeatures } = useSaasMRRSFeaturesStore();
 let saasType = SaasTypeReadableName(saasSettings.saasType);

 const handleAddPlan = async () => {
   if (saasSettings.saasType === "MRR_SIMPLE") {
     const newFeature = await addNewMMRSFeature();
      setSaasMRRSFeatures([...saasMRRSFeatures, newFeature]);
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
        <Button
          className="!p-0"
         variant={"link"}
         onClick={handleAddPlan}>
         <PlusSquare className="icon" />
         Add a new {saasType} feature
       </Button>
     </div>
   </>
 );
}
