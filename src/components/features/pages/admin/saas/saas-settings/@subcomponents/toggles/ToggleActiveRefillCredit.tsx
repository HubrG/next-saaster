"use client";
import { changeActiveRefillCredit } from "@/src/components/features/pages/admin/actions.server";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { ToggleWrapper } from "@/src/components/ui/user-interface/ui/ToggleWrapper";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { MoonStar } from "lucide-react";
import { useEffect, useState } from "react";

export default function ToggleActiveMonthlyPlan() {
  const [activeRefillCredit, setActiveRefillCredit] = useState<boolean>(true);
  const { saasSettings, setSaasSettings } = useSaasSettingsStore();

  useEffect(() => {
    setActiveRefillCredit(saasSettings.activeRefillCredit ?? false);
  }, [saasSettings]);

  const handleChangeActiveRefillCredit = async (e: any) => {
    if (saasSettings.id) {
      if (saasSettings.activeYearlyPlans === false && e === false) {
        return toaster({
          type: "error",
          duration: 8000,
          description:
            "You can't disable both yearly and monthly plans, please enable one of them",
        });
      }
      const dataToSet = await changeActiveRefillCredit(saasSettings.id, e);
      if (dataToSet === true) {
        setActiveRefillCredit(e);
        setSaasSettings({ ...saasSettings, activeRefillCredit: e });
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
      handleChange={handleChangeActiveRefillCredit}
      checked={activeRefillCredit}
      id="switch-active-refill-credit">
      <MoonStar className="icon" />
      Active the <strong>refill credit</strong> for your SaaS
      <div className="toggle-info">
        In addition to the chosen plan, you offer the
        user the possibility of topping up, or even increasing their monthly
        credit if it has been spent.
      </div>
    </ToggleWrapper>
  );
}
