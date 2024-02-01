import { updateMRRSFeature } from "@/src/components/features/pages/admin/actions.server";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { Textarea } from "@/src/components/ui/textarea";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { sliced } from "@/src/functions/slice";
import { cn } from "@/src/lib/utils";
import { useSaasMRRSFeaturesStore } from "@/src/stores/saasMRRSFeaturesStore";
import { MRRSFeature } from "@prisma/client";
import { Edit } from "lucide-react";
import { useState } from "react";
import slugify from "react-slugify";
import { Tooltip } from "react-tooltip";

type Props = {
  toChange: string;
  feature: MRRSFeature;
  toChangeValue: any;
  textarea?: boolean;
};
export const FeatureCardInfoPopover = ({
  toChange,
  feature,
  toChangeValue,
  textarea,
}: Props) => {
  const { saasMRRSFeatures, setSaasMRRSFeatures } = useSaasMRRSFeaturesStore();
  const [data, setData] = useState<string>(toChangeValue);
  const [open, setOpen] = useState<boolean>(false);
  const handleSave = async () => {
    const dataToSet = {
      ...feature,
      [toChange]: toChange === "alias" ? slugify(data) : data,
    };
    const dataToUpdate = await updateMRRSFeature(feature.id, dataToSet);
    if (dataToUpdate) {
      setSaasMRRSFeatures(
        saasMRRSFeatures.map((feature) =>
          feature.id === dataToUpdate.id ? dataToUpdate : feature
        )
      );
      setOpen(false);
      toaster({
        description: `« ${feature.name} » updated successfully.`,
        type: "success",
      });
    }
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {toChangeValue ? (
          <p
            className={cn(
              {
                "!font-bold w-40": toChange === "name" || toChange === "alias" || toChange === "description",
                "!font-normal" : toChange === "description",
                "w-32": toChange === "alias",
              },
              "text-wrap	hover:cursor-pointer hover:underline hover:decoration-dashed hover:underline-offset-4"
            )}
            data-tooltip-id={"tt-feat-" + toChange + feature.id}>
            {sliced(toChangeValue, 30)}
            {toChangeValue.length > 30 && (
              <Tooltip
                className="tooltip z-50"
                opacity={100}
                id={"tt-feat-" + toChange + feature.id}
                place="top">
                {toChangeValue}
              </Tooltip>
            )}
          </p>
        ) : (
          <p className="flex justify-start w-full">
            <Edit className="icon cursor-pointer hover:opacity-100 opacity-40" />
          </p>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-80 flex flex-col items-center">
        <h5 className="pt-0 pb-2 -mt-2">Change {toChange}</h5>
        {textarea ? (
          <Textarea
            rows={2}
            onChange={(e) => {
              setData(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.metaKey) {
                handleSave();
              }
            }}
            onFocus={(e) => {
              e.target.select();
            }}
            value={data}
          />
        ) : (
          <Input
            onChange={(e) => {
              setData(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSave();
              }
            }}
            value={data}
          />
        )}
        <Button onClick={handleSave} size={"sm"} className="w-full mt-2">
          Save {!textarea ? "(press enter)" : "(press cmd + enter)"}
        </Button>
      </PopoverContent>
    </Popover>
  );
};
