"use server";
import { stripeCustomerIdManager } from "@/src/helpers/functions/stripeCustomerIdManager";
import { verifySecretRequest } from "@/src/helpers/functions/verifySecretRequest";
import { getTranslations } from "next-intl/server";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");
type RefillSession = {
  secret: string;
  numberOfCredits: number;
  price: number;
  creditName: string;
};
export const createRefillSession = async ({
  secret,
  price,
  creditName,
  numberOfCredits = 5,
}: RefillSession) => {
  // Check if the secret is valid
  if (!verifySecretRequest(secret)) {
    return null;
  }
  const t = await getTranslations();
  const customerId = await stripeCustomerIdManager({});
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: "Refill",
            description: t("API.Refill.name", {
              varIntlRefill: numberOfCredits,
              varIntlCreditName: creditName.toLowerCase(),
            }),
            metadata: {
              name: t("API.Refill.name", {
                varIntlRefill: numberOfCredits,
                varIntlCreditName: creditName.toLowerCase(),
              }),
              refill: numberOfCredits,
            },
          },
          unit_amount: price * 100,
        },
        quantity: 1,
      },
    ],
    customer: customerId,
    metadata: {
      name: t("API.Refill.name", {
        varIntlRefill: numberOfCredits,
        varIntlCreditName: creditName.toLowerCase(),
      }),
      refill: numberOfCredits,
    },
    mode: "payment",
    success_url: `${process.env.NEXT_URI}/refill/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_URI}/refill`,
  });
  return session.url;
};

export const portailclient = async () => {
  const customerId = await stripeCustomerIdManager({});

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_URI}/dashboard`,
  });
  return session.url;
};
