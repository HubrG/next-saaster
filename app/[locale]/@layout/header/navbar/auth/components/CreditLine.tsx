"use client";
import {
  ReturnUserDependencyProps,
  getUserInfos,
} from "@/src/helpers/dependencies/user";
import { useUserStore } from "@/src/stores/userStore";
import { SaasSettings } from "@prisma/client";
import { useFormatter } from "next-intl";
import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";

type CreditLineProps = {
  userProfile?: ReturnUserDependencyProps;
  saasSettings: SaasSettings;
};

export const CreditLine = ({ userProfile, saasSettings }: CreditLineProps) => {
  const { userStore } = useUserStore();
  const [getUserProfile, setGetUserProfile] =
    useState<ReturnUserDependencyProps>();

  useEffect(() => {
    if (userStore?.id) {
      setGetUserProfile(
        getUserInfos({ user: userStore, email: userStore.email ?? "" })
      );
    }
  }, [userStore]);

  const format = useFormatter();
  return (
    <>
      {saasSettings.activeCreditSystem &&
        getUserProfile?.activeSubscription?.creditAllouedByMonth &&
        getUserProfile?.activeSubscription?.creditAllouedByMonth > 0 &&
        getUserProfile?.activeSubscription && (
          <>
            <div className="w-full userNavbarDiv">
              <div
                className="relative w-full"
                data-tooltip-id="remainingTooltip">
                <p className="text-center !text-xs -mt-1 pb-1">
                  {getUserProfile?.activeSubscription.creditRemaining}
                </p>

                <div
                  className={`${
                    getUserProfile?.activeSubscription.creditPercentage <= 0
                      ? "progressTokenVoid"
                      : getUserProfile?.activeSubscription.creditPercentage < 10
                      ? "progressToken bg-red-500"
                      : "progressToken"
                  }`}
                  style={{
                    width: `${
                      getUserProfile?.activeSubscription.creditPercentage <= 100
                        ? getUserProfile?.activeSubscription.creditPercentage
                        : 100
                    }%`,
                  }}>
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
                {saasSettings.creditName} :{" "}
                {getUserProfile?.activeSubscription.creditPercentage}%
              </span>
              {format.number(
                getUserProfile?.activeSubscription.creditRemaining
              )}
              &nbsp;/&nbsp;
              {format.number(
                getUserProfile?.activeSubscription.creditAllouedByMonth
              )}
            </Tooltip>
          </>
        )}
      {saasSettings.activeCreditSystem &&
        (saasSettings.saasType === "PAY_ONCE" ||
          saasSettings.saasType === "CUSTOM") &&
        !getUserProfile?.activeSubscription && (
          <>
            <div className="w-full userNavbarDiv">
              <div
                className="relative w-full"
                data-tooltip-id="remainingTooltip">
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
        )}
    </>
  );
};
