import { updateMRRSFeature } from "@/src/components/features/pages/admin/actions.server";
import { CopySomething } from "@/src/components/ui/copy-something";
import { PopoverDelete } from "@/src/components/ui/popover-delete";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { sliced } from "@/src/functions/slice";
import { useSaasMRRSFeaturesStore } from "@/src/stores/saasMRRSFeaturesStore";
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
  const { saasMRRSFeatures, setSaasMRRSFeatures } = useSaasMRRSFeaturesStore();

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
        description: `« ${dataToSet.name} » deleted successfully, you can restore it in the trash.`,
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
      <td>
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
        <PopoverDelete
          what="this feature"
          size="icon"
          handleDelete={handleDelete}
        />
      </td>
    </>
  );
};
