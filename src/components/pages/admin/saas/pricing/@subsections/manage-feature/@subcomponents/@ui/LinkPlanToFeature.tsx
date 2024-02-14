import { updateLinkPlanToFeature } from "@/src/components/pages/admin/queries/queries";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/src/components/ui/popover";
import { Separator } from "@/src/components/ui/separator";
import { Switch } from "@/src/components/ui/switch";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { parseIntInput } from "@/src/functions/parse";
import { sliced } from "@/src/functions/slice";
import { cn } from "@/src/lib/utils";
import { useSaasPlanToFeatureStore } from "@/src/stores/admin/saasPlanToFeatureStore";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { PlanToFeatureWithPlanAndFeature } from "@/src/types/PlanToFeatureWithPlanAndFeature";
import { Feature, Plan } from "@prisma/client";
import _ from "lodash";
import capitalize from "lodash/capitalize";
import { ListTodo } from "lucide-react";
import { useEffect, useState } from "react";
import { LinkPlanToFeatureOptions } from "./LinkPlanToFeatureOptions";
type LinkState = {
  [planId: string]: {
    active: boolean | null;
    creditCost: number;
    creditAllouedByMonth: number;
    plan: Plan;
  };
};
type Props = {
  feature: Feature;
};
export const LinkPlanToFeature = ({ feature }: Props) => {
  const [linksState, setLinksState] = useState<LinkState>({});
  const [initialLinksState, setInitialLinksState] = useState<LinkState>({});
  const { saasSettings } = useSaasSettingsStore();
  const { saasPlanToFeature } = useSaasPlanToFeatureStore();

  useEffect(() => {
    const newLinksState: LinkState = {};
    saasPlanToFeature
      .filter(
        (item) =>
          item.featureId === feature.id &&
          item.plan &&
          !item.plan.deleted &&
          item.plan.saasType === saasSettings.saasType
      )
      .sort((a, b) => {
        const positionA = a.plan.position != null ? a.plan.position : Infinity;
        const positionB = b.plan.position != null ? b.plan.position : Infinity;
        return positionA - positionB;
      })
      .forEach((linkToFeature) => {
        newLinksState[linkToFeature.plan.id] = {
          active: linkToFeature.active,
          creditCost: linkToFeature.creditCost ?? 0,
          creditAllouedByMonth: linkToFeature.creditAllouedByMonth ?? 0,
          plan: linkToFeature.plan,
        };
      });
    setLinksState(newLinksState);
    setInitialLinksState(_.cloneDeep(newLinksState)); // Utilisez lodash pour faire une copie profonde
  }, [feature.id, saasPlanToFeature]);

  const hasDataChanged = () => {
    return !_.isEqual(linksState, initialLinksState);
  };

  // Handle input change, and manage clashes
  const handleInputChange = (linkId: string, name: string, e: any) => {
    let value: any;
    if (e?.target?.value !== undefined) {
      value = e.target.value;
    } else {
      value = e;
    }
    value = parseIntInput(
      ["trialDays", "monthlyPrice", "yearlyPrice", "creditAllouedByMonth"],
      name,
      value
    );
    setLinksState((prevState) => ({
      ...prevState,
      [linkId]: {
        ...prevState[linkId],
        [name]:
          name === "active"
            ? value
            : parseIntInput(
                ["creditCost", "creditAllouedByMonth"],
                name,
                value
              ),
      },
    }));
  };

  const handleReset = () => {
    setLinksState(_.cloneDeep(initialLinksState));
  };

  const handleSave = async () => {
    // Préparer les données pour l'envoi
    const dataToSend = Object.keys(linksState).map((linkId) => {
      return {
        planId: linkId,
        featureId: feature.id,
        active: linksState[linkId].active ?? false,
        creditCost: linksState[linkId].creditCost ?? 0,
        creditAllouedByMonth: linksState[linkId].creditAllouedByMonth ?? 0,
      };
    });
    const dataToSet = await updateLinkPlanToFeature(
      dataToSend as PlanToFeatureWithPlanAndFeature[]
    );
    if (dataToSet) {
      setInitialLinksState(_.cloneDeep(linksState));
      setLinksState(_.cloneDeep(linksState));

      useSaasPlanToFeatureStore.setState((state) => {
        const updatedFeatures = state.saasPlanToFeature.map((item) => {
          const updateData = dataToSend.find(
            (d) => d.planId === item.plan.id && d.featureId === item.feature.id
          );
          if (updateData) {
            return {
              ...item,
              active: updateData.active,
              creditCost: updateData.creditCost,
              creditAllouedByMonth: updateData.creditAllouedByMonth,
            };
          }
          return item;
        });

        return { saasPlanToFeature: updatedFeatures };
      });

      return toaster({
        description: `« ${feature.name} » saved successfully`,
        type: "success",
        duration: 8000,
      });
    } else {
      return toaster({
        description: `Error while saving feature « ${feature.name} », please try again later`,
        type: "error",
      });
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size={"icon"}>
          <ListTodo color="white" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[500px] max-h-[80vh] overflow-visible overflow-y-auto flex flex-col items-center gap-2">
        <LinkPlanToFeatureOptions feature={feature} />
        {Object.keys(linksState).map((linkId) => {
          const planState = linksState[linkId];
          return (
            <div
              key={"fp" + linkId}
              className={cn(
                { "opacity-60": linksState[linkId].plan.active === false },
                `flex flex-col gap-y-0`
              )}>
              <div className={cn({}, "grid grid-cols-4 gap-x-2 items-center")}>
                <div className="flex flex-col w-30">
                  <span className="font-bold">
                    {linksState[linkId].plan.name}
                  </span>
                  <small className="-mt-2">
                    {sliced(linksState[linkId].plan.id, 13)}
                  </small>
                </div>
                <div>
                  <Switch
                    onCheckedChange={(e) =>
                      handleInputChange(linkId, "active", e)
                    }
                    checked={linksState[linkId].active ?? false}
                    name="active"
                  />
                </div>
                {saasSettings.activeCreditSystem && (
                  <div className="flex flex-col">
                    <Label
                      htmlFor={"credit-cost-" + linkId}
                      className="!font-bold !text-xs">
                      {capitalize(saasSettings.creditName ?? "Credit")} cost/for
                      use
                    </Label>
                    <Input
                      type="number"
                      value={planState.creditCost}
                      onChange={(e) =>
                        handleInputChange(linkId, "creditCost", e.target.value)
                      }
                    />
                  </div>
                )}
                <div className="flex flex-col">
                  <Label
                    htmlFor={"limit-by-month-" + linkId}
                    className="!font-bold !text-xs">
                    Limit/month
                  </Label>
                  <Input
                    type="number"
                    value={planState.creditAllouedByMonth}
                    onChange={(e) =>
                      handleInputChange(
                        linkId,
                        "creditAllouedByMonth",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            </div>
          );
        })}
        <div className="flex flex-col w-full">
          <Separator className="mt-3 border-dashed border-b bg-transparent" />
          <div className="mt-2 flex justify-between w-full gap-x-5">
            <Button
              className="w-1/2"
              variant={"link"}
              onClick={handleSave}
              disabled={!hasDataChanged()}>
              Save changes
            </Button>
            <Button
              variant={"link"}
              className={cn("w-1/2", { "opacity-50": !hasDataChanged() })}
              onClick={handleReset}
              disabled={!hasDataChanged()}>
              Reset
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
