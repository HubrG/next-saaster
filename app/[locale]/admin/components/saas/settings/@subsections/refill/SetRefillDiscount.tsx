"use client";
import { Input } from "@/src/components/ui/@shadcn/input";
import { Label } from "@/src/components/ui/@shadcn/label";
import { cn } from "@/src/lib/utils";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { Percent } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  set: (value: number) => void;
  disabled: boolean | null;
};

export const SetRefillDiscount = ({ set, disabled }: Props) => {
  const { saasSettings } = useSaasSettingsStore();
  const [discount, setDiscount] = useState<number>(0);

  useEffect(() => {
    set(saasSettings.discountForRefillCredit ?? 0);
  }, [saasSettings, set]);

  useEffect(() => {
    setDiscount(saasSettings.discountForRefillCredit ?? 0);
  }, [saasSettings]);

  return (
    <div className={cn({ "!my-disabled": disabled }, "w-full")}>
      <Label htmlFor={`discountForRefillCredit`}>
        Enter the discount percentage
      </Label>
      <div className="flex flex-row items-center gap-2">
        <Input
          type="number"
          disabled={disabled ?? true}
          id="discountForRefillCredit"
          placeholder="Entrez le pourcentage de réduction"
          value={discount}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            set(value);
            setDiscount(value);
          }}
          className={cn({ "!my-disabled": disabled }, "w-full")}
        />
        <span className="font-bold">
          <Percent />
        </span>
      </div>
    </div>
  );
};
