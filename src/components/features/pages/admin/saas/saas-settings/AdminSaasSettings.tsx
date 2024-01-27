import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { SubSectionWrapper } from "@/src/components/ui/user-interface/SubSectionWrapper";
import { cn } from "@/src/lib/utils";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { SaasTypes } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";
import { updateSaasSettings } from "../../actions.server";
import { SetCurrency } from "./@subsections/SetCurrency";
import { SetSaasType } from "./@subsections/SetSaasType";
import { SetTax } from "./@subsections/SetTax";
import { SetCreditName } from "./@subsections/more-settings/SetCreditName";
import ToggleActiveCreditSystem from "./@subsections/more-settings/toggles/ToggleActiveCreditSystem";
import ToggleActiveMonthlyPlan from "./@subsections/more-settings/toggles/ToggleActiveMonthlyPlan";
import ToggleActiveRefillCredit from "./@subsections/more-settings/toggles/ToggleActiveRefillCredit";
import ToggleActiveYearlyPlan from "./@subsections/more-settings/toggles/ToggleActiveYearlyPlan";

export const AdminSaasSettings = () => {
  // 
  
  // 
  const { saasSettings, setSaasSettings } = useSaasSettingsStore();
  const [tax, setTax] = useState<number>(0);
  const [currency, setCurrency] = useState<string>("usd");
  const [saasType, setSaasType] = useState<SaasTypes>("MRR_SIMPLE");
  const [creditName, setCreditName] = useState<string>("credit");
  const [save, setSave] = useState(false);
  const [cancel, setCancel] = useState(false);
  const [initialSettings, setInitialSettings] = useState({
    ...saasSettings,
  });

  useEffect(() => {
    if (
      saasSettings.tax !== tax ||
      saasSettings.saasType !== (initialSettings.saasType as SaasTypes) ||
      saasSettings.currency !== currency ||
      saasSettings.creditName !== creditName
    ) {
      setSaveAndCancel(true);
    } else {
      setSaveAndCancel(false);
    }
  }, [
    saasSettings,
    tax,
    currency,
    saasType,
    creditName,
    initialSettings.saasType,
  ]);

  const setSaveAndCancel = (value: boolean) => {
    setSave(value);
    setCancel(value);
  };

  useEffect(() => {
    setTax(saasSettings.tax ?? 0);
    setSaasType(saasSettings.saasType ?? "MRR_SIMPLE");
    setCurrency(saasSettings.currency ?? "usd");
    setCreditName(saasSettings.creditName ?? "credit");
  }, [saasSettings, setTax]);

  const handleCancel = () => {
    setSaasSettings({
      ...saasSettings,
      tax: initialSettings.tax,
      currency: initialSettings.currency,
      saasType: initialSettings.saasType,
      creditName: initialSettings.creditName,
    });
    setCancel(false);
  };

  const handleSaveAll = useCallback(async () => {
    const dataToSet = await updateSaasSettings(saasSettings.id, {
      tax: tax,
      currency: currency,
      saasType: saasType as SaasTypes,
      creditName: creditName,
    });

    if (dataToSet) {
      setSaasSettings({
        ...saasSettings,
        tax: tax,
        currency: currency,
        saasType: saasType as SaasTypes,
        creditName: creditName,
      });

      setInitialSettings({
        ...saasSettings,
        tax: tax,
        currency: currency,
        saasType: saasType as SaasTypes,
        creditName: creditName,
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
  }, [saasSettings, tax, currency, saasType, creditName, setSaasSettings]);

  return (
    <>
      <SubSectionWrapper
        sectionName="SaaS mode"
        className="col-span-12"
        id="sub-saas-set-saas-type"
        info="Lorem ipsum dolor concecterut ipsum dolor concecterut ipsum dolor concecterut ">
        <div className="flex flex-col gap-4">
          <SetSaasType set={setSaasType} />
        </div>
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
      {(saasSettings.saasType === "MRR_SIMPLE" ||
        saasSettings.saasType === "CREDIT") && (
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

          <div
            className={`mt-10 mb-5 px-2`}>
            <SetCreditName
              disabled={!saasSettings.activeCreditSystem}
              set={setCreditName}
            />
          </div>
        </SubSectionWrapper>
      )}
      <div className="flex flex-row justify-between mt-10 gap-2">
        <Button
          variant={"link"}
          className={cn({ "opacity-0": !save }, "grayscale-50")}
          onClick={handleCancel}>
          Reset
        </Button>
        <Button
          disabled={!save}
          className={cn({ disabled: !save }, "place-self-end")}
          onClick={handleSaveAll}>
          Save changes
        </Button>
      </div>
    </>
  );
};
