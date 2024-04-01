"use client";
import { Loader } from "@/src/components/ui/@fairysaas/loader";
import { toaster } from "@/src/components/ui/@fairysaas/toaster/ToastConfig";
import { SubSectionWrapper } from "@/src/components/ui/@fairysaas/user-interface/SubSectionWrapper";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { SaasTypes } from "@prisma/client";
import { Suspense, useCallback, useEffect, useState } from "react";
import { updateSaasSettings } from "../../../queries/app-saas-settings.action";
import { SetCreditName } from "./@subsections/SetCreditName";
import { SetCurrency } from "./@subsections/SetCurrency";
import { SetSaasType } from "./@subsections/SetSaasType";
import SwitchActiveCreditSystem from "./@subsections/switches/SwitchActiveCreditSystem";
import SwitchActiveMonthlyPlan from "./@subsections/switches/SwitchActiveMonthlyPlan";
import SwitchActiveRefillCredit from "./@subsections/switches/SwitchActiveRefillCredit";
import SwitchActiveYearlyPlan from "./@subsections/switches/SwitchActiveYearlyPlan";

export const AdminSaasSettings = () => {
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
        sectionName="Business model"
        className="col-span-12"
        id="sub-saas-set-saas-type"
        info="Lorem ipsum dolor concecterut ipsum dolor concecterut ipsum dolor concecterut ">
        <div className="flex flex-col gap-4">
          <Suspense fallback={<Loader noHFull />}>
            <SetSaasType
              set={setSaasType}
            />
          </Suspense>
        </div>
      </SubSectionWrapper>
      <SubSectionWrapper
        sectionName="Currency"
        className="col-span-12"
        id="sub-saas-set-saas-tax"
        info="Lorem ipsum dolor concecterut ipsum dolor concecterut ipsum dolor concecterut ">
        <div className="grid grid-cols-12">
          {/* <div className="col-span-5">
            <Suspense fallback={<Loader noHFull />}>
              <SetTax set={setTax} />
            </Suspense>
          </div>
          <Separator className="col-span-2 mx-auto" orientation="vertical" /> */}
          <div className="col-span-12">
            <Suspense fallback={<Loader noHFull />}>
              <SetCurrency set={setCurrency} />
            </Suspense>
          </div>
        </div>
        <div className={`mt-10 mb-5 px-2`}>
          <Suspense fallback={<Loader noHFull />}>
            <SetCreditName
              disabled={!saasSettings.activeCreditSystem}
              set={setCreditName}
            />
          </Suspense>
        </div>
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
      </SubSectionWrapper>
      {(saasSettings.saasType === "MRR_SIMPLE" ||
        saasSettings.saasType === "PER_SEAT") && (
        <>
          <SubSectionWrapper
            sectionName="More settings"
            id="sub-saas-set-saas-settings"
            info="Lorem ipsum dolor concecterut ipsum dolor concecterut ipsum dolor concecterut ">
            {(saasSettings.saasType === "MRR_SIMPLE" ||
              saasSettings.saasType === "PER_SEAT") && (
              <div className="multiple-components mt-5">
                <Suspense fallback={<Loader noHFull />}>
                  <SwitchActiveMonthlyPlan />
                  <SwitchActiveYearlyPlan />
                  <SwitchActiveCreditSystem />
                  <SwitchActiveRefillCredit />
                </Suspense>
              </div>
            )}
          </SubSectionWrapper>
        </>
      )}
    </>
  );
};
