"use client";
import {
  ReturnUserDependencyProps,
  getUserInfos
} from "@/src/helpers/dependencies/user";
import { useUserInfoStore } from "@/src/stores/userInfoStore";
import { SaasSettings } from "@prisma/client";
import { useFormatter } from "next-intl";
import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";

type CreditLineProps = {
  saasSettings: SaasSettings;
};

export const CreditLine = ({saasSettings }: CreditLineProps) => {
  const { userInfoStore: userStore } = useUserInfoStore();
  const [getUserProfile, setGetUserProfile] =
    useState<ReturnUserDependencyProps>();
  const format = useFormatter();


  useEffect(() => {
    if (userStore?.info.id) {
      setGetUserProfile(
        getUserInfos({ user: userStore.info, email: userStore.info.email ?? "" })
      );
    }
  }, [userStore]);
 

  const renderCreditInfo = () => {
    if (!saasSettings.activeCreditSystem) return null;

    const { activeSubscription } = userStore || {};
    const creditRemaining = activeSubscription?.creditRemaining ?? 0;
    const creditPercentage = activeSubscription?.creditPercentage ?? 0;
    const creditAllouedByMonth = activeSubscription?.creditAllouedByMonth ?? 0;

    if (activeSubscription && creditRemaining !== 0) {
      return (
        <>
          <div className="w-full userNavbarDiv">
            <div className="relative w-full" data-tooltip-id="remainingTooltip">
              <p className="text-center !text-xs -mt-1 pb-1">
                {creditRemaining}
              </p>
              <div
                className={`${
                  creditPercentage <= 0
                    ? "progressTokenVoid"
                    : creditPercentage < 10
                    ? "progressToken bg-red-500"
                    : "progressToken"
                }`}
                style={{ width: `${Math.min(creditPercentage, 100)}%` }}>
                &nbsp;
              </div>
              <div className="progressTokenVoid"></div>
            </div>
          </div>
          <Tooltip
            id="remainingTooltip"
            opacity={1}
            place="bottom"
            className="tooltip flex flex-col">
            <span>
              {saasSettings.creditName} : {creditPercentage}%
            </span>
            {format.number(creditRemaining)}&nbsp;/&nbsp;
            {format.number(creditAllouedByMonth)}
          </Tooltip>
        </>
      );
    }

    if (
      (saasSettings.saasType === "PAY_ONCE" ||
        saasSettings.saasType === "CUSTOM") &&
      !activeSubscription
    ) {
      return (
        <>
          <div className="w-full userNavbarDiv">
            <div className="relative w-full" data-tooltip-id="remainingTooltip">
              <p className="text-center !text-xs font-bold">
                {format.number(getUserProfile?.info.creditRemaining ?? 0)}
              </p>
            </div>
          </div>
          <Tooltip
            id="remainingTooltip"
            opacity={1}
            place="bottom"
            className="tooltip flex flex-col">
            {format.number(getUserProfile?.info.creditRemaining ?? 0)}{" "}
            {saasSettings.creditName}s
          </Tooltip>
        </>
      );
    }

    return null;
  };

  return <>{renderCreditInfo()}</>;
};
