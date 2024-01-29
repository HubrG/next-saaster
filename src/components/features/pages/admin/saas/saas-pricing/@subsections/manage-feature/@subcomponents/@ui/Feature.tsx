import { updateMRRSFeature } from "@/src/components/features/pages/admin/actions.server";
import { CopySomething } from "@/src/components/ui/copy-something";
import { PopoverDelete } from "@/src/components/ui/popover-delete";
import { Switch } from "@/src/components/ui/switch";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { sliced } from "@/src/functions/slice";
import { useSaasMRRSFeatures } from "@/src/stores/saasMRRSFeature";
import { MRRSFeature } from "@prisma/client";
import { Grip } from "lucide-react";
import { useState } from "react";
import { SortableKnob } from "react-easy-sort";
import { LinkPlanToFeature } from "./LinkPlanToFeature";

type Props = {
  feature: MRRSFeature;
};

export const FeatureCard = ({ feature }: Props) => {
  const [cancel, setCancel] = useState(false);
  const [save, setSave] = useState(false);
  const [initialFeatureState, setInitialFeatureState] = useState({
    ...feature,
  });

  const { saasMRRSFeatures, setSaasMRRSFeatures } = useSaasMRRSFeatures();

  // Set save and cancel to true or false
  const setSaveAndCancel = (value: boolean) => {
    setSave(value);
    setCancel(value);
  };
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
            ? { ...plan, deleted: true, position: 999, deletedAt: new Date() }
            : plan
        )
      );
      setSaveAndCancel(false);
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
      <div className="col-span-1">
        <SortableKnob>
          <Grip className="top-0 right-0.5 text-primary hover:cursor-move w-5" />
        </SortableKnob>
      </div>
      <div className="col-span-1">
        <Switch data-tooltip-id={"tooltip"} />
      </div>
      <div className="col-span-1">
        <CopySomething
          what="Feature ID"
          copyText={feature.id}
          id={"full-id" + feature.id}>
          {sliced(feature.id, 8)}
        </CopySomething>
      </div>
      <div className="col-span-1">{feature.alias}</div>
      <div className="col-span-2">{feature.name}</div>
      <div className="col-span-2">{feature.description}</div>
      <div className="col-span-2">
        <LinkPlanToFeature />
      </div>
      <div className="col-span-1">
        <PopoverDelete
          what="this feature"
          size="icon"
          handleDelete={handleDelete}
        />
      </div>
    </>
  );
};
