import { useEffect, useState } from "react";
import { RoundedCornerChange } from "@/src/components/features/pages/admin/setup/design-settings/subsections/RoundedCornerChange";
import { appSettings } from "@prisma/client";
import { ThemeColorChange } from "@/src/components/features/pages/admin/setup/design-settings/subsections/ThemeColorChange";
import { Toastify } from "@/src/components/ui/toastify/Toastify";
import { changeDesignSettings } from "@/src/components/features/pages/admin/setup/actions.server";
import { Button } from "@/src/components/ui/button";
import colorThemes from "@/src/jsons/css-themes.json";
import { AdminSubSectionWrapper } from "@/src/components/features/pages/admin/ui/AdminSubSectionWrapper";

type Props = {
  data: appSettings;
};

export const SetupDesign = ({ data }: Props) => {
  const [roundedCorner, setRoundedCorner] = useState(0);
  const [cssTheme, setCssTheme] = useState<string>("");

  useEffect(() => {
    setRoundedCorner(data.roundedCorner ?? 0);
    setCssTheme(data.theme ?? "");
  }, [data]);

  const handleSaveAll = async () => {
    const dataToSet = await changeDesignSettings(data.id, {
      roundedCorner: roundedCorner,
      theme: cssTheme,
    });

    if (dataToSet === true) {
      return Toastify({
        type: "success",
        value: "Design changed for all",
      });
    } else {
      return Toastify({
        type: "error",
        value: "Design not changed",
      });
    }
  };

  function getNameForTheme(themeKey: string | null | undefined) {
    const key = themeKey as keyof typeof colorThemes;
    if (colorThemes[key]) {
      return colorThemes[key].name;
    }
    return null;
  }

  return (
    <>
      <AdminSubSectionWrapper
        sectionName="Theme color"
        id="sub-theme-color"
        info="Lorem ipsum dolor concecterut ipsum dolor concecterut ipsum dolor concecterut ">
        <ThemeColorChange data={data} set={setCssTheme} />
      </AdminSubSectionWrapper>
      <AdminSubSectionWrapper
        sectionName="Rounded corner"
        id="sub-rounded-corner">
        <RoundedCornerChange data={data} set={setRoundedCorner} />
      </AdminSubSectionWrapper>
      <div className="flex justify-end mt-10">
        <Button onClick={handleSaveAll}>
          Save design for&nbsp;<strong>{getNameForTheme(cssTheme)}</strong>
          &nbsp;with a rounded corner of&nbsp;<strong>{roundedCorner}px</strong>
        </Button>
      </div>
    </>
  );
};
