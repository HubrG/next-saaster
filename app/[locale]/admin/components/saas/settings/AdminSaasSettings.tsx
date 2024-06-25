"use client";
import { Loader } from "@/src/components/ui/@fairysaas/loader";
import { toaster } from "@/src/components/ui/@fairysaas/toaster/ToastConfig";
import { SubSectionWrapper } from "@/src/components/ui/@fairysaas/user-interface/SubSectionWrapper";
import { Button } from "@/src/components/ui/button";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import { cn } from "@/src/lib/utils";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { SaasTypes } from "@prisma/client";
import { Suspense, useCallback, useEffect, useState } from "react";
import { updateSaasSettings } from "../../../queries/app-saas-settings.action";
import { SetCreditName } from "./@subsections/SetCreditName";
import { SetCurrency } from "./@subsections/SetCurrency";
import { SetSaasType } from "./@subsections/SetSaasType";
import { SetMaxRefillCredit } from "./@subsections/refill/SetMaxRefillCredit";
import { SetPriceForOneRefillCredit } from "./@subsections/refill/SetPriceForOneRefillCredit";
import { SetRefillCreditStep } from "./@subsections/refill/SetRefillCreditStep";
import { SetRefillDiscount } from "./@subsections/refill/SetRefillDiscount";
import { SetRefillDiscountStep } from "./@subsections/refill/SetRefillDiscountStep";
import SwitchActiveRefillDiscount from "./@subsections/refill/refill-switches/SwitchActiveRefillDiscount";
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
  const [discountForRefillCredit, setDiscountForRefillCredit] =
    useState<number>(0);
  const [
    applyDiscountByXRefillCreditStep,
    setApplyDiscountByXRefillCreditStep,
  ] = useState<number>(0);
  const [priceForOneRefillCredit, setPriceForOneRefillCredit] =
    useState<number>(1);
  const [maxRefillCredit, setMaxRefillCredit] = useState<number>(100);
  const [refillCreditStep, setRefillCreditStep] = useState<number>(10);

  useEffect(() => {
    if (
      saasSettings.tax !== tax ||
      saasSettings.saasType !== (initialSettings.saasType as SaasTypes) ||
      saasSettings.currency !== currency ||
      saasSettings.creditName !== creditName ||
      saasSettings.discountForRefillCredit !== discountForRefillCredit ||
      saasSettings.applyDiscountByXRefillCreditStep !==
        applyDiscountByXRefillCreditStep ||
      priceForOneRefillCredit !== saasSettings.priceForOneRefillCredit ||
      maxRefillCredit !== saasSettings.maxRefillCredit ||
      refillCreditStep !== saasSettings.refillCreditStep
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
    discountForRefillCredit,
    applyDiscountByXRefillCreditStep,
    priceForOneRefillCredit,
    maxRefillCredit,
    refillCreditStep,
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
    setApplyDiscountByXRefillCreditStep(
      saasSettings.applyDiscountByXRefillCreditStep ?? 0
    );
    setDiscountForRefillCredit(saasSettings.discountForRefillCredit ?? 0);
    setPriceForOneRefillCredit(saasSettings.priceForOneRefillCredit ?? 1);
    setMaxRefillCredit(saasSettings.maxRefillCredit ?? 100);
    setRefillCreditStep(saasSettings.refillCreditStep ?? 10);
  }, [saasSettings, setTax]);

  const handleCancel = () => {
    setSaasSettings({
      ...saasSettings,
      tax: initialSettings.tax,
      currency: initialSettings.currency,
      saasType: initialSettings.saasType,
      creditName: initialSettings.creditName,
      discountForRefillCredit: initialSettings.discountForRefillCredit,
      applyDiscountByXRefillCreditStep:
        initialSettings.applyDiscountByXRefillCreditStep,
      priceForOneRefillCredit: initialSettings.priceForOneRefillCredit,
      maxRefillCredit: initialSettings.maxRefillCredit,
      refillCreditStep: initialSettings.refillCreditStep,
    });
    setCancel(false);
  };

  const handleSaveAll = useCallback(async () => {
    const dataToSet = await updateSaasSettings(
      saasSettings.id,
      {
        tax,
        currency,
        saasType: saasType as SaasTypes,
        creditName,
        discountForRefillCredit,
        applyDiscountByXRefillCreditStep,
        priceForOneRefillCredit,
        maxRefillCredit,
        refillCreditStep,
      },
      chosenSecret()
    );

    if (dataToSet) {
      setSaasSettings({
        ...saasSettings,
        tax: tax,
        currency: currency,
        saasType: saasType as SaasTypes,
        creditName: creditName,
        discountForRefillCredit,
        applyDiscountByXRefillCreditStep,
        priceForOneRefillCredit,
        maxRefillCredit,
        refillCreditStep,
      });

      setInitialSettings({
        ...saasSettings,
        tax: tax,
        currency: currency,
        saasType: saasType as SaasTypes,
        creditName: creditName,
        discountForRefillCredit,
        applyDiscountByXRefillCreditStep,
        priceForOneRefillCredit,
        maxRefillCredit,
        refillCreditStep,
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
  }, [
    saasSettings,
    tax,
    currency,
    saasType,
    creditName,
    setSaasSettings,
    discountForRefillCredit,
    applyDiscountByXRefillCreditStep,
    priceForOneRefillCredit,
    maxRefillCredit,
    refillCreditStep,
  ]);

  return (
    <>
      <SubSectionWrapper
        sectionName="Business model"
        className="col-span-12"
        id="sub-saas-set-saas-type"
        info="Select a business model for your SaaS business. All business models are based on Stripe's system">
        <div className="flex flex-col gap-4">
          <Suspense fallback={<Loader noHFull />}>
            <SetSaasType set={setSaasType} />
          </Suspense>
        </div>
      </SubSectionWrapper>
      <SubSectionWrapper
        sectionName="Currency"
        className="col-span-12"
        id="sub-saas-set-saas-tax"
        info="Set the currency for your SaaS business model and define the credit name.">
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
            className={cn({ "my-disabled": !save }, "grayscale-50")}
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

      <SubSectionWrapper
        sectionName="More settings"
        id="sub-saas-set-saas-settings"
        info="Manage more settings for your SaaS business model.">
        <div className="multiple-components mt-5">
          <Suspense fallback={<Loader noHFull />}>
            {(saasSettings.saasType === "MRR_SIMPLE" ||
              saasSettings.saasType === "PER_SEAT") && (
              <>
                <SwitchActiveMonthlyPlan />
                <SwitchActiveYearlyPlan />
              </>
            )}
            <SwitchActiveCreditSystem />
            <SwitchActiveRefillCredit />
          </Suspense>
        </div>
      </SubSectionWrapper>

      <SubSectionWrapper
        className={cn({ "my-disabled": !saasSettings.activeRefillCredit })}
        sectionName="Refill credits settings"
        id="sub-saas-set-saas-refill-settings"
        info={`${
          !saasSettings.activeRefillCredit
            ? "You must enabled the refill credit to manage refill credits settings"
            : "Manage refill credits settings"
        }`}>
        <div className="flex-col-center gap-5 mt-14">
          <Suspense fallback={<Loader noHFull />}>
            <SetMaxRefillCredit
              disabled={!saasSettings.activeRefillCredit}
              set={setMaxRefillCredit}
            />
          </Suspense>
          <Suspense fallback={<Loader noHFull />}>
            <SetRefillCreditStep
              disabled={!saasSettings.activeRefillCredit}
              set={setRefillCreditStep}
            />
          </Suspense>
          <Suspense fallback={<Loader noHFull />}>
            <SetPriceForOneRefillCredit
              disabled={!saasSettings.activeRefillCredit}
              set={setPriceForOneRefillCredit}
            />
          </Suspense>
          <SwitchActiveRefillDiscount />
          <div
            className={cn(
              { "!my-disabled": !saasSettings.activeDiscountRefillCredit },
              "flex-col-center gap-10 w-full"
            )}>
            <Suspense fallback={<Loader noHFull />}>
              <SetRefillDiscount
                disabled={!saasSettings.activeRefillCredit}
                set={setDiscountForRefillCredit}
              />
            </Suspense>
            <Suspense fallback={<Loader noHFull />}>
              <SetRefillDiscountStep
                disabled={!saasSettings.activeRefillCredit}
                set={setApplyDiscountByXRefillCreditStep}
                maxCredit={maxRefillCredit}
              />
            </Suspense>
          </div>
        </div>
        <div className="flex flex-row justify-between mt-10 gap-2">
          <Button
            variant={"link"}
            className={cn({ "my-disabled": !save }, "grayscale-50")}
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
    </>
  );
};
