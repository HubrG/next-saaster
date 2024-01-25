"use client";
import { changeActiveCreditSystem } from "@/src/components/features/pages/admin/actions.server";
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
      if (saasSettings.activeYearlyPlans === false && e === false) {
        return toaster({
          type: "error",
          duration: 8000,
          description:
            "You can't disable both yearly and monthly plans, please enable one of them",
        });
      }
      const dataToSet = await changeActiveCreditSystem(saasSettings.id, e);
      if (dataToSet === true) {
        setActiveCreditSystem(e);
        setSaasSettings({ ...saasSettings, activeCreditSystem: e });
        return toaster({
          description: `Monthly plans ${e ? "enabled" : "disabled"}`,
          type: "success",
        });
      } else {
        return toaster({
          type: "error",
          description: "Monthly plans otpion not changed, please try again",
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
        All features will be linked to the spending
        of a single resource (tokens, credits, etc.).
      </div>
    </ToggleWrapper>
  );
}
