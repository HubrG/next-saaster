import { updateSaasSettings } from "@/app/[locale]/admin/queries/app-saas-settings.action";
import { toaster } from "@/src/components/ui/@fairysaas/toaster/ToastConfig";
import { Button } from "@/src/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { Separator } from "@/src/components/ui/separator";
import { Switch } from "@/src/components/ui/switch";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { SaasSettings } from "@prisma/client";
import { Label } from "@radix-ui/react-label";
import { Info, Layout } from "lucide-react";
import { useState } from "react";
import { Tooltip } from "react-tooltip";
export const FeaturesOptions = () => {
  const { saasSettings, setSaasSettings } = useSaasSettingsStore();
  const [featureState, setFeatureState] = useState<Partial<SaasSettings>>({
    displayFeaturesByCategory: saasSettings.displayFeaturesByCategory ?? false,
    activeFeatureComparison: saasSettings.activeFeatureComparison ?? false,
    activeFeatureAdvancedComparison:
      saasSettings.activeFeatureAdvancedComparison ?? false,
  });

  const handleChange = async (name: string, value: boolean) => {
    const updatedFeatureState = { ...featureState, [name]: value };
    if (!updatedFeatureState) {
      return toaster({
        type: "error",
        description: `Error while updating features options, please try again later`,
      });
    }
    const updateFeature = await updateSaasSettings(
      saasSettings.id,
      updatedFeatureState,
      chosenSecret()
    );
    if (updateFeature) {
      setFeatureState(updatedFeatureState);
      setSaasSettings({
        ...saasSettings,
        ...updatedFeatureState,
      });
      toaster({
        type: "success",
        description: `Features options updated successfully`,
      });
    }
  };
  return (
    <div className="flex justify-start my-5 mb-10 features-options">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant={"outline"}>
            <Layout className="icon" />
            Public display options
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96">
          <div className="grid gap-4">
            
            <div className="space-y-2 space-x-2 flex flex-row justify-between">
              <strong className="flex flex-row items-center justify-end gap-x-1">
                <Info
                  className="icon"
                  data-tooltip-id="saas-features-option-button"
                />
                <Label className="label" htmlFor="activeFeatureComparison">
                  Active feature comparison on simple pricing card
                </Label>
                <Tooltip
                  className="tooltip"
                  opacity={100}
                  id="saas-features-option-button"
                  place="top">
                  test
                </Tooltip>
              </strong>
              <Switch
                id="activeFeatureComparison"
                onCheckedChange={(e) =>
                  handleChange("activeFeatureComparison", e)
                }
                checked={featureState.activeFeatureComparison ?? false}
                name="activeFeatureComparison"
              />
            </div>
            <Separator />
            <div className="space-y-2 space-x-2 flex flex-row justify-between">
              <strong className="flex flex-row items-center justify-end gap-x-1">
                <Info
                  className="icon"
                  data-tooltip-id="saas-features-option-button"
                />
                <Label className="label" htmlFor="displayFeaturesByCategory">
                  Display features comparison by categories on the pricing page
                </Label>
                <Tooltip
                  className="tooltip"
                  opacity={100}
                  id="saas-features-option-button"
                  place="top">
                  test
                </Tooltip>
              </strong>
              <Switch
                id="displayFeaturesByCategory"
                onCheckedChange={(e) =>
                  handleChange("displayFeaturesByCategory", e)
                }
                checked={featureState.displayFeaturesByCategory ?? false}
                name="onlyOnSelectedPlans"
              />
            </div>
            {/* <Separator />
            <div
              className={cn(
                {
                  "opacity-50 disabled": !featureState.displayFeaturesByCategory,
                },
                "space-y-2 space-x-2 flex flex-row justify-between"
              )}>
              <strong className="flex flex-row items-center justify-end gap-x-1">
                <Info
                  className="icon"
                  data-tooltip-id="saas-features-option-button"
                />
                <Label
                  className="label"
                  htmlFor="activeFeatureAdvancedComparison">
                  Active advanced feature comparison (by categories)
                </Label>
                <Tooltip
                  className="tooltip"
                  opacity={100}
                  id="saas-features-option-button"
                  place="top">
                  test
                </Tooltip>
              </strong>
              <Switch
              disabled={!featureState.displayFeaturesByCategory}
                id="activeFeatureAdvancedComparison"
                onCheckedChange={(e) =>
                  handleChange("activeFeatureAdvancedComparison", e)
                }
                checked={featureState.activeFeatureAdvancedComparison ?? false}
                name="activeFeatureAdvancedComparison"
              />
            </div> */}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
