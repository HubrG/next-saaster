"use client";
import { SkeletonLoader } from "@/src/components/ui/@fairysaas/loader";
import { cn } from "@/src/lib/utils";
import { usePublicSaasPricingStore } from "@/src/stores/publicSaasPricingStore";
import { iPlan } from "@/src/types/db/iPlans";
import { iStripePrice } from "@/src/types/db/iStripePrices";
import { motion } from "framer-motion";
import { lowerCase, toLower } from "lodash";
import { ChevronDown, ChevronUp, Gift } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { Suspense, useState } from "react";
import { PriceCardBadge } from "../PriceCardBadge";

type CustomPriceCardHeaderProps = {
  plan: iPlan;
  priceId: string;
  trialDays?: number;
  userInfo?: any;
  stripePrice?: iStripePrice;
  customPrice?: number;
  customPriceStroke?: number;
  discountId?: string | undefined;
  priceWithDiscount?: number;
  saasSettings: any;
  creditByMonth?: number;
  slash?: string;
  smallPriceDescription?: string;
  enableQuantity?: boolean;
};

const recurringTranslation = (rec: string, t: any) => {
  switch (rec) {
    case "month":
      return t("monthly");
    case "year":
      return t("yearly");
    case "week":
      return t("weekly");
    case "day":
      return t("daily");
    default:
      return;
  }
};

export const CustomPriceCardHeader = ({
  plan,
  priceId,
  customPrice,
  enableQuantity,
  customPriceStroke,
  trialDays,
  userInfo,
  stripePrice,
  smallPriceDescription,
  slash,
  discountId,
  priceWithDiscount,
  saasSettings,
  creditByMonth,
}: CustomPriceCardHeaderProps) => {
  const t = useTranslations("Pricing.Components.CardHeader");
  const format = useFormatter();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { seatQuantity } = usePublicSaasPricingStore();

  return (
    <>
      <PriceCardBadge
        text={
          plan.isPopular
            ? t("popular")
            : plan.isRecommended
            ? t("recommended")
            : null
        }
      />
      <div className="min-h-24">
        <Suspense fallback={<SkeletonLoader type="simple-line" />}>
          <h1 className="text-xl">{plan.name}</h1>
        </Suspense>
        <div style={{ overflow: "hidden" }}>
          <motion.p
            data-tooltip-id={"tt" + priceId}
            className={cn("description min-h-24")}
            initial={{ height: "0", opacity: 1 }}
            animate={{
              height: showFullDescription ? "auto" : "48px",
              opacity: showFullDescription ? 1 : 1,
            }}
            transition={{ duration: showFullDescription ? 0.3 : 0.5 }}>
            {plan.description}
          </motion.p>
        </div>
      </div>
      {plan.description && plan.description.length > 100 && (
        <div
          onClick={() => setShowFullDescription(!showFullDescription)}
          className="!z-[99999]  w-full dark:border-theming-text-300 text-xs border-theming-text-200 border-t-[2px] pt-0 pr-0  text-right cursor-pointer underline backdrop-blur-3xl">
          {showFullDescription ? (
            <ChevronUp className=" -mt-4 dark:text-theming-text-300 text-theming-text-200 font-bold float-right -mr-1.5" />
          ) : (
            <ChevronDown className=" dark:text-theming-text-300  text-theming-text-200 -mt-2.5 float-right -mr-1.5" />
          )}
        </div>
      )}
      <h3 className={cn({ "!-mt-24  pt-0": plan.isTrial }, "h-1/2")}>
        <div className="grid">
          <div className="h-6">
            {trialDays && !userInfo?.activeSubscription ? (
              <span className="trial block pt-2">
                {trialDays} {t("trial")}
              </span>
            ) : (
              <span className="">&nbsp;</span>
            )}
          </div>
          <div className="h-32 flex flex-col justify-start">
            {!plan.isCustom ? (
              <>
                <div className="price-container h-24 flex flex-col">
                  {discountId || customPriceStroke ? (
                    <span className="price-stroke block h-10">
                      {format.number(
                        (stripePrice?.unit_amount
                          ? stripePrice?.unit_amount
                          : (customPriceStroke ?? 0) * 100 ?? 0) / 100,
                        {
                          style: "currency",
                          currency: saasSettings.currency ?? "usd",
                        }
                      )}
                    </span>
                  ) : (
                    <span className="price-stroke block h-10"></span>
                  )}
                  <div>
                    <span className="text-3xl">
                      {priceWithDiscount
                        ? format.number(priceWithDiscount ?? 0, {
                            style: "currency",
                            currency: saasSettings.currency ?? "usd",
                          })
                        : format.number(customPrice ?? 0, {
                            style: "currency",
                            currency: saasSettings.currency ?? "usd",
                          })}
                    </span>
                    {stripePrice?.recurring_interval_count && (
                      <span className="text-base text-theming-text-500/90">
                        /{" "}
                        {slash ? (
                          <>{slash} </>
                        ) : (
                          <>
                            {stripePrice.recurring_usage_type === "metered" &&
                            stripePrice.transform_quantity_divide_by
                              ? stripePrice.transform_quantity_divide_by +
                                " " +
                                lowerCase(saasSettings.creditName) +
                                (stripePrice.transform_quantity_divide_by > 1
                                  ? "s"
                                  : "")
                              : stripePrice.recurring_usage_type ===
                                  "metered" &&
                                !stripePrice.transform_quantity_divide_by
                              ? toLower(saasSettings.creditName)
                              : stripePrice?.recurring_interval_count > 1 &&
                                stripePrice?.recurring_interval_count}{" "}
                            {stripePrice.recurring_usage_type !== "metered" &&
                              recurringTranslation(
                                stripePrice?.recurring_interval ?? "",
                                t
                              )}
                          </>
                        )}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  {!smallPriceDescription &&
                  stripePrice?.recurring_usage_type === "metered" ? (
                    <span className="block text-xs font-light">
                      {t("billed")}{" "}
                      {stripePrice?.recurring_interval_count &&
                        stripePrice.recurring_interval_count > 1 &&
                        stripePrice?.recurring_interval_count}{" "}
                      {recurringTranslation(
                        stripePrice?.recurring_interval ?? "",
                        t
                      )}{" "}
                      {t("depending-on-usage")}
                    </span>
                  ) : (
                    <span className="block text-xs font-light -mt-9">
                      {smallPriceDescription}
                    </span>
                  )}
                </div>
                <div className="h-8">
                  {creditByMonth ? (
                    <div className=" text-xs  flex flex-row items-start border-t mt-5 pt-5 credit-info h-8">
                      <Gift className="icon " />
                      {t("earned", {
                        varIntlCreditName: toLower(
                          saasSettings.creditName +
                            (saasSettings.creditName &&
                              creditByMonth > 1 &&
                              "s")
                        ),
                        varIntlEarned: creditByMonth,
                        varIntlEach:
                          stripePrice?.recurring_interval_count &&
                          stripePrice.recurring_interval_count === 1
                            ? recurringTranslation(
                                stripePrice?.recurring_interval ?? "",
                                t
                              )
                            : stripePrice?.recurring_interval_count +
                              " " +
                              recurringTranslation(
                                stripePrice?.recurring_interval ?? "",
                                t
                              ),
                      })}
                    </div>
                  ) : (
                    <div className="mt-3 credit-info-placeholder h-8"></div>
                  )}
           
                </div>
                {plan.creditAllouedByMonth && plan.creditAllouedByMonth > 0 ? (
                  <span className="block text-xs">
                    {plan.creditAllouedByMonth} / {t("by-month")}
                  </span>
                ) : (
                  <> </>
                )}
              </>
            ) : (
              <p>{t("contact-us")}</p>
            )}
          </div>
        </div>
      </h3>
    </>
  );
};
