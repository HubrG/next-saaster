"use client";
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
import { SaasTypes } from "@prisma/client";
import { Info } from "lucide-react";
import { useEffect, useState } from "react";
type Props = {
  set: (value: SaasTypes) => void;
};
export const SetSaasType = ({ set }: Props) => {
  const { saasSettings, setSaasSettings } = useSaasSettingsStore();
  const [saasType, setSaasType] = useState<SaasTypes>(saasSettings.saasType);
  const [saasDescription, setSaasDescription] = useState<string>("");

  useEffect(() => {
    if (saasSettings.saasType !== saasType) {
      setSaasType(saasSettings.saasType);
    }
  }, [saasSettings.saasType, saasType]);

  const handleValueChange = (newValue: SaasTypes) => {
    setSaasType(newValue);
    set(newValue);
    setSaasSettings({ ...saasSettings, saasType: newValue });
  };

  return (
    <>
      <div className="w-full relative" onBlur={() => setSaasDescription("")}>
        <Select
          onValueChange={(e) => {
            handleValueChange(e as SaasTypes);
            setSaasDescription("");
          }}
          defaultValue={saasSettings.saasType}>
          <SelectTrigger className="">
            <SelectValue placeholder="Select a SaaS mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {SaasTypeList.map((saasType) => (
                <SelectItem
                  key={"saasType" + saasType.name}
                  value={saasType.value}
                  onFocus={() => setSaasDescription(saasType.description)}>
                  {saasType.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <div
          className={cn(
            saasDescription ? "block" : "hidden",
            `p-5 z-50  mt-32 w-full shadow-2xl bg-background  rounded-default font-semibold text-left absolute`
          )}>
          <div className="flex flex-row items-start justify-center  gap-10">
            <Info size={108} className="min-w-[3%] self-start" />
            <p className="md:text-base text-sm">{saasDescription}</p>
          </div>
        </div>
      </div>
    </>
  );
};
