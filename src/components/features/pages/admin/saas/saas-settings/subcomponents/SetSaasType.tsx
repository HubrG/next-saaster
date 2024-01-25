"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { SaasTypes } from "@prisma/client";
import { useEffect, useState } from "react";
type Props = {
  set: (value: SaasTypes) => void;
};
export const SetSaasType = ({ set }: Props) => {
  const { saasSettings, setSaasSettings } = useSaasSettingsStore();
  const [saasType, setSaasType] = useState<SaasTypes>(saasSettings.saasType);

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
    <Select
      onValueChange={handleValueChange}
      defaultValue={saasSettings.saasType}>
      <SelectTrigger className="">
        <SelectValue placeholder="Select a SaaS mode" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="CREDIT">Credit mode (pay as you go)</SelectItem>
          <SelectItem value="MRR_SIMPLE">
            MRR simple mode (a simple MRR)
          </SelectItem>
          <SelectItem value="MRR_COMPLEXE">
            MRR advanced mode (a rich and customizable SaaS)
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
