"use client";
import { Input } from "@/src/components/ui/@shadcn/input";
import { Label } from "@/src/components/ui/@shadcn/label";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { useEffect, useState } from "react";

type Props = {
  set: (value: number) => void;
  disabled: boolean | null;
};

export const SetRefillCreditStep = ({ set, disabled }: Props) => {
  const { saasSettings } = useSaasSettingsStore();
  const [step, setStep] = useState<number>(10);

  useEffect(() => {
    set(saasSettings.refillCreditStep ?? 10);
  }, [saasSettings, set]);

  useEffect(() => {
    setStep(saasSettings.refillCreditStep ?? 10);
  }, [saasSettings]);

  return (
    <div className="w-full">
      <Label htmlFor={`refillCreditStep`}>Refill step</Label>

      <div className="flex flex-row items-center gap-2">
        <Input
          type="number"
          disabled={disabled ?? true}
          id="refillCreditStep"
          placeholder="Enter the refill step"
          value={step}
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            set(value);
            setStep(value);
          }}
          className="w-full"
        />
      </div>
      <small className="text-xs opacity-70">
        The refill step is the amount of{" "}
        {saasSettings.creditName?.toLowerCase()} that is added with each
        movement of the refill slider.
      </small>
    </div>
  );
};
