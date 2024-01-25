"use client";

import { Slider } from "@/src/components/ui/slider";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { useEffect, useState } from "react";

type Props = {
  set: (value: number) => void;
};

export const RoundedCornerChange = ({ set }: Props) => {
  const [roundedCorner, setRoundedCorner] = useState(0);
  const { appSettings } = useAppSettingsStore();
  const data = appSettings;
  const actualCornerRadius: number = data.roundedCorner ?? 0;

  useEffect(() => {
    setRoundedCorner(actualCornerRadius);
  }, [actualCornerRadius]);

  const handleChangeRoundedCorner = (radius: number) => {
    const htmlTag = document.getElementsByTagName("html")[0];
    htmlTag.classList.remove(`radius-${roundedCorner}`);
    htmlTag.classList.add(`radius-${radius}`);
    setRoundedCorner(radius);
    set(radius);
  };

  return (
    <div className="mt-10">
      <div className="w-full mt-5 gap-5 mx-auto">
        <Slider
          onValueChange={(e) => handleChangeRoundedCorner(e[0] + 1)}
          defaultValue={[actualCornerRadius]}
          max={20}
          step={1}
          className="w-full"
        />
      </div>
    </div>
  );
};