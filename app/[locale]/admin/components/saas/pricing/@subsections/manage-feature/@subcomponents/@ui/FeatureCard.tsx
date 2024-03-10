"use client";
import { dbUpdateFeature } from "@/app/[locale]/admin/queries/saas/saas-pricing/features.action";
import { CopySomething } from "@/src/components/ui/copy-something";
import { PopoverArchive } from "@/src/components/ui/popover-archive";
import { Switch } from "@/src/components/ui/switch";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { updateFeature } from "@/src/helpers/db/features.action";
import { sliced } from "@/src/helpers/functions/slice";
import { useSaasFeaturesStore } from "@/src/stores/admin/saasFeaturesStore";
import { iFeature } from "@/src/types/db/iFeatures";
import { Feature } from "@prisma/client";
import { Grip } from "lucide-react";
import { useState } from "react";
import { SortableKnob } from "react-easy-sort";
import { FeatureCardCategory } from "./FeatureCardCategory";
import { FeatureCardInfoPopover } from "./FeatureCardInfoPopover";
import { LinkPlanToFeature } from "./LinkPlanToFeature";

type Props = {
  feature: Feature;
};

export const FeatureCard = ({ feature }: Props) => {
  const [initialFeatureState, setInitialFeatureState] = useState({
    ...feature,
  });
  const { saasFeatures, setSaasFeatures } = useSaasFeaturesStore();

  const handleDelete = async () => {
    const dataToSet = await updateFeature({
      data: {
        id: feature.id,
        deleted: true,
        deletedAt: new Date(),
      },
    });
    if (dataToSet.serverError || dataToSet.validationErrors) {
      return toaster({
        description:
          dataToSet.serverError ||
          dataToSet.validationErrors?.data ||
          "An error occurred",
        type: "error",
      });
    } else {
      const feature = dataToSet?.data?.success as iFeature;
      setSaasFeatures(
        saasFeatures.map((plan) =>
          plan.id === feature.id
            ? { ...plan, deleted: true, position: 9999, deletedAt: new Date() }
            : plan
        )
      );
      setInitialFeatureState({ ...feature });
      return toaster({
        description: `${
          feature.name ? "« " + feature.name + " »" : "Feature"
        } archived successfully.`,
        type: "success",
        duration: 8000,
      });
    }
  };

  const handleActiveSave = async () => {
    // We update the feature in the store to reflect the change immediately
    setSaasFeatures(
      saasFeatures.map((feat) =>
        feat.id === feature.id ? { ...feat, active: !feat.active } : feat
      )
    );
    // We update the feature in the database
    const dataToSet = await dbUpdateFeature({
      data: {
        id: feature.id,
        ["active"]: !feature.active,
      },
    });
    // If there is an error, we display a toaster and revert the change in the store
    if (dataToSet.serverError || dataToSet.validationErrors) {
      setSaasFeatures(
        saasFeatures.map((feat) =>
          feat.id === feature.id
            ? { ...feat, active: initialFeatureState.active }
            : feat
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
    return toaster({
      type: "success",
      description: `« ${feature.name} » ${!feature.active ? "activated" : "deactivated"} successfully`,
      duration: 1000,
    });
  };

  return (
    <>
      <td>
        <SortableKnob>
          <Grip
            data-tooltip-id={"tt-knob-" + feature.id}
            className="dd-icon top-0 ml-2 w-5"
          />
        </SortableKnob>
      </td>
      <td>
        <FeatureCardCategory feature={feature} />
      </td>
      <td>
        <Switch
          onCheckedChange={handleActiveSave}
          checked={feature.active ?? false}
        />
      </td>
      <td>
        <FeatureCardInfoPopover
          feature={feature}
          toChangeValue={feature.name ?? ""}
          toChange="name"
        />
      </td>
      <td>
        <FeatureCardInfoPopover
          feature={feature}
          toChangeValue={feature.description ?? ""}
          toChange="description"
          textarea
        />
      </td>
      <td>
        {" "}
        <FeatureCardInfoPopover
          feature={feature}
          toChangeValue={feature.alias}
          toChange="alias"
        />
      </td>
      <td className="flex justify-center">
        <LinkPlanToFeature feature={feature} />
      </td>

      <td>
        <CopySomething
          what="Feature ID"
          copyText={feature.id}
          id={"full-id" + feature.id}>
          {sliced(feature.id, 10)}
        </CopySomething>
      </td>
      <td>
        <PopoverArchive
          what="this feature"
          size="icon"
          handleDelete={handleDelete}
        />
      </td>
    </>
  );
};
