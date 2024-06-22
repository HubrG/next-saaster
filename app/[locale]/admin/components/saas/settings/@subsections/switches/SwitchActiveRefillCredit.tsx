"use client";
import { updateSaasSettings } from "@/app/[locale]/admin/queries/app-saas-settings.action";
import { toaster } from "@/src/components/ui/@fairysaas/toaster/ToastConfig";
import { SwitchWrapper } from "@/src/components/ui/@fairysaas/user-interface/ui/SwitchWrapper";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { CreditCard } from "lucide-react";
import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";

export default function SwitchActiveMonthlyPlan() {
  const [activeRefillCredit, setActiveRefillCredit] = useState<boolean>(true);
  const { saasSettings, setSaasSettings } = useSaasSettingsStore();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setActiveRefillCredit(saasSettings.activeRefillCredit ?? false);
  }, [saasSettings]);

  const isActiveCreditSystem = saasSettings.activeCreditSystem === false;

  const handleChangeActiveRefillCredit = async (e: any) => {
    setLoading(true);
    if (saasSettings.id) {
      if (saasSettings.activeCreditSystem === false) {
        setLoading(false);
        return toaster({
          type: "error",
          duration: 8000,
          description:
            "You can't enable the refill credit if the credit system is disabled, please enable it",
        });
      }
      setSaasSettings({ ...saasSettings, activeRefillCredit: e });
      const dataToSet = await updateSaasSettings(saasSettings.id, {
        activeRefillCredit: e,
      }, chosenSecret());
      if (dataToSet) {
        setActiveRefillCredit(e);
        setLoading(false);
        return toaster({
          description: `Refill credit ${e ? "enabled" : "disabled"}`,
          type: "success",
        });
      } else {
        setSaasSettings({ ...saasSettings, activeRefillCredit: !e });
        setLoading(false);
        return toaster({
          type: "error",
          description: "Refill credit option not changed, please try again",
        });
      }
    }
  };

  return (
    <>
      <div
        className={`${
          isActiveCreditSystem && "opacity-45 !cursor-not-allowed"
        }`}>
        <SwitchWrapper
          handleChange={handleChangeActiveRefillCredit}
          checked={activeRefillCredit}
          loading={loading}
          icon={<CreditCard className="icon" />}
          disabled={isActiveCreditSystem}
          id="switch-active-refill-credit">
          Active the <strong>refill credit</strong> for your SaaS
        </SwitchWrapper>
      </div>
      {isActiveCreditSystem ? (
        <Tooltip
          id="tooltip-switch-active-refill-credit"
          opacity={1}
          variant="dark"
          className="tooltip"
          place={"top"}>
          <span className="font-bold">
            You can&apos;t activate this option if « Credit system » is
            disabled.
          </span>
        </Tooltip>
      ) : (
        <Tooltip
          id="tooltip-switch-active-refill-credit"
          className="tooltip"
          opacity={1}
          variant="dark"
          place={"top"}>
          <span>
            In addition to the chosen plan, you offer the user the possibility
            of topping up, or even increasing their monthly credit if it has
            been spent.
          </span>
        </Tooltip>
      )}
    </>
  );
}
