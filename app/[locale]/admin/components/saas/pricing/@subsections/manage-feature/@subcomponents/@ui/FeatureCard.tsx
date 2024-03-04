"use client";
import { updateFeature } from "@/app/[locale]/admin/queries/queries";
import { CopySomething } from "@/src/components/ui/copy-something";
import { PopoverArchive } from "@/src/components/ui/popover-archive";
import { Switch } from "@/src/components/ui/switch";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { sliced } from "@/src/helpers/functions/slice";
import { useSaasFeaturesStore } from "@/src/stores/admin/saasFeaturesStore";
import { iFeature } from "@/src/types/iFeatures";
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
    const dataToSet = await updateFeature(feature.id, {
      ...feature,
      deleted: true,
      deletedAt: new Date(),
    });
    if (dataToSet) {
      setSaasFeatures(
        saasFeatures.map((plan) =>
          plan.id === feature.id
            ? { ...plan, deleted: true, position: 9999, deletedAt: new Date() }
            : plan
        )
      );
      setInitialFeatureState({ ...dataToSet });
      return toaster({
        description: `${
          dataToSet.name ? "« " + dataToSet.name + " »" : "Feature"
        } archived successfully.`,
        type: "success",
        duration: 8000,
      });
    } else {
      return toaster({
        description: `Error while archiving feature « ${feature.name} », please try again later`,
        type: "error",
      });
    }
  };

  const handleActiveSave = async (e: any) => {
    const dataToSet = {
      ...feature,
      ["active"]: !feature.active,
    };
    const dataToUpdate = (await updateFeature(
      feature.id,
      dataToSet
    )) as iFeature;
    setSaasFeatures(
      saasFeatures.map((plan) =>
        plan.id === feature.id ? { ...plan, active: !plan.active } : plan
      )
    );
    if (dataToUpdate) {
      setSaasFeatures(
        saasFeatures.map((plan) =>
          plan.id === feature.id
            ? { ...plan, active: dataToUpdate.active }
            : plan
        )
      );
      toaster({
        type: "success",
        description: `« ${feature.name} » saved successfully`,
        duration: 1000,
      });
    }
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
