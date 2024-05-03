"use client";
import { RoundedCornerChange } from "@/app/[locale]/admin/components/setup/design-settings/@subsections/RoundedCornerChange";
import { ThemeColorChange } from "@/app/[locale]/admin/components/setup/design-settings/@subsections/ThemeColorChange";
import { updateAppSettings } from "@/app/[locale]/admin/queries/app-saas-settings.action";
import { ButtonWithLoader } from "@/src/components/ui/@fairysaas/button-with-loader";
import { toaster } from "@/src/components/ui/@fairysaas/toaster/ToastConfig";
import { SubSectionWrapper } from "@/src/components/ui/@fairysaas/user-interface/SubSectionWrapper";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import useSaveAndCancel, {
  GenericDataObject,
} from "@/src/hooks/useSaveAndCancel";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { useEffect, useState } from "react";

export const SetupDesign = () => {
  const { appSettings, setAppSettings } = useAppSettingsStore();
  const [roundedCorner, setRoundedCorner] = useState(appSettings.roundedCorner);
  const [cssTheme, setCssTheme] = useState(appSettings.theme);
  const [reseted, setReseted] = useState(false);

  const { isLoading, isDirty, handleReset, handleSave, handleChange } =
    useSaveAndCancel({
      initialData: {
        roundedCorner: appSettings.roundedCorner,
        theme: appSettings.theme,
      } as GenericDataObject,
      onSave: async (data) => {
        const updateInfo = await updateAppSettings(appSettings.id, data, chosenSecret());
        if (updateInfo) {
          setAppSettings({ ...appSettings, ...data });
          toaster({
            description: "Design changed for all users",
            type: "success",
          });
        } else {
          toaster({
            description: "Design not changed, please try again",
            type: "error",
          });
        }
      },
      onReset: async () => {
        setAppSettings({
          ...appSettings,
          roundedCorner: appSettings.roundedCorner,
          theme: appSettings.theme,
        });
        setReseted(true);
        setRoundedCorner(appSettings.roundedCorner);
        setCssTheme(appSettings.theme);
      },
    });

  useEffect(() => {
    handleChange({ roundedCorner, theme: cssTheme });
  }, [roundedCorner, cssTheme, handleChange]);

  return (
    <>
      <SubSectionWrapper
        sectionName="Theme color"
        id="sub-theme-color"
        info="Lorem ipsum dolor concecterut ipsum dolor concecterut ipsum dolor concecterut ">
        <ThemeColorChange
          set={setCssTheme}
          reseted={reseted ?? false}
          setReseted={setReseted}
        />
      </SubSectionWrapper>
      <SubSectionWrapper sectionName="Rounded corner" id="sub-rounded-corner">
        <RoundedCornerChange set={setRoundedCorner} />
      </SubSectionWrapper>
      <div className="flex justify-between mt-10">
        <ButtonWithLoader
          type="button"
          disabled={!isDirty || isLoading}
          variant="link"
          onClick={() => {
            handleReset();
          }}>
          Reset
        </ButtonWithLoader>
        <ButtonWithLoader
          type="submit"
          onClick={() => handleSave({ roundedCorner, theme: cssTheme })}
          disabled={!isDirty || isLoading}
          loading={isLoading}>
          Update
        </ButtonWithLoader>
      </div>
    </>
  );
};
