import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { SubSectionWrapper } from "@/src/components/ui/user-interface/SubSectionWrapper";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { SaasTypes } from "@prisma/client";
import { useEffect, useState } from "react";
import { changeSaasSettings } from "../../actions.server";
import { SetCurrency } from "./@subcomponents/SetCurrency";
import { SetSaasType } from "./@subcomponents/SetSaasType";
import { SetTax } from "./@subcomponents/SetTax";
import ToggleActiveCreditSystem from "./@subcomponents/toggles/ToggleActiveCreditSystem";
import ToggleActiveMonthlyPlan from "./@subcomponents/toggles/ToggleActiveMonthlyPlan";
import ToggleActiveRefillCredit from "./@subcomponents/toggles/ToggleActiveRefillCredit";
import ToggleActiveYearlyPlan from "./@subcomponents/toggles/ToggleActiveYearlyPlan";

export const AdminSaasSettings = () => {
  const { saasSettings, setSaasSettings } = useSaasSettingsStore();
  const [tax, setTax] = useState<number>(0);
  const [currency, setCurrency] = useState<string>("usd");
  const [saasType, setSaasType] = useState<string>("");

  useEffect(() => {
    setTax(saasSettings.tax ?? 0);
    setSaasType(saasSettings.saasType ?? "MRRS");
    setCurrency(saasSettings.currency ?? "usd");
  }, [saasSettings]);

  const handleSaveAll = async () => {
    const dataToSet = await changeSaasSettings(saasSettings.id, {
      tax: tax,
      currency: currency,
      saasType: saasType as SaasTypes,
    });

    if (dataToSet === true) {
      setSaasSettings({
        ...saasSettings,
        currency: currency ?? "usd",
        tax: tax ?? 0,
      });

      return toaster({
        description: `Settings changed successfully`,
        type: "success",
      });
    } else {
      return toaster({
        description: `Error while changing settings, please try again later`,
        type: "error",
      });
    }
  };

  return (
    <>
      <SubSectionWrapper
        sectionName="SaaS mode"
        className="col-span-12"
        id="sub-saas-set-saas-type"
        info="Lorem ipsum dolor concecterut ipsum dolor concecterut ipsum dolor concecterut ">
        <SetSaasType set={setSaasType} />
      </SubSectionWrapper>
      <SubSectionWrapper
        sectionName="Taxes & currency"
        className="col-span-12"
        id="sub-saas-set-saas-tax"
        info="Lorem ipsum dolor concecterut ipsum dolor concecterut ipsum dolor concecterut ">
        <div className="grid grid-cols-12">
          <div className="col-span-5">
            <SetTax set={setTax} />
          </div>
            <Separator className="col-span-2 mx-auto" orientation="vertical" />
          <div className="col-span-5">
            <SetCurrency set={setCurrency} />
          </div>
        </div>
      </SubSectionWrapper>
      {saasSettings.saasType !== "CREDIT" && (
        <SubSectionWrapper
          sectionName="More settings"
          id="sub-saas-set-saas-settings"
          info="Lorem ipsum dolor concecterut ipsum dolor concecterut ipsum dolor concecterut ">
          <div className="multiple-components grid grid-cols-2">
            <ToggleActiveMonthlyPlan />
            <ToggleActiveYearlyPlan />
            <ToggleActiveCreditSystem />
            <ToggleActiveRefillCredit />
          </div>
        </SubSectionWrapper>
      )}
      <div className="flex justify-end mt-10">
        <Button onClick={handleSaveAll}>Save SaaS settings</Button>
      </div>
    </>
  );
};
