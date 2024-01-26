"use client";
import {
  updateSaasSettings
} from "@/src/components/features/pages/admin/actions.server";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { ToggleWrapper } from "@/src/components/ui/user-interface/ui/ToggleWrapper";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { MoonStar } from "lucide-react";
import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";

export default function ToggleActiveMonthlyPlan() {
  const [activeRefillCredit, setActiveRefillCredit] = useState<boolean>(true);
  const { saasSettings, setSaasSettings } = useSaasSettingsStore();

  useEffect(() => {
    setActiveRefillCredit(saasSettings.activeRefillCredit ?? false);
  }, [saasSettings]);

  const isActiveCreditSystem = saasSettings.activeCreditSystem === false;

  const handleChangeActiveRefillCredit = async (e: any) => {
    if (saasSettings.id) {
      if (saasSettings.activeCreditSystem === false) {
        return toaster({
          type: "error",
          duration: 8000,
          description:
            "You can't enable the refill credit if the credit system is disabled, please enable it",
        });
      }
      const dataToSet = await updateSaasSettings(saasSettings.id, {
        activeRefillCredit: e,
      });
      if (dataToSet) {
        setActiveRefillCredit(e);
        setSaasSettings({ ...saasSettings, activeRefillCredit: e });
        return toaster({
          description: `Refill credit ${e ? "enabled" : "disabled"}`,
          type: "success",
        });
      } else {
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
        data-tooltip-id="tooltip-switch-active-refill-credit"
        className={`${
          isActiveCreditSystem && "opacity-45 !cursor-not-allowed"
        }`}>
        <ToggleWrapper
          handleChange={handleChangeActiveRefillCredit}
          checked={activeRefillCredit}
          disabled={isActiveCreditSystem}
          id="switch-active-refill-credit">
          <MoonStar className="icon" />
          Active the <strong>refill credit</strong> for your SaaS
          <div className="toggle-info">
            In addition to the chosen plan, you offer the user the possibility
            of topping up, or even increasing their monthly credit if it has
            been spent.
          </div>
        </ToggleWrapper>
      </div>
      {isActiveCreditSystem && (
        <Tooltip
          id="tooltip-switch-active-refill-credit"
          opacity={1}
          variant="dark"
          place={"top"}>
          <span className="font-bold">
            You can&apos;t activate this option if « Credit system » is
            disabled.
          </span>
        </Tooltip>
      )}
    </>
  );
}
