"use server";

import { handleError } from "@/src/lib/error-handling/handleError";
import {
  HandleResponseProps,
  handleRes,
} from "@/src/lib/error-handling/handleResponse";
import { prisma } from "@/src/lib/prisma";
import { ActionError, authAction } from "@/src/lib/safe-actions";
import { iUserUsage } from "@/src/types/db/iUserUsage";
import { addUserUsageSchema } from "@/src/types/schemas/dbSchema";
import { addMonths, differenceInMonths } from "date-fns";
import { getTranslations } from "next-intl/server";
import Stripe from "stripe";
import { reportUsage } from "../functions/ReportMeteredUsage";
import { verifySecretRequest } from "../functions/verifySecretRequest";



/**
 * Add a user usage
 * @param {string} userIdFirst - The user id
 * @param {string} planToFeatureId - The feature id used by the user (with his limitations/usage)
 * @param {number} quantityForFeature - Quantity for this feature (about limit by feature/month. Eg: 1000 emails sent by month max. Add usage for this feature)
 * @param {number} consumeCreditAllouedByMonth - Consume credit alloued by month
 * @param {number} consumeStripeMeteredCredit - Consume stripe metered credit for the billing
 * @param {number} outputTokenAI - Output token AI (for AI usage)
 * @param {number} inputTokenAI - Input token AI (for AI usage)
 * @param {string} AIProvider - AI provider (eg: gpt-4o, claude-3-sonnet, etc.)
 * @param {string} secret - The secret key to authorize the request (chosenSecret())
 */
export const addUserUsage = authAction(
  addUserUsageSchema,
  async (
    {
      userIdFirst,
      secret,
      featureAlias,
      quantityForFeature,
      consumeCredit,
      consumeStripeMeteredCredit,
      outputTokenAI,
      inputTokenAI,
      AIProvider,
    },
    { userSession }
  ): Promise<HandleResponseProps<iUserUsage>> => {
    const t = await getTranslations();
    // 🔐 Security
    if (!secret || (secret && !verifySecretRequest(secret)))
      throw new ActionError("Unauthorized");
    let userId;
    if (userIdFirst) {
      userId = userIdFirst;
    } else if (userSession) {
      userId = userSession.user.userId;
    } else {
      throw new ActionError(t("Helpers.DB.UserUsage.UserSessionNotFound"));
    }
    // 🔓 Unlocked
    try {
      // NOTE: 1# - We verify if the user exists
      if (!include)
        throw new ActionError(t("Helpers.DB.UserUsage.UserIncludeNotFound"));
      const user = await prisma.user.findFirst({
        where: {
          id: userId,
        },
        include: UserDbInclude,
      });
      if (!user) throw new ActionError(t("Helpers.DB.UserUsage.UserNotFound"));
      // Get saasSettings
      const saasSettings = await prisma.saasSettings.findFirst();
      if (!saasSettings)
        throw new ActionError(t("Helpers.DB.UserUsage.SaasSettingsNotFound"));
      let planToFeatureId;
      let featureInPlan;
      let creditAllouedByMonth;

      // NOTE: 2# If featureAlias is provided, we retrieve the feature ID from the feature alias...
      if (featureAlias) {
        const feature = await prisma.feature.findFirst({
          where: {
            alias: featureAlias,
          },
        });
        if (!feature)
          throw new ActionError(t("Helpers.DB.UserUsage.FeatureNotFound"));
        const planToFeature = await prisma.planToFeature.findFirst({
          where: {
            featureId: feature.id,
          },
        });
        if (!planToFeature)
          throw new ActionError(
            t("Helpers.DB.UserUsage.FeatureNotLinkedToPlan")
          );

        planToFeatureId = planToFeature.id;
        //  ...and we want to know if this feature is linked to a plan subscribed by the user
        const userSubscription = await prisma.userSubscription.findFirst({
          where: {
            userId,
            isActive: true,
          },
          include: includeUserSubscription,
        });
        // ❗ If user has an active subscription, we verify if the feature is linked to the user's plan
        if (userSubscription) {
          const plan =
            userSubscription?.subscription?.price?.productRelation
              ?.PlanRelation;
          featureInPlan = plan?.Features.find(
            (f) => f.featureId === feature.id
          );

          if (!featureInPlan)
            throw new ActionError(
              t("Helpers.DB.UserUsage.FeatureNotLinkedToPlan")
            );
          if (!featureInPlan.active)
            throw new ActionError(t("Helpers.DB.UserUsage.FeatureNotActive"));
          // ❕ Usage limit by month for this feature.
          // We verify if the user has not reached the limit of this feature during the month (start date of the subscription + X month duration since the subscription started)
          const subscriptionStartDate = userSubscription.subscription.startDate;
          if (!subscriptionStartDate) {
            throw new ActionError(
              t("Helpers.DB.UserUsage.SubscriptionStartDateNotFound")
            );
          }
          const currentDate = new Date();
          const monthsSinceSubscriptionStart = differenceInMonths(
            currentDate,
            new Date(subscriptionStartDate)
          );

          const userUsageForFeatureThisMonth = await prisma.userUsage.aggregate(
            {
              where: {
                userId,
                planToFeatureId: featureInPlan.id,
                createdAt: {
                  gte: addMonths(
                    subscriptionStartDate,
                    monthsSinceSubscriptionStart
                  ),
                  lt: addMonths(
                    subscriptionStartDate,
                    monthsSinceSubscriptionStart + 1
                  ),
                },
              },
              _sum: {
                quantityForFeature: true,
              },
            }
          );
          console.log(userUsageForFeatureThisMonth._sum.quantityForFeature);
          if (
            (userUsageForFeatureThisMonth._sum.quantityForFeature ?? 0) >=
            (featureInPlan.creditAllouedByMonth ?? 0)
          ) {
            // ❕ Credit remaining spent by one usage of this feature (if no limit usage by month)
            // We verify if the user has enough credit to use this feature
            if (featureInPlan.creditCost === 0) {
              console.log("Feature is free, no credit needed");
            } else if (
              (featureInPlan.creditCost ?? 0) > 0 &&
              (userSubscription.creditRemaining ?? 0) >=
                (featureInPlan.creditCost ?? 0)
            ) {
              creditAllouedByMonth = featureInPlan.creditCost;
            } else {
              if (quantityForFeature ?? 0 > 0) {
                throw new ActionError(
                  t("Helpers.DB.UserUsage.NotEnoughCreditToUseFeature", {
                    varIntlCreditAlloued: featureInPlan.creditAllouedByMonth,
                  })
                );
              } else {
                throw new ActionError(
                  t(
                    "Helpers.DB.UserUsage.NotEnoughCreditRemainingToUseFeature",
                    {
                      varIntlCreditMissing:
                        (featureInPlan.creditCost ?? 0) -
                        (userSubscription.creditRemaining ?? 0),
                      varIntlCreditRemaining: userSubscription.creditRemaining,
                      varIntlCreditName: saasSettings.creditName,
                    }
                  )
                );
              }
            }
          }
        } else {
          // ❗ If user has no active subscription, we verify if he has buy one-time payment for this feature
          const oneTimePayment = await prisma.oneTimePayment.findMany({
            where: {
              userId,
            },
            include: {
              price: {
                include: {
                  productRelation: {
                    include: {
                      PlanRelation: {
                        include: {
                          Features: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          });

          if (oneTimePayment.length > 0) {
            const oneTimePaymentForFeature = oneTimePayment.find((payment) =>
              payment?.price?.productRelation?.PlanRelation?.Features.find(
                (feat) => feat.featureId === planToFeature.featureId
              )
            );

            if (oneTimePaymentForFeature) {
              // We find the planToFeature linked to the one-time payment
              const otPlanToFeature = user.oneTimePayments
                .find((p) =>
                  p?.price?.productRelation?.PlanRelation?.Features.find(
                    (f) => f.featureId === planToFeature.featureId
                  )
                )
                ?.price?.productRelation?.PlanRelation?.Features.find(
                  (f) => f.featureId === planToFeature.featureId
                );
              if (otPlanToFeature) {
                featureInPlan = otPlanToFeature;
                // ❕ Credit remaining spent by one usage of this feature
                // We verify if the user has enough credit to use this feature
                if (otPlanToFeature?.creditCost === 0) {
                  creditAllouedByMonth = 0;
                } else if (
                  (otPlanToFeature?.creditCost ?? 0) > 0 &&
                  (user.creditRemaining ?? 0) >=
                    (otPlanToFeature?.creditCost ?? 0)
                ) {
                  creditAllouedByMonth = otPlanToFeature.creditCost;

                  // We sousctract the credit from the user's credit remaining
                  const userCreditRemaining =
                    (user.creditRemaining ?? 0) -
                    (otPlanToFeature.creditCost ?? 0);
                  await prisma.user.update({
                    where: {
                      id: userId,
                    },
                    data: {
                      creditRemaining: userCreditRemaining,
                    },
                  });
                } else {
                  throw new ActionError(
                    t(
                      "Helpers.DB.UserUsage.NotEnoughCreditRemainingToUseFeature",
                      {
                        varIntlCreditMissing:
                          (otPlanToFeature.creditCost ?? 0) -
                          (user.creditRemaining ?? 0),
                        varIntlCreditRemaining: user.creditRemaining,
                        varIntlCreditName: saasSettings.creditName,
                      }
                    )
                  );
                }
              }
            }
          }
        }
      }
      // NOTE: 3# - If no featureAlias is provided and if consumeCredit is provided, we verify if the user has enough credit to use this feature
      if (!featureAlias && consumeCredit) {
        // We verify if the user has a subscription isActive = true
        const userSubscription = await prisma.userSubscription.findFirst({
          where: {
            userId,
            isActive: true,
          },
        });
        if (!userSubscription) {
          // we verify if the user has enough credit to use this feature
          const userCredit = user.creditRemaining ?? 0;
          if (consumeCredit > userCredit) {
            throw new ActionError(
              t("Helpers.DB.UserUsage.NotEnoughCreditRemainingToUseFeature", {
                varIntlCreditAlloued: consumeCredit,
                varIntlCreditRemaining: userCredit,
                varIntlCreditName: saasSettings.creditName,
              })
            );
          } else {
            // We sousctract the credit from the user's credit remaining
            const userCreditRemaining = userCredit - consumeCredit;
            await prisma.user.update({
              where: {
                id: userId,
              },
              data: {
                creditRemaining: userCreditRemaining,
              },
            });
          }
        } else {
          // We verify if the user has enough credit to use the feature
          const userCredit = userSubscription.creditRemaining ?? 0;
          if (consumeCredit > userCredit) {
            throw new ActionError(
              t("Helpers.DB.UserUsage.NotEnoughCreditRemainingToUseFeature", {
                varIntlCreditAlloued: consumeCredit,
                varIntlCreditRemaining: userCredit,
                varIntlCreditName: saasSettings.creditName,
              })
            );
          } else {
            // We sousctract the credit from the user's credit remaining
            const userCreditRemaining = userCredit - consumeCredit;
            console.log(userCreditRemaining);
            await prisma.userSubscription.update({
              where: {
                userId_subscriptionId: {
                  userId,
                  subscriptionId: userSubscription.subscriptionId,
                },
              },
              data: {
                creditRemaining: userCreditRemaining,
              },
            });
          }
        }
      }
      // NOTE : #4 - If consumeStripeMeteredCredit is provided, we send the consumeStripeMeteredCredit to the Stripe billing
      if (consumeStripeMeteredCredit) {
        const userSubscription = await prisma.userSubscription.findFirst({
          where: {
            userId,
            isActive: true,
          },
          include: includeUserSubscription,
        });
        if (!userSubscription) {
          throw new ActionError(
            t("Helpers.DB.UserUsage.ActiveSubscriptionNotFoundForUser")
          );
        }
        const subscriptionItemId = userSubscription.subscription
          .allDatas as unknown as Stripe.Subscription;
        if (!subscriptionItemId.items.data[0].id) {
          throw new ActionError(
            t("Helpers.DB.UserUsage.StripeSubscriptionItemIdNotFound")
          );
        } else if (
          userSubscription.subscription.price?.recurring_usage_type !==
          "metered"
        ) {
          throw new ActionError(
            t("Helpers.DB.UserUsage.SubscriptionRecurringUsageTypeNotMetered")
          );
        }
        const stripeReport = await reportUsage({
          subscriptionItemId: subscriptionItemId.items.data[0].id,
          quantity: consumeStripeMeteredCredit,
        });
        if (handleError(stripeReport).error) {
          throw new ActionError(
            t("Helpers.DB.UserUsage.StripeUsageNotReported", {
              varIntlError: handleError(stripeReport).message,
            })
          );
        }
      }

      // NOTE: 5# - We add the user usage
      const userUsage = await prisma.userUsage.create({
        data: {
          userId,
          featureId: featureInPlan?.featureId ?? undefined,
          planToFeatureId: featureInPlan?.id ?? undefined,
          quantityForFeature,
          consumeCredit: creditAllouedByMonth ?? consumeCredit,
          consumeStripeMeteredCredit,
          outputTokenAI,
          inputTokenAI,
          AIProvider,
        },
        include,
      });
      if (!userUsage) throw new ActionError(t("Helpers.DB.UserUsage.Error"));

      return handleRes<iUserUsage>({
        success: {
          ...userUsage,
          planToFeature: userUsage.planToFeature ?? undefined,
        },
        statusCode: 200,
      });
    } catch (error) {
      console.error(error);
      return handleRes<iUserUsage>({
        error: error,
        statusCode: 500,
      });
    }
  }
);

const include = {
  user: true,
  feature: true,
  planToFeature: true,
};

const UserDbInclude = {
  accounts: true,
  organization: {
    include: {
      owner: true,
      members: true,
    },
  },
  subscriptions: {
    // where: { isActive: true },
    include: {
      subscription: {
        include: {
          SubscriptionPayments: true,
          price: {
            include: {
              productRelation: {
                include: {
                  PlanRelation: {
                    include: {
                      Features: {
                        include: { feature: true },
                      },
                      coupons: {
                        include: {
                          coupon: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  contacts: true,
  usage: {
    include: {
      feature: true,
      planToFeature: true,
    },
  },
  oneTimePayments: {
    include: {
      price: {
        include: {
          productRelation: {
            include: {
              PlanRelation: {
                include: {
                  Features: {
                    include: { feature: true },
                  },
                  coupons: {
                    include: {
                      coupon: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

const includeUserSubscription = {
  subscription: {
    include: {
      price: {
        include: {
          productRelation: {
            include: {
              PlanRelation: {
                include: {
                  Features: true,
                },
              },
            },
          },
        },
      },
    },
  },
};
