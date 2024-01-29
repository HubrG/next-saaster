import { addNewMMRSFeature } from "@/src/components/features/pages/admin/actions.server";
import { Button } from "@/src/components/ui/button";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { SaasTypeReadableName } from "@/src/functions/SaasTypes";
import { useSaasMRRSFeatures } from "@/src/stores/saasMRRSFeature";
import { useSaasMRRSPlans } from "@/src/stores/saasMRRSPlans";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { PlusSquare } from "lucide-react";

export const AddFeature = () => {
 const { saasSettings } = useSaasSettingsStore();
  const { saasMRRSPlans, setSaasMRRSPlans } = useSaasMRRSPlans();
  const { saasMRRSFeatures, setSaasMRRSFeatures } = useSaasMRRSFeatures();
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
     <div className="flex justify-end my-5 mb-12">
       <Button  size={"sm"} className="" onClick={handleAddPlan}>
         <PlusSquare className="icon" />
         Add a new {saasType} feature
       </Button>
     </div>
   </>
 );
}
