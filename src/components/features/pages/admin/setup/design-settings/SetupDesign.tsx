import { changeDesignSettings } from "@/src/components/features/pages/admin/actions.server";
import { RoundedCornerChange } from "@/src/components/features/pages/admin/setup/design-settings/@subsections/RoundedCornerChange";
import { ThemeColorChange } from "@/src/components/features/pages/admin/setup/design-settings/@subsections/ThemeColorChange";
import { Button } from "@/src/components/ui/button";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { SubSectionWrapper } from "@/src/components/ui/user-interface/SubSectionWrapper";
import colorThemes from "@/src/jsons/css-themes.json";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { useEffect, useState } from "react";

export const SetupDesign = () => {
  const [roundedCorner, setRoundedCorner] = useState(0);
  const [cssTheme, setCssTheme] = useState<string>("");
  const { appSettings } = useAppSettingsStore();
  const data = appSettings;

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
      return toaster({
        description: `Design changed for all`,
        type: "success",
      });
    } else {
      return toaster({
        description: `Design not changed, please try again`,
        type: "error",
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
      <SubSectionWrapper
        sectionName="Theme color"
        id="sub-theme-color"
        info="Lorem ipsum dolor concecterut ipsum dolor concecterut ipsum dolor concecterut ">
        <ThemeColorChange set={setCssTheme} />
      </SubSectionWrapper>
      <SubSectionWrapper sectionName="Rounded corner" id="sub-rounded-corner">
        <RoundedCornerChange set={setRoundedCorner} />
      </SubSectionWrapper>
      <div className="flex justify-end mt-10">
        <Button onClick={handleSaveAll}>
          Save&nbsp;<strong>{getNameForTheme(cssTheme)}</strong>
          &nbsp;with a rounded corner of&nbsp;<strong>{roundedCorner}px</strong>
          &nbsp; for all users
        </Button>
      </div>
    </>
  );
};
