"use client";

import { PriceCardFeatures } from "@/app/[locale]/pricing/components/PriceCardFeatures";
import { Goodline } from "@/src/components/ui/@aceternity/good-line";
import { Button } from "@/src/components/ui/button";
import { Loader, SimpleLoader } from "@/src/components/ui/loader";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { ReturnProps, getUserInfos } from "@/src/helpers/dependencies/user";
import currenciesData from "@/src/jsons/currencies.json";
import { cn } from "@/src/lib/utils";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { useUserStore } from "@/src/stores/userStore";
import { Currencies } from "@/src/types/Currencies";
import { toLower } from "lodash";
import { Check, CreditCard, RotateCcw, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formatDateRelativeToNow } from "../../../../../../src/helpers/functions/convertDate";
import {
  cancelSubscription,
  changePaymentMethod,
  reportUsage,
} from "../../../queries/queries";
import { ButtonWithLoader } from "@/src/components/ui/@fairysaas/button-with-loader";
import { Tooltip } from "react-tooltip";

type ProfileBillingProps = {};

export const ProfileBilling = ({}: ProfileBillingProps) => {
  const router = useRouter();
  const { saasSettings } = useSaasSettingsStore();
  const currencies = currenciesData as Currencies;
  const { userStore, isStoreLoading, fetchUserStore } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<ReturnProps | null>();
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    if (!isStoreLoading) {
      setUserInfo(getUserInfos({ user: userStore }));
      setRefresh(false);
    }
  }, [userStore, refresh, isLoading, isStoreLoading]);
  if (!userInfo || userInfo?.isLoading) {
    return <Loader noHFull />;
  }

  // Dans votre composant ProfileBilling.tsx

  const handleCancelOrRestartSubscription = async (
    action: "cancel" | "restart",
    subscriptionId: string,
    userEmail: string
  ) => {
    setIsLoading(true);
    const cancel = await cancelSubscription(
      subscriptionId,
      userInfo?.userInfo?.email ?? "",
      action
    );
    if (cancel.error) {
      toaster({
        type: "error",
        description: cancel.error,
      });
      setIsLoading(false);
      return;
    }
    setTimeout(async () => {
      setIsLoading(false);
      await fetchUserStore(userEmail ?? "");
      setRefresh(!refresh);
      toaster({
        type: "success",
        description:
          action === "cancel"
            ? "Your subscription has been canceled"
            : "Your subscription has been restarted",
      });
    }, 7000);
  };

  const handleGoToPricingPage = () => {
    router.push("/pricing");
  };

  const handlAddItem = async (subItem: string) => {
    const addItem = await reportUsage(subItem, 100000);
    if (addItem) {
      toaster({
        type: "success",
        description: "Item added",
      });
      fetchUserStore(userStore.email ?? "");
      setRefresh(true);
    }
  };

  const changePayMethod = async () => {
    setButtonLoading(true);
    const changePayMeth = await changePaymentMethod(
      userInfo?.userInfo?.customerId ?? ""
    );
    if (!changePayMeth) return;
    setButtonLoading(false);
    return router.push(changePayMeth);
  };

  return (
    <div className="rounded-default relative flex flex-col w-full gap-2 items-start p-5 ">
      <SimpleLoader
        className={cn(
          { hidden: !isLoading },
          "!absolute top-[40%] z-50 left-[48%]"
        )}
      />
      {userInfo?.planName !== "No plan" ? (
        <>
          <div
            className={cn(
              { blur: isLoading },
              "flex flex-row w-full justify-between items-start"
            )}>
            <div className="w-1/2 flex flex-col  h-full text-left  pr-5">
              <div className="flex flex-col border rounded-default p-5">
                <h2 className="text-base mb-2">Your plan</h2>
                <h3 className="text-2xl flex flex-row  items-start justify-between w-full">
                  <span className="flex flex-col">
                    <span>{userInfo?.planName}</span>
                    <span className="text-xs font-normal">
                      {/* {userInfo?.subItem} */}
                      {userInfo?.planTrialRemaining
                        ? userInfo?.planTrialRemaining +
                          " trial days remaining, then..."
                        : null}
                    </span>
                  </span>
                  <span className="flex flex-col">
                    {userInfo?.planItems?.plan.usage_type !== "metered" && (
                      <>
                        <span>
                          {currencies[userInfo?.currency]?.sigle}
                          {userInfo?.planPriceWithDiscount &&
                          userInfo?.planItems?.quantity &&
                          userInfo?.planItems?.quantity > 1
                            ? userInfo?.planItems?.quantity *
                              userInfo?.planPriceWithDiscount
                            : userInfo?.planPriceWithDiscount}
                        </span>
                        <span className="text-sm">
                          /
                          {userInfo?.planItems?.price?.recurring?.interval ??
                            ""}
                          {userInfo?.planItems?.quantity &&
                            userInfo?.planItems?.quantity > 1 &&
                            "/" + userInfo?.planItems?.quantity + " users"}
                        </span>
                      </>
                    )}
                    {userInfo?.planItems?.plan.usage_type === "metered" && (
                      <>
                        <span>
                          {currencies[userInfo?.currency]?.sigle}
                          {parseFloat(
                            userInfo?.planItems?.plan.amount_decimal
                          ) / 100}
                        </span>
                        <span className="text-sm">
                          /per{" "}
                          {userInfo?.planItems?.price?.transform_quantity
                            ? userInfo.planPlan?.meteredUnit
                            : ""}{" "}
                          {toLower(saasSettings.creditName ?? "token")}
                        </span>
                        <span className="text-sm font-normal">
                          billed each{" "}
                          {userInfo?.planItems?.price?.recurring?.interval ??
                            ""}
                        </span>
                        {userInfo?.planItems?.plan.usage_type === "metered" && (
                          <span className="text-sm font-normal">
                            (according to use)
                          </span>
                        )}
                      </>
                    )}
                    {userInfo?.planItems?.quantity &&
                      userInfo?.planItems?.quantity > 1 && (
                        <span className="text-sm font-normal">
                          {currencies[userInfo?.currency]?.sigle}
                          {userInfo?.planItems?.quantity &&
                            userInfo?.planItems?.quantity > 1 &&
                            userInfo?.planPriceWithDiscount + " per user"}
                        </span>
                      )}
                  </span>
                </h3>
              </div>
              <ul className="mt-3">
                {userInfo?.planDiscount?.coupon?.percent_off ||
                  (userInfo?.planDiscount?.coupon?.amount_off && (
                    <li className="mt-2 text-theming-text-900  grid grid-cols-12">
                      <span className="col-span-1">
                        <Check className="icon text-theming-text-500-second mt-1" />
                      </span>
                      <span className=" col-span-11">
                        You save{" "}
                        {userInfo?.planDiscount?.coupon?.percent_off
                          ? userInfo?.planDiscount?.coupon?.percent_off + "%"
                          : (userInfo?.planDiscount?.coupon?.amount_off ?? 0) /
                              100 +
                            currencies[
                              userInfo?.planDiscount?.coupon?.currency ?? "usd"
                            ]?.sigle}{" "}
                        on this plan
                      </span>
                    </li>
                  ))}

                {userInfo?.planAllDatas?.trial_end && (
                  <li className="mt-2 text-theming-text-900 grid grid-cols-12">
                    <span className="col-span-1">
                      <Check className="icon text-theming-text-500-second mt-1" />
                    </span>
                    <span className="flex flex-col col-span-11">
                      <span>Your trial ends at :</span>
                      <span className="dark:text-theming-text-500-second !text-sm text-theming-text-500-second">
                        {formatDateRelativeToNow(
                          userInfo?.planAllDatas?.trial_end,
                          "US"
                        )}
                      </span>
                    </span>
                  </li>
                )}
                {userInfo?.planAllDatas?.cancel_at_period_end ? (
                  <li className="mt-2 text-theming-text-900 grid grid-cols-12">
                    <span className="col-span-1">
                      <Check className="icon text-theming-text-500-second mt-1" />
                    </span>
                    <span className="flex flex-col col-span-11">
                      <span>Your subscription will be canceled at :</span>
                      <span className="dark:text-theming-text-500-second !text-sm text-theming-text-500-second">
                        {formatDateRelativeToNow(
                          userInfo?.planAllDatas?.current_period_end,
                          "US"
                        )}
                      </span>
                    </span>
                  </li>
                ) : (
                  <li className="mt-2 text-theming-text-900 grid grid-cols-12">
                    <span className="col-span-1">
                      <Check className="icon text-theming-text-500-second mt-1" />
                    </span>
                    <span className="flex flex-col col-span-11">
                      <span>Next invoice at :</span>
                      <span className="dark:text-theming-text-500-second !text-sm text-theming-text-500-second">
                        {formatDateRelativeToNow(
                          userInfo?.planAllDatas?.current_period_end ?? 0,
                          "US"
                        )}
                      </span>
                    </span>
                  </li>
                )}
              </ul>
            </div>
            <div className="w-1/2 flex flex-col border-l border-dashed text-left  pl-5">
              <h2 className="text-base mb-2">Features</h2>
              <ul>
                {userInfo?.planPlan && (
                  <PriceCardFeatures plan={userInfo?.planPlan} />
                )}
              </ul>
            </div>
          </div>
          <Goodline />
          <div className="col-span-full  gap-2  flex flex-row w-full">
            <Button className="w-full">Upgrade or downgrade plan</Button>
            <ButtonWithLoader
              onClick={changePayMethod}
              type="button"
              disabled={buttonLoading}
              loading={buttonLoading}
              variant="link">
              <CreditCard className="icon mt-1" /> Change payment method
            </ButtonWithLoader>
            {!userInfo?.planAllDatas?.cancel_at_period_end ? (
              <>
                <Button
                  data-tooltip-id="cancel-subscription"
                  disabled={isLoading}
                  className="w-full"
                  variant={"link"}
                  onClick={() =>
                    handleCancelOrRestartSubscription(
                      "cancel",
                      userInfo?.plan?.id ?? "",
                      userStore.email ?? ""
                    )
                  }>
                  <XCircle className="icon text-red-500" /> Cancel subscription
                </Button>
              </>
            ) : (
              <Button
                data-tooltip-id="restart-subscription"
                disabled={isLoading}
                className="w-full"
                variant={"link"}
                onClick={() =>
                  handleCancelOrRestartSubscription(
                    "restart",
                    userInfo?.plan?.id ?? "",
                    userStore.email ?? ""
                  )
                }>
                <RotateCcw className="icon text-green-500" /> Restart
                subscription
              </Button>
            )}
            <Tooltip
              id="cancel-subscription"
              place="top"
              className="tooltip">
              <span>Your subscription will be canceled at the end of the current period at {formatDateRelativeToNow(userInfo?.planAllDatas?.current_period_end ?? 0, "US")}. You can continue to use the service until then and you won&apos;t be charged again.</span>
            </Tooltip>
            <Tooltip
              id="restart-subscription"
              place="top"
              className="tooltip">
              <span>
                Your subscription will be restarted and you will not be charged more. 
              </span>
              </Tooltip>
            {/* <Button onClick={() => handlAddItem(userInfo?.subItem)}>
              Add item
            </Button> */}
          </div>
        </>
      ) : (
        <div className="flex flex-col w-full items-start justify-center">
          <h2 className="text-2xl mb-2">No plan</h2>
          <Button onClick={handleGoToPricingPage}>Subscribe to a plan</Button>
        </div>
      )}
    </div>
  );
};
