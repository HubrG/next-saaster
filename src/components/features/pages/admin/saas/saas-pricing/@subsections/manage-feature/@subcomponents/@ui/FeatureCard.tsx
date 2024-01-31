import { updateMRRSFeature } from "@/src/components/features/pages/admin/actions.server";
import { CopySomething } from "@/src/components/ui/copy-something";
import { PopoverDelete } from "@/src/components/ui/popover-delete";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { sliced } from "@/src/functions/slice";
import { useSaasMRRSFeaturesStore } from "@/src/stores/saasMRRSFeaturesStore";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { MRRSFeature } from "@prisma/client";
import { Grip } from "lucide-react";
import { useState } from "react";
import { SortableKnob } from "react-easy-sort";
import { FeatureCardCategory } from "./FeatureCardCategory";
import { FeatureCardInfoPopover } from "./FeatureCardInfoPopover";
import { LinkPlanToFeature } from "./LinkPlanToFeature";

type Props = {
  feature: MRRSFeature;
};

export const FeatureCard = ({ feature }: Props) => {
  const [initialFeatureState, setInitialFeatureState] = useState({
    ...feature,
  });
  const { saasSettings} = useSaasSettingsStore();
  const { saasMRRSFeatures, setSaasMRRSFeatures } = useSaasMRRSFeaturesStore();
  // Set save and cancel to true or false


  const handleDelete = async () => {
    const dataToSet = await updateMRRSFeature(feature.id, {
      ...feature,
      deleted: true,
      deletedAt: new Date(),
    });
    if (dataToSet) {
      setSaasMRRSFeatures(
        saasMRRSFeatures.map((plan) =>
          plan.id === feature.id
            ? { ...plan, deleted: true, position: 9999, deletedAt: new Date() }
            : plan
        )
      );
      setInitialFeatureState({ ...dataToSet });
      return toaster({
        description: `« ${feature.name} » deleted successfully, you can restore it in the trash.`,
        type: "success",
        duration: 8000,
      });
    } else {
      return toaster({
        description: `Error while deleting feature « ${feature.name} », please try again later`,
        type: "error",
      });
    }
  };

  return (
    <>
      <div>
        <SortableKnob>
          <Grip
            data-tooltip-id={"tt-knob-" + feature.id}
            className="dd-icon top-0 ml-2 w-5"
          />
        </SortableKnob>
      </div>

      <div className="col-span-2">
        <FeatureCardCategory feature={feature} />
      </div>
      <div className="col-span-2 text-left">
        <FeatureCardInfoPopover
          feature={feature}
          toChangeValue={feature.name ?? ""}
          toChange="name"
        />
      </div>
      <div className="col-span-2 text-left">
        <FeatureCardInfoPopover
          feature={feature}
          toChangeValue={feature.description ?? ""}
          toChange="description"
          textarea
        />
      </div>
      <div className="col-span-1 text-left">
        {" "}
        <FeatureCardInfoPopover
          feature={feature}
          toChangeValue={feature.alias}
          toChange="alias"
        />
      </div>
      <div className="col-span-2">
        <LinkPlanToFeature feature={feature} />
      </div>

      <div className="col-span-1">
        <CopySomething
          what="Feature ID"
          copyText={feature.id}
          id={"full-id" + feature.id}>
          {sliced(feature.id, 10)}
        </CopySomething>
      </div>
      <div>
        <PopoverDelete
          what="this feature"
          size="icon"
          handleDelete={handleDelete}
        />
      </div>
    </>
  );
};
