"use client";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { convertCurrencyName } from "@/src/helpers/functions/convertCurencies";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { useFormatter } from "next-intl";
import { useEffect, useState } from "react";

type Props = {
  set: (value: number) => void;
  disabled: boolean | null;
};

export const SetPriceForOneRefillCredit = ({ set, disabled }: Props) => {
  const { saasSettings } = useSaasSettingsStore();
  const [price, setPrice] = useState<number>(1);
  const format = useFormatter();
  useEffect(() => {
    set(saasSettings.priceForOneRefillCredit ?? 1);
  }, [saasSettings, set]);

  useEffect(() => {
    setPrice(saasSettings.priceForOneRefillCredit ?? 1);
  }, [saasSettings]);

  return (
    <div className="w-full">
      <Label htmlFor={`priceForOneRefillCredit`}>
        Cost per {saasSettings.creditName?.toLowerCase()}
      </Label>
      <div className="flex flex-row items-center gap-2">
        <Input
          type="number"
          disabled={disabled ?? true}
          id="priceForOneRefillCredit"
          value={price}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            set(value);
            setPrice(value);
          }}
          className="w-full"
        />
        <p className="text-sm text-app-600">
          {convertCurrencyName(saasSettings.currency ?? "", "sigle")}
        </p>
      </div>
    </div>
  );
};
