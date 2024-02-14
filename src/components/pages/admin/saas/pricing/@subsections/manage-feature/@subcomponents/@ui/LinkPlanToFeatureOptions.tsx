import { Switch } from "@/src/components/ui/switch";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { useSaasFeaturesStore } from "@/src/stores/admin/saasFeaturesStore";
import { Feature } from "@prisma/client";

import { Info } from "lucide-react";
import { useState } from "react";
import { Tooltip } from "react-tooltip";
import { v4 as uuidv4 } from "uuid";
type Props = {
  feature: Feature;
};
export const LinkPlanToFeatureOptions = ({ feature }: Props) => {
  const randUuid = uuidv4();
  const { saasFeatures, setSaasFeatures } = useSaasFeaturesStore();
  const [featureState, setFeatureState] = useState<Feature>(feature);

  const handleChange = async (name: string, value: boolean) => {
    const updatedFeatureState = { ...featureState, [name]: value };
    setSaasFeatures(
      saasFeatures.map((f) =>
        f.id === updatedFeatureState.id ? updatedFeatureState : f
      )
    );
    const updateFeature = await updateFeature(
      feature.id,
      updatedFeatureState
    );
    if (!updateFeature) {
      return toaster({
        type: "error",
        description: `Error while updating feature « ${feature.name} », please try again later`,
      });
    }
    setSaasFeatures(
      saasFeatures.map((f) =>
        f.id === updateFeature.id ? updateFeature : f
      )
    );
    setFeatureState(updatedFeatureState);
    toaster({
      type: "success",
      description: `Feature « ${feature.name} » updated successfully`,
    });
  };

  return (
    <div className="flex flex-row justify-between items-center border-b  mb-2 py-3 pt-1 pb-5 w-full">
      <strong className="flex flex-row items-center gap-x-1">
        <span>Show this feature only on the selected plan(s)</span>
        <Info className="icon" data-tooltip-id={randUuid} />
      </strong>
      <Switch
        onCheckedChange={(e) => handleChange("onlyOnSelectedPlans", e)}
        checked={featureState.onlyOnSelectedPlans ?? false}
        name="onlyOnSelectedPlans"
      />
      <Tooltip className="tooltip" opacity={100} id={randUuid} place="top">
        By default, features activated on a higher-level plane are displayed and
        grayed out on lower planes for information purposes. If you do not wish
        to display this feature on the lower planes, enable this option.
        <br />
        <br /> <strong>For example:</strong> If you activate a feature
        &rdquo;GPT-4&rdquo; on a higher-level plan and &rdquo;GPT-3&rdquo; on a
        lower-level plan, the &rdquo;GPT-4&rdquo; feature will not be appear on
        lower plan.
      </Tooltip>
    </div>
  );
};
