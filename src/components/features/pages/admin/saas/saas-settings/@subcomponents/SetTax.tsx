"use client";
import { Input } from "@/src/components/ui/input";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { useEffect, useState } from "react";
type Props = {
  set: (value: number) => void;
};
export const SetTax = ({ set }: Props) => {
  const { saasSettings } = useSaasSettingsStore();
  const [tax, setTax] = useState<number>(0);

  useEffect(() => {
    set(saasSettings.tax ?? 0);
  }, [saasSettings, set]);

  useEffect(() => {
    setTax(saasSettings.tax ?? 0);
  }, [saasSettings]);

  return (
    <div className="flex flex-row items-center gap-2">
      <Input
        type="number"
        placeholder="Enter tax"
        value={tax}
        onChange={(e) => { set(parseFloat(e.target.value));setTax(parseFloat(e.target.value)); }}
        className="w-full"
      />{" "}
      <span className="font-bold">%</span>
    </div>
  );
};
