"use client";
import { Label } from "@/src/components/ui/@shadcn/label";
import { Slider } from "@/src/components/ui/@shadcn/slider";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { useEffect, useState } from "react";

type Props = {
  set: (value: number) => void;
  disabled: boolean | null;
  maxCredit: number;
};

export const SetRefillDiscountStep = ({ set, disabled, maxCredit }: Props) => {
  const { saasSettings } = useSaasSettingsStore();
  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    set(saasSettings.applyDiscountByXRefillCreditStep ?? 0);
  }, [saasSettings, set]);

  useEffect(() => {
    setStep(saasSettings.applyDiscountByXRefillCreditStep ?? 0);
  }, [saasSettings]);

useEffect(() => {
  if (maxCredit < step) {
    setStep(maxCredit);
  }
}, [maxCredit, saasSettings]);

  return (
    <div className="w-full">
      <Label htmlFor={`applyDiscountByXRefillCreditStep`}>
        How many refill {saasSettings.creditName?.toLowerCase()} would you like
        to apply the discount to?
      </Label>
      <div className="flex flex-col items-center gap-2">
        <Slider
          disabled={disabled ?? true}
          value={[step]}
          onValueChange={(value) => {
            set(value[0]);
            setStep(value[0]);
          }}
          max={maxCredit ?? 0}
          step={1}
          className="w-full"
        />
        <span className="text-xs">
          {step} {saasSettings.creditName?.toLowerCase()}
        </span>
      </div>
    </div>
  );
};
