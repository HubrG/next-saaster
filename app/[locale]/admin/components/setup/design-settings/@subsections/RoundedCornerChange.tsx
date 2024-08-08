"use client";

import { Slider } from "@/src/components/ui/@shadcn/slider";
import { cn } from "@/src/lib/utils";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { useEffect, useState } from "react";

type Props = {
  set: (value: number) => void;
};

export const RoundedCornerChange = ({ set }: Props) => {
  const [roundedCorner, setRoundedCorner] = useState(0);
  const { appSettings } = useAppSettingsStore();

  useEffect(() => {
    if (appSettings.roundedCorner) {
      setRoundedCorner(appSettings.roundedCorner);
    }
  }, [appSettings]);

  const handleChangeRoundedCorner = (radius: number) => {
    const htmlTag = document.getElementsByTagName("html")[0];
    htmlTag.classList.remove(`radius-${roundedCorner}`);
    htmlTag.classList.add(`radius-${radius}`);
    setRoundedCorner(radius);
    set(radius);
  };

  if (!appSettings.roundedCorner) {
    return null;
  }

  return (
    <div className="mt-5">
      <div className="w-full flex flex-col gap-5 mx-auto relative">
        <p
          className={cn(" text-lg absolute top-5 text-left font-bold")}
          style={{ left: ((roundedCorner - 1) / (20 - 1)) * 90 + "%" }}>
          {roundedCorner - 1}px
        </p>
        <Slider
          onValueChange={(e) => handleChangeRoundedCorner(e[0] + 1)}
          defaultValue={[appSettings.roundedCorner]}
          value={[roundedCorner - 1]}
          max={20}
          step={1}
          className="w-full"
        />
      </div>
    </div>
  );
};
