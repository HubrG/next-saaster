"use server";
import { stripeCustomerIdManager } from "@/src/helpers/functions/stripeCustomerIdManager";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

export const createRefillSession = async () => {
  const customerId = await stripeCustomerIdManager({});
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: "Refill",
            metadata: {
              test: "test",
            },
          },
          unit_amount: 5000,
        },
        quantity: 1,
      },
    ],
    customer: customerId,
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
    return_url: "https://example.com/account",
  });
  return session.url;
};
