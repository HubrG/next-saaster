"use client";
import { updateSaasSettings } from "@/app/[locale]/admin/queries/app-saas-settings.action";
import { toaster } from "@/src/components/ui/@blitzinit/toaster/ToastConfig";
import { SwitchWrapper } from "@/src/components/ui/@blitzinit/user-interface/ui/SwitchWrapper";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";

export default function SwitchActiveMonthlyPlan() {
  const [activeCreditSystem, setActiveCreditSystem] = useState<boolean>(true);
  const { saasSettings, setSaasSettings } = useSaasSettingsStore();
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    setActiveCreditSystem(saasSettings.activeCreditSystem ?? false);
  }, [saasSettings]);

  const handleChangeActiveCreditSystem = async (e: any) => {
    setLoading(true);
    if (saasSettings.id) {
      setSaasSettings({ ...saasSettings, activeCreditSystem: e });
      const dataToSet = await updateSaasSettings(saasSettings.id, {
        activeCreditSystem: e,
        activeRefillCredit: !e && false,
      }, chosenSecret());
      if (dataToSet) {
        setActiveCreditSystem(e);
        if (saasSettings.activeRefillCredit === true && e === false) {
          setSaasSettings({ ...saasSettings, activeRefillCredit: false });
          toaster({
            type: "info",
            duration: 8000,
            description:
              "The credit refill has been disabled because it is linked to the credit system",
          });
        }
        setSaasSettings({
          ...saasSettings,
          activeCreditSystem: e,
          activeRefillCredit: false,
        });
        setLoading(false);
        return toaster({
          description: `Credit system ${e ? "enabled" : "disabled"}`,
          type: "success",
        });
      } else {
        setLoading(false);
        setSaasSettings({ ...saasSettings, activeCreditSystem: !e });
        return toaster({
          type: "error",
          description: "Credit system option not changed, please try again",
        });
      }
    }
   
  };

  return (
    <SwitchWrapper
      handleChange={handleChangeActiveCreditSystem}
      checked={activeCreditSystem}
      loading={loading}
      icon={<Wallet className="icon" />}
      id="switch-active-credit-system">
      Enable the <strong>credit system</strong> for your SaaS
      <Tooltip
        id="tooltip-switch-active-credit-system"
        
        variant="dark"
        className="tooltip"
        place={"top"}>
        <span>
          All features will be linked to the spending of a single resource
          (tokens, credits, etc.).
        </span>
      </Tooltip>
    </SwitchWrapper>
  );
}
