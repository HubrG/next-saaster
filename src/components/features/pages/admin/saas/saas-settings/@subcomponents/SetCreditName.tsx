"use client";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { HelpCircle } from "lucide-react";
import { useEffect, useState } from "react";
type Props = {
  set: (value: string) => void;
};
export const SetCreditName = ({ set }: Props) => {
  const { saasSettings } = useSaasSettingsStore();
  const [creditName, setCreditName] = useState<string>("credit");

  useEffect(() => {
    set(saasSettings.creditName ?? "credit");
  }, [saasSettings, set]);

  useEffect(() => {
    setCreditName(saasSettings.creditName ?? "credit");
  }, [saasSettings]);

  return (
    <div>
      <Label htmlFor={`creditName`}>
        How would you like to name the credit (credit, token, coin...) ?
        Enter it in the singular
      </Label>
      <div className="flex flex-row items-center gap-2">
        <Input
          type="text"
          id="creditName"
          placeholder="Enter creditName"
          value={creditName}
          onChange={(e) => {
            set(e.target.value);
            setCreditName(e.target.value);
          }}
          className="w-full"
        />{" "}
        <span className="font-bold">
          <HelpCircle />
        </span>
      </div>
    </div>
  );
};
