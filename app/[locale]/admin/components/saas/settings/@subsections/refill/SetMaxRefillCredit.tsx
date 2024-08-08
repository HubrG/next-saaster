"use client";
import { Input } from "@/src/components/ui/@shadcn/input";
import { Label } from "@/src/components/ui/@shadcn/label";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { useEffect, useState } from "react";

type Props = {
  set: (value: number) => void;
  disabled: boolean | null;
};

export const SetMaxRefillCredit = ({ set, disabled }: Props) => {
  const { saasSettings } = useSaasSettingsStore();
  const [maxCredit, setMaxCredit] = useState<number>(100);

  useEffect(() => {
    set(saasSettings.maxRefillCredit ?? 100);
  }, [saasSettings, set]);

  useEffect(() => {
    setMaxCredit(saasSettings.maxRefillCredit ?? 100);
  }, [saasSettings]);

  return (
    <div className="w-full">
      <Label htmlFor={`maxRefillCredit`}>Maximum refill</Label>
      <div className="flex flex-row items-center gap-2">
        <Input
          type="number"
          disabled={disabled ?? true}
          id="maxRefillCredit"
          value={maxCredit}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            set(value);
            setMaxCredit(value);
          }}
          className="w-full"
        />
      </div>
    </div>
  );
};
