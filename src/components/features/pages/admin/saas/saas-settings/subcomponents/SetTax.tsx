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
import { useEffect } from "react";
type Props = {
  set: (value: number) => void;
};
export const SetTax = ({ set }: Props) => {
  const { saasSettings } = useSaasSettingsStore();
  useEffect(() => {
    set(saasSettings.tax ?? 0);
  }, [saasSettings, set]);

  const tax = saasSettings.tax ?? 0;
  return (
    <Select
      onValueChange={(e) => set(parseInt(e))}
      defaultValue={tax.toString()}>
      <SelectTrigger className="">
        <SelectValue placeholder="Select applicable tax" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {Array.from({ length: 50 }, (_, i) => (
            <SelectItem key={i} value={`${i}`}>
              {i}%
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
