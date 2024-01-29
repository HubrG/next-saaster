import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { Switch } from "@/src/components/ui/switch";
import { capitalizeFirstLetter } from "@/src/functions/capitalizeFirstLetter";
import { sliced } from "@/src/functions/slice";
import { cn } from "@/src/lib/utils";
import { useSaasMRRSPlansStore } from "@/src/stores/saasMRRSPlansStore";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { Info, ListTodo } from "lucide-react";
import { Tooltip } from "react-tooltip";
import { v4 as uuidv4 } from 'uuid';


export const LinkPlanToFeature = () => {
  const { saasMRRSPlans } = useSaasMRRSPlansStore();
  const { saasSettings } = useSaasSettingsStore();
  const randUuid = uuidv4();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size={"icon"}>
          <ListTodo />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[500px] flex flex-col items-center gap-2 shadow-2xl  border-2">
        {saasMRRSPlans
          .slice()
          .filter((plan) => !plan.deleted)
          .map((plan, index) => (
            <div
              key={"fp" + plan.id}
              className={cn(
                { "opacity-60": !plan.active },
                `flex flex-col gap-y-0`
              )}>
              <div
                className={cn(
                  { "border-t pt-2 border-dashed": index > 0 },
                  "grid grid-cols-4 gap-x-2 items-center"
                )}>
                <div className="flex flex-col w-30">
                  <span className="font-bold">{plan.name}</span>
                  <small className="-mt-2">{sliced(plan.id, 13)}</small>
                </div>
                <div>
                  <Switch data-tooltip-id={"tooltip" + plan.id} />
                </div>
                {saasSettings.activeCreditSystem && (
                  <div className="flex flex-col">
                    <Label
                      htmlFor={"credit-cost-" + plan.id}
                      className="!font-bold !text-xs">
                      {capitalizeFirstLetter(
                        saasSettings.creditName ?? "Credit"
                      )}{" "}
                      cost/for use
                    </Label>
                    <Input
                      type="number"
                      className="text-sm -mt-2"
                      id={"credit-cost-" + plan.id}
                      value="ted"
                    />
                  </div>
                )}
                <div className="flex flex-col">
                  <Label
                    htmlFor={"limit-by-month-" + plan.id}
                    className="!font-bold !text-xs">
                    Limit/month
                  </Label>
                  <Input
                    type="number"
                    className="text-sm -mt-2"
                    id={"credit-cost-" + plan.id}
                    value=""
                  />
                </div>
              </div>
            </div>
          ))}
        {/* Ne pas afficher sur les plans inférieurs. Ex. GPT3 pour le plan inféieur, GPT4 pour le plan supérieur.  */}
        <div className="flex flex-row justify-between items-center border-t p-2 pt-6 w-full">
          <strong className="flex flex-row items-center gap-x-1">
            <span>Show this feature only on the selected plan(s)</span>
            <Info className="icon" data-tooltip-id={randUuid} />
          </strong>
          <Switch />
          <Tooltip className="tooltip" opacity={100} id={randUuid} place="top">
            By default, features activated on a higher-level plane are displayed
            and grayed out on lower planes for information purposes. If you do
            not wish to display this feature on the lower planes, enable this
            option.
            <br />
            <br /> <strong>For example:</strong> If you activate a feature
            &rdquo;GPT-4&rdquo; on a higher-level plan and &rdquo;GPT-3&rdquo; on
            a lower-level plan, the &rdquo;GPT-4&rdquo; feature will not be appear
            on lower plan.
          </Tooltip>
        </div>
      </PopoverContent>
    </Popover>
  );
};
