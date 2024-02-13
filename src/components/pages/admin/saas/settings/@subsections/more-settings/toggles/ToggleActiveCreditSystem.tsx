"use client";
import { updateSaasSettings } from "@/src/components/pages/admin/queries/queries";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { ToggleWrapper } from "@/src/components/ui/user-interface/ui/ToggleWrapper";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";

export default function ToggleActiveMonthlyPlan() {
  const [activeCreditSystem, setActiveCreditSystem] = useState<boolean>(true);
  const { saasSettings, setSaasSettings } = useSaasSettingsStore();

  useEffect(() => {
    setActiveCreditSystem(saasSettings.activeCreditSystem ?? false);
  }, [saasSettings]);

  const handleChangeActiveCreditSystem = async (e: any) => {
    if (saasSettings.id) {
      setSaasSettings({ ...saasSettings, activeCreditSystem: e });

      const dataToSet = await updateSaasSettings(saasSettings.id, {
        activeCreditSystem: e,
        activeRefillCredit: !e && false,
      });
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
        return toaster({
          description: `Credit system ${e ? "enabled" : "disabled"}`,
          type: "success",
        });
      } else {
        setSaasSettings({ ...saasSettings, activeCreditSystem: !e });
        return toaster({
          type: "error",
          description: "Credit system option not changed, please try again",
        });
      }
    }
  };

  return (
    <ToggleWrapper
      handleChange={handleChangeActiveCreditSystem}
      checked={activeCreditSystem}
      icon={<Wallet className="icon" />}
      id="switch-active-credit-system">
      Active the <strong>credit system</strong> for your SaaS
      <Tooltip
        id="tooltip-switch-active-credit-system"
        opacity={1}
        variant="dark"
        className="tooltip"
        place={"top"}>
        <span>
          All features will be linked to the spending of a single resource
          (tokens, credits, etc.).
        </span>
      </Tooltip>
    </ToggleWrapper>
  );
}
