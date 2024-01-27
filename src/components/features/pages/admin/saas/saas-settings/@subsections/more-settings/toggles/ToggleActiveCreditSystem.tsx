"use client";
import { updateSaasSettings } from "@/src/components/features/pages/admin/actions.server";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { ToggleWrapper } from "@/src/components/ui/user-interface/ui/ToggleWrapper";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { MoonStar } from "lucide-react";
import { useEffect, useState } from "react";

export default function ToggleActiveMonthlyPlan() {
  const [activeCreditSystem, setActiveCreditSystem] = useState<boolean>(true);
  const { saasSettings, setSaasSettings } = useSaasSettingsStore();

  useEffect(() => {
    setActiveCreditSystem(saasSettings.activeCreditSystem ?? false);
  }, [saasSettings]);

  const handleChangeActiveCreditSystem = async (e: any) => {
    if (saasSettings.id) {
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
        id="switch-active-credit-system">
        <MoonStar className="icon" />
        Active the <strong>credit system</strong> for your SaaS
        <div className="toggle-info">
          All features will be linked to the spending of a single resource
          (tokens, credits, etc.).
        </div>
      </ToggleWrapper>
  );
}
