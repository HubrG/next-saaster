"use client";

import { appSettings } from "@prisma/client";
import { Button } from "@/src/components/ui/button";
import { changeRoundedCorner } from "../actions.server";
import { Slider } from "@/src/components/ui/slider";
import { Toastify } from "@/src/components/layout/toastify/Toastify";
import { useEffect, useState } from "react";

type Props = {
  data: appSettings;
};

export const RoundedCornerChange = ({ data }: Props) => {
  const [roundedCorner, setRoundedCorner] = useState(0);
  const actualCornerRadius: number = data.roundedCorner ?? 0;

  useEffect(() => {
    setRoundedCorner(actualCornerRadius);
  }, [actualCornerRadius]);

  const handleChangeRoundedCorner = (radius: number) => {
    const htmlTag = document.getElementsByTagName("html")[0];
    htmlTag.classList.remove(`radius-${roundedCorner}`);
    htmlTag.classList.add(`radius-${radius}`);
    setRoundedCorner(radius);
  };

  const handleSaveRoundedCorner = async () => {
    const dataToSet = await changeRoundedCorner(data.id, roundedCorner);
    if (dataToSet === true) {
      return Toastify({
        type: "success",
        value: "Rounded corner changed",
      });
    } else {
      return Toastify({
        type: "error",
        value: "Rounded corner not changed",
      });
    }
  };

  return (
    <div>
      <div className="w-full mt-5 gap-5 mx-auto">
        <Slider
          onValueChange={(e) => handleChangeRoundedCorner(e[0] + 1)}
          defaultValue={[actualCornerRadius]}
          max={20}
          step={1}
          className="w-full"
        />
      </div>
      <div className="flex justify-end">
        <Button onClick={handleSaveRoundedCorner} className="mt-5">
          Apply this rounded corner for all users
        </Button>
      </div>
    </div>
  );
};
