"use client";
import { dbUpdateFeature } from "@/app/[locale]/admin/queries/saas/saas-pricing/features.action";
import { Goodline } from "@/src/components/ui/@aceternity/good-line";
import { Switch } from "@/src/components/ui/switch";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { useSaasFeaturesStore } from "@/src/stores/admin/saasFeaturesStore";
import { iFeature } from "@/src/types/iFeatures";
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
  const [featureState, setFeatureState] = useState<iFeature>(feature);

  const handleChange = async (name: string, value: boolean) => {
    // We update the feature in the store to reflect the change immediately
    setSaasFeatures(
      saasFeatures.map((feat) =>
        feat.id === feature.id ? { ...feat, [name]: value } : feat
      )
    );
    // We update the feature in the database
    const dataToSet = await dbUpdateFeature({
      data: {
        id: feature.id,
        [name]: value,
      },
    });
    // If there is an error, we display a toaster and revert the change in the store
    if (dataToSet.serverError || dataToSet.validationErrors) {
      setSaasFeatures(
        saasFeatures.map((feat) =>
          feat.id === feature.id ? { ...feat, featureState } : feat
        )
      );
      return toaster({
        description:
          dataToSet.serverError ||
          dataToSet.validationErrors?.data ||
          "An error occurred",
        type: "error",
      });
    }
    setFeatureState({ ...featureState, [name]: value });
    return toaster({
      type: "success",
      description: `« ${feature.name} » option ${
        value ? "activated" : "deactivated"
      } successfully`,
      duration: 1000,
    });
  };

  return (
    <>
      <div className="flex flex-row justify-between items-center w-full">
        <strong className="flex flex-row items-center gap-x-1">
          <Info className="icon" data-tooltip-id={randUuid} />
          <span>Show this feature only on the selected plan(s)</span>
        </strong>
        <Switch
          onCheckedChange={(e) => handleChange("onlyOnSelectedPlans", e)}
          checked={featureState.onlyOnSelectedPlans ?? false}
          name="onlyOnSelectedPlans"
        />
      </div>
      <Tooltip className="tooltip !w-[95%]" opacity={100} id={randUuid} place="top">
        By default, features activated on a higher-level plane are displayed
        and grayed out on lower planes for information purposes. If you do not
        wish to display this feature on the lower planes, enable this option.
        <br />
        <br /> <strong>For example:</strong> If you activate a feature
        &rdquo;GPT-4&rdquo; on a higher-level plan and &rdquo;GPT-3&rdquo; on
        a lower-level plan, the &rdquo;GPT-4&rdquo; feature will not be appear
        on lower plan.
      </Tooltip>
      <Goodline className="-mt-1" />
    </>
  );
};
