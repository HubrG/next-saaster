"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui//popover";
import { Button } from "@/src/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { SaasTypeList } from "@/src/functions/SaasTypes";
import { cn } from "@/src/lib/utils";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { PopoverClose } from "@radix-ui/react-popover";
import { MessageCircleWarningIcon, Replace } from "lucide-react";
import { useState } from "react";
import { Tooltip } from "react-tooltip";

type PlanCardSwitchSaasTypeProps = {
  handleInputChange: (e: string, name: string) => void;
  saasTypeState: string;
};
export const PlanCardSwitchSaasType = ({
  handleInputChange,
  saasTypeState,
}: PlanCardSwitchSaasTypeProps) => {
  const { saasSettings } = useSaasSettingsStore();
  let randomId = Math.random().toString(36).substring(7);
  const [newSaasType, setNewSaasType] = useState<string>("");

  const handleReset = () => {
    handleInputChange(saasSettings.saasType, "saasType");
    setNewSaasType(saasSettings.saasType);
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"ghost"}
            className={cn({
              "border-2 border-theming-background-500 border-dashed ":
                saasTypeState !== saasSettings.saasType,
            })}
            data-tooltip-id={randomId}>
            <Replace className="icon" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <p className="text-center font-bold flex flex-col gap-2 justify-center">
              <MessageCircleWarningIcon className="mx-auto" />
              <span>Switch to another business model...</span>
            </p>
            <Select
              onValueChange={(e) => {
                handleInputChange(e as string, "saasType");
                setNewSaasType(e as string);
              }}
              defaultValue={saasTypeState}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a business model" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {SaasTypeList.map((saasType) => (
                    <SelectItem
                      key={randomId + saasType.name}
                      value={saasType.value}>
                      {saasType.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className="flex flex-row gap-5 justify-evenly">
              <PopoverClose asChild>
                <Button
                  size={"default"}
                  className="w-full"
                  disabled={saasTypeState === saasSettings.saasType}>
                  Change
                </Button>
              </PopoverClose>
              <PopoverClose asChild>
                <Button
                  variant={"ghost"}
                  disabled={saasTypeState === saasSettings.saasType}
                  className="w-full"
                  onClick={handleReset}>
                  Reset
                </Button>
              </PopoverClose>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <Tooltip id={randomId} className="tooltip" opacity={100}>
        <span>Switch to another business model...</span>
      </Tooltip>
    </>
  );
};
