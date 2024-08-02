"use client";

import { PriceCardFeatures } from "@/app/[locale]/pricing/components/PriceCardFeatures";
import { portailclient } from "@/app/[locale]/refill/queries/refill.action";
import { Goodline } from "@/src/components/ui/@aceternity/good-line";
import { ButtonWithLoader } from "@/src/components/ui/@fairysaas/button-with-loader";
import {
  SimpleLoader,
  SkeletonLoader,
} from "@/src/components/ui/@fairysaas/loader";
import { PopoverConfirm } from "@/src/components/ui/@fairysaas/popover-confirm";
import { toaster } from "@/src/components/ui/@fairysaas/toaster/ToastConfig";
import { Button } from "@/src/components/ui/button";
import { ReturnUserDependencyProps } from "@/src/helpers/dependencies/user";
import { useRouter } from "@/src/lib/intl/navigation";
import { cn } from "@/src/lib/utils";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { useUserInfoStore } from "@/src/stores/userInfoStore";
import { toLower } from "lodash";
import {
  Check,
  CreditCard,
  ReceiptText,
  Rocket,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import { convertUnixToDate } from "../../../../../../src/helpers/functions/convertDate";
import {
  cancelSubscription,
  changePaymentMethod,
} from "../../../queries/queries";
import { UpOrDowngradePlan } from "./components/UpOrDowngradePlan";

type ProfileBillingProps = {};

export const ProfileBilling = ({}: ProfileBillingProps) => {
  const format = useFormatter();
  const t = useTranslations("Dashboard.Components.Profile.Billing");
  const router = useRouter();
  const { saasSettings } = useSaasSettingsStore();
  const [userProfile, setUserProfile] = useState<ReturnUserDependencyProps>();
  const { userInfoStore, fetchUserInfoStore } = useUserInfoStore();
  const [isLoading, setIsLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (!userInfoStore?.info?.email) return;
    // fetchUserInfoStore(userInfoStore?.info?.email ?? "");
    setUserProfile(userInfoStore);
  }, [userInfoStore, refresh]);
  if (!userProfile || userProfile?.isLoading) {
    return <SkeletonLoader type="card" />;
  }
  // Customer actions
  const handleCustomerPortail = async () => {
    const refill = await portailclient();
    if (!refill) return;
    return router.push(refill as any);
  };
  // Dans votre composant ProfileBilling.tsx
  const handleCancelOrRestartSubscription = async (
    action: "cancel" | "restart",
    subscriptionId: string,
    userEmail: string
  ) => {
    setIsLoading(true);
    const cancel = await cancelSubscription(
      subscriptionId,
      userProfile?.info.email ?? "",
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
      await fetchUserInfoStore(userEmail ?? "");
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

  const changePayMethod = async () => {
    setButtonLoading(true);
    const changePayMeth = await changePaymentMethod(
      userProfile?.info.customerId ?? ""
    );
    if (!changePayMeth) return;
    setButtonLoading(false);
    return router.push(changePayMeth as any);
  };

  if (!userProfile || userProfile?.isLoading) {
    return <SkeletonLoader type="card" />;
  }

  const recurringTranslation = (rec: string) => {
    if (rec === "month") {
      return t("monthly");
    } else if (rec === "year") {
      return t("yearly");
    } else if (rec === "week") {
      return t("weekly");
    } else if (rec === "day") {
      return t("daily");
    }
    return;
  };
  const hasCoupon =
    userProfile.activeSubscription &&
    userProfile.activeSubscription.coupon &&
    (userProfile.activeSubscription.coupon.percent_off ||
      userProfile.activeSubscription.coupon.amount_off);

  return (
    <div className="rounded-default relative flex flex-col w-full gap-2 items-start p-5 ">
      <SimpleLoader
        className={cn(
          { hidden: !isLoading },
          "!absolute top-[40%] z-50 left-[48%]"
        )}
      />
      {userProfile?.activeSubscription ? (
        <>
          <div
            className={cn(
              { blur: isLoading },
              "flex md:flex-row flex-col w-full justify-between items-start"
            )}>
            <div className="md:w-1/2 w-full flex flex-col  h-full text-left  pr-5">
              <div className="flex flex-col border rounded-default p-5">
                <h2 className="text-base mb-2">{t("your-plan")}</h2>
                <h3 className="text-2xl flex flex-row  items-start justify-between w-full">
                  <span className="flex flex-col">
                    <span>
                      {userProfile?.activeSubscription?.planObject?.name}
                    </span>
                    <span className="text-xs font-normal">
                      {/* {userInfo?.subItem} */}
                      {userProfile?.activeSubscription.trialDaysRemaining &&
                        `${t("trial-days-remaining", {
                          varIntlDays:
                            userProfile?.activeSubscription.trialDaysRemaining,
                        })}`}
                    </span>
                  </span>
                  <span className="flex flex-col">
                    {userProfile.activeSubscription.usageType !== "metered" ? (
                      <>
                        <span>
                          {format.number(
                            userProfile.activeSubscription
                              .priceWithDiscountAndQuantity ?? 0 / 100,
                            {
                              style: "currency",
                              currency:
                                userProfile.activeSubscription.currency ??
                                undefined,
                            }
                          )}
                        </span>
                        <span className="text-sm">
                          /
                          {userProfile.activeSubscription.subscription?.allDatas
                            .items.data[0].price.recurring?.interval_count !==
                            1 &&
                            userProfile.activeSubscription.subscription
                              ?.allDatas.items.data[0].price.recurring
                              ?.interval_count + " "}
                          {recurringTranslation(
                            userProfile.activeSubscription.recurring ?? ""
                          )}
                          {userProfile.activeSubscription.quantity > 1 &&
                            "/" +
                              userProfile.activeSubscription.quantity +
                              t("users")}
                        </span>
                      </>
                    ) : (
                      <>
                        <span>
                          {format.number(
                            userProfile.activeSubscription.priceWithDiscount ??
                              0 / 100,
                            {
                              style: "currency",
                              currency:
                                userProfile.activeSubscription.currency ??
                                undefined,
                            }
                          )}
                        </span>
                        <span className="text-sm">
                          /{t("trial-days-remaining")}{" "}
                          {userProfile.activeSubscription.meteredUnit}{" "}
                          {toLower(saasSettings.creditName ?? "credits")}
                        </span>
                        <span className="text-sm font-normal">
                          {t("billed-each")}{" "}
                          {recurringTranslation(
                            userProfile.activeSubscription.recurring ?? ""
                          ) ?? ""}
                        </span>
                        <span className="text-sm font-normal">
                          {t("according-to-use")}{" "}
                        </span>
                      </>
                    )}
                    {userProfile.activeSubscription.quantity > 1 && (
                      <span className="text-sm font-normal">
                        {format.number(
                          userProfile.activeSubscription.priceWithDiscount ??
                            0 / 100,
                          {
                            style: "currency",
                            currency:
                              userProfile.activeSubscription.currency ??
                              undefined,
                          }
                        ) + ` ${t("per-user")}`}
                      </span>
                    )}
                  </span>
                </h3>
              </div>
              <ul className="mt-3">
                {userProfile.activeSubscription && hasCoupon && (
                  <li className="mt-2 text-theming-text-900  grid grid-cols-12">
                    <span className="col-span-1">
                      <Check className="icon text-theming-text-500-second mt-1" />
                    </span>
                    <span className=" col-span-11">
                      {t("you-save", {
                        varIntlSave: userProfile.activeSubscription.coupon
                          ?.percent_off
                          ? userProfile.activeSubscription.coupon?.percent_off +
                            "%"
                          : format.number(
                              (userProfile.activeSubscription.coupon
                                ?.amount_off ?? 0) / 100,
                              {
                                style: "currency",
                                currency:
                                  userProfile.activeSubscription.coupon
                                    ?.currency ?? undefined,
                              }
                            ),
                      })}{" "}
                    </span>
                  </li>
                )}

                {userProfile.activeSubscription.isTrial && (
                  <li className="mt-2 text-theming-text-900 grid grid-cols-12">
                    <span className="col-span-1">
                      <Check className="icon text-theming-text-500-second mt-1" />
                    </span>
                    <span className="flex flex-col col-span-11">
                      <span> {t("your-trial-ends-at")}</span>
                      <span className="dark:text-theming-text-500-second !text-sm text-theming-text-500-second">
                        {format.dateTime(
                          convertUnixToDate(
                            userProfile.activeSubscription.trialDateEnd ?? 0
                          )
                        )}
                      </span>
                    </span>
                  </li>
                )}
                {userProfile.activeSubscription.isCanceling ? (
                  <li className="mt-2 text-theming-text-900 grid grid-cols-12">
                    <span className="col-span-1">
                      <Check className="icon text-theming-text-500-second mt-1" />
                    </span>
                    <span className="flex flex-col col-span-11">
                      <span>
                        {t("subscription-will-be-canceled-at")}{" "}
                        {format.dateTime(
                          convertUnixToDate(
                            userProfile.activeSubscription
                              .canceledActiveUntil ?? 0
                          )
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
                      <span>
                        {t("next-invoice-at")}{" "}
                        {format.dateTime(
                          convertUnixToDate(
                            userProfile.activeSubscription
                              .canceledActiveUntil ?? 0
                          )
                        )}
                      </span>
                    </span>
                  </li>
                )}
              </ul>
            </div>
            <Goodline className="md:hidden" />
            <div className={"md:w-1/2 w-full flex flex-col  text-left  pl-5"}>
              <h2 className="text-base mb-2">{t("features-title")}</h2>
              <ul>
                {userProfile.activeSubscription.planObject && (
                  <PriceCardFeatures
                    plan={userProfile.activeSubscription.planObject}
                  />
                )}
              </ul>
            </div>
          </div>
          <Goodline />
          <div className="col-span-full  gap-2 flex md:flex-row flex-col justify-between w-full">
            <UpOrDowngradePlan userProfile={userProfile} />
            <div className="md:w-1/4 w-full">&nbsp;</div>
            <div className="md:w-2/3 w-full flex flex-col justify-end items-end">
              <ButtonWithLoader
                onClick={changePayMethod}
                type="button"
                disabled={buttonLoading}
                loading={buttonLoading}
                className="!px-0 !pr-0"
                variant="link">
                <CreditCard className="icon mt-1" />{" "}
                {t("buttons.update-payment")}
              </ButtonWithLoader>
              <ButtonWithLoader
                onClick={handleCustomerPortail}
                type="button"
                disabled={buttonLoading}
                loading={buttonLoading}
                className="!px-0 !pr-0"
                variant="link">
                <ReceiptText className="icon mt-1" />{" "}
                {t("buttons.update-from-portail")}
              </ButtonWithLoader>
              {!userProfile.activeSubscription.isCanceling ? (
                <>
                  <PopoverConfirm
                    handleFunction={() => {
                      handleCancelOrRestartSubscription(
                        "cancel",
                        userProfile.activeSubscription.subscription?.id ?? "",
                        userInfoStore.info.email ?? ""
                      );
                    }}
                    className="!px-0 !pr-0"
                    icon={<XCircle className="icon text-red-500 mt-1" />}
                    display={t("buttons.cancel-subscription") + "..."}
                    what={`${t("buttons.cancel-subscription-popover")} ${t(
                      "tooltips.cancel-subscription",
                      {
                        varIntlDate: format.dateTime(
                          convertUnixToDate(
                            userProfile.activeSubscription
                              .canceledActiveUntil ?? 0
                          )
                        ),
                      }
                    )}`}>
                    {" "}
                    <XCircle className="icon text-red-500 mt-1" />{" "}
                  </PopoverConfirm>
                </>
              ) : (
                <Button
                  data-tooltip-id="restart-subscription"
                  disabled={isLoading}
                  className="!px-0 !pr-0"
                  variant={"link"}
                  onClick={() =>
                    handleCancelOrRestartSubscription(
                      "restart",
                      userProfile.activeSubscription.subscription?.id ?? "",
                      userInfoStore.info.email ?? ""
                    )
                  }>
                  <RotateCcw className="icon text-green-500" />{" "}
                  {t("buttons.restart-subscription")}
                </Button>
              )}
            </div>
            <Tooltip id="cancel-subscription" place="top" className="tooltip">
              <span>
                {t("tooltips.cancel-subscription", {
                  varIntlDate: format.dateTime(
                    convertUnixToDate(
                      userProfile.activeSubscription.canceledActiveUntil ?? 0
                    )
                  ),
                })}
              </span>
            </Tooltip>
            <Tooltip id="restart-subscription" place="top" className="tooltip">
              <span>{t("tooltips.restart-subscription")}</span>
            </Tooltip>
            {/* NOTE : METERED USAGE BUTTON
            <Button onClick={() => handlAddItem(userInfo?.subItem)}>
              Add item
            </Button> */}
          </div>
        </>
      ) : (
        <div className="flex flex-col w-full items-center mt-10 justify-center">
          <h2 className="text-2xl mb-5"> {t("no-plan-subscribed-yet")}</h2>
          <Button onClick={handleGoToPricingPage}><Rocket className="icon" /> {t("subscribe-now")}</Button>
        </div>
      )}
    </div>
  );
};
