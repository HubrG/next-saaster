import { createOneTimePayment } from "@/src/helpers/db/oneTimePayments.action";
import {
  createOrUpdatePlanStripeToBdd,
  deletePlan,
  updatePlan,
} from "@/src/helpers/db/plans.action";
import {
  createOrUpdateCouponStripeToBdd,
  deleteStripeCoupon,
} from "@/src/helpers/db/stripeCoupons.action";
import {
  createOrUpdatePriceStripeToBdd,
  deleteStripePrice,
  getStripePrice,
} from "@/src/helpers/db/stripePrices.action";
import {
  createOrUpdateProductStripeToBdd,
  deleteProduct,
  getStripeProduct,
} from "@/src/helpers/db/stripeProducts.action";
import {
  createSubcriptionPayment
} from "@/src/helpers/db/subscriptionPayments.action";
import {
  createSubscription,
  updateSubscription,
} from "@/src/helpers/db/subscriptions.action";
import { createUserSubscription, updateUserSubscription } from "@/src/helpers/db/userSubscription.action";
import { getUserByCustomerId } from "@/src/helpers/db/users.action";
import { todoWhenPaymentSuceeded } from "@/src/helpers/functions/todoWhenPaymentSuceeded";
import { iStripeProduct } from "@/src/types/iStripeProducts";
import { SubscriptionStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2023-10-16",
  typescript: true,
});


export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET || "";
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature");
  console.log(signature);

  let event: Stripe.Event | null = null;

  try {
    event = stripe.webhooks.constructEvent(payload, signature || "", secret);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 }
      );
    }
  }
  switch (event.type) {
    // SECTION : Subscription
   
    case "checkout.session.completed":
      // NOTE : Fill this function with the code to be executed when the payment is successful
      todoWhenPaymentSuceeded();
      //
      return NextResponse.json({ status: 200 });
    case "customer.subscription.created":
      const subscription = event.data.object as Stripe.Subscription;
      const priceId = subscription.items.data[0].price.id;
      const customerId = subscription.customer as string;
      const user = await getUserByCustomerId({ customerId });
      if (!user.data) {
        return NextResponse.json({ error: user.error }, { status: 500 });
      }
      try {
        const createSub = await createSubscription({
          stripeSignature: secret ?? "",
          data: {
            id: subscription.id,
            allDatas: JSON.stringify(subscription),
            status: event.data.object.status as SubscriptionStatus,
            priceId: priceId ?? null,
            nextPaymentAttempt: null,
            stripeCustomerId: customerId,
            startDate: new Date().toISOString(),
            endDate: null,
          },
        });
        if (!createSub.data) {
          return NextResponse.json({ error: createSub.error }, { status: 500 });
        } else {
          if (subscription.id) {
            const updateSubUser = await updateUserSubscription({
              stripeSignature: secret ?? "",
              data: {
                isActive: false,
                creditRemaining: parseInt(
                  event.data.object.metadata.creditByMonth
                ) as number,
                userId: user.data.id as string,
                subscriptionId: subscription.id as string,
              },
            });
            if (!updateSubUser.data) {
              return NextResponse.json(
                { error: updateSubUser.error },
                { status: 500 }
              );
            }
          }
          const createSubUser = await createUserSubscription({
            stripeSignature: secret ?? "",
            data: {
              creditRemaining: parseInt(
                event.data.object.metadata.creditByMonth
              ) as number,
              isActive: true,
              userId: user.data.id as string,
              subscriptionId: subscription.id as string,
            },
          });
          if (!createSubUser.data) {
            return NextResponse.json(
              { error: createSubUser.error },
              { status: 500 }
            );
          }

          return NextResponse.json({ status: 200 });
        }
      } catch (error) {
        console.error("Error retrieving session details:", error);
        return NextResponse.json({ error: error }, { status: 500 });
      }

    case "customer.subscription.updated":
      const upsubscription = event.data.object as Stripe.Subscription;
      const uppriceId = upsubscription.items.data[0].price.id;
      const upSub = await updateSubscription({
        stripeSignature: secret ?? "",
        subId: upsubscription.id,
        data: {
          allDatas: JSON.stringify(upsubscription),
          status: event.data.object.status as SubscriptionStatus,
          startDate: new Date().toISOString(),
          endDate: null,
          priceId: uppriceId ?? null,
        },
      });
      if (!upSub.data) {
        return NextResponse.json({ error: upSub.error }, { status: 500 });
      }
      return NextResponse.json({ status: 200 });
    case "customer.subscription.deleted":
      const delsubscription = event.data.object as Stripe.Subscription;
      const delpriceId = delsubscription.items.data[0].price.id;
      const delSub = await updateSubscription({
        stripeSignature: secret ?? "",
        subId: delsubscription.id,
        data: {
          allDatas: JSON.stringify(delsubscription),
          status: delsubscription.status as SubscriptionStatus,
          priceId: delpriceId ?? null,
          startDate: new Date().toISOString(),
          endDate: null,
        },
      });
      if (!delSub.data) {
        return NextResponse.json({ error: delSub.error }, { status: 500 });
      }
      const upUserSub = await updateUserSubscription({
        stripeSignature: secret ?? "",
        data: {
          isActive: false,
          creditRemaining: 0,
          userId: "",
          subscriptionId: delsubscription.id as string,
        },
      });
      if (!upUserSub.data) {
        return NextResponse.json({ error: upUserSub.error }, { status: 500 });
      }
      return NextResponse.json({ status: 200 });
    case "invoice.paid":
      // We wait 5sc befroe create invoice
      await new Promise((resolve) => setTimeout(resolve, 5000));
      const invoice = event.data.object as Stripe.Invoice;
      const createInvoice = await createSubcriptionPayment({
        stripeSignature: secret ?? "",
        data: {
          id: invoice.id,
          amount: invoice.amount_paid,
          currency: invoice.currency,
          status: invoice.status,
          subscriptionId: invoice.subscription as string,
          stripePaymentIntentId: invoice.payment_intent as string,
        },
      });
      if (!createInvoice.data) {
        return NextResponse.json(
          { error: createInvoice.error },
          { status: 500 }
        );
      }
      return NextResponse.json({ status: 200 });
    case "invoice.payment_succeeded":
      return NextResponse.json({ status: 200 });
    case "invoice.payment_failed":
      const invoiceFailed = event.data.object as Stripe.Invoice;
      const createInvoiceFailed = await createSubcriptionPayment({
        stripeSignature: secret ?? "",
        data: {
          id: invoiceFailed.id,
          amount: invoiceFailed.amount_paid,
          currency: invoiceFailed.currency,
          subscriptionId: invoiceFailed.subscription as string,
          status: invoiceFailed.status,
          stripePaymentIntentId: invoiceFailed.payment_intent as string,
        },
      });
      if (!createInvoiceFailed.data) {
        return NextResponse.json(
          { error: createInvoiceFailed.error },
          { status: 500 }
        );
      }
      // We update the subscription status
      const upSubFailed = await updateSubscription({
        stripeSignature: secret ?? "",
        subId: invoiceFailed.subscription as string,
        data: {
          status: "unpaid" as SubscriptionStatus,
        },
      });
      if (!upSubFailed.data) {
        return NextResponse.json({ error: upSubFailed.error }, { status: 500 });
      }
      return NextResponse.json({ status: 200 });
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      const userId = await getUserByCustomerId({
        customerId: paymentIntent.customer as string,
      });
      if (!userId.data) {
        return NextResponse.json({ error: userId.error }, { status: 500 });
      }
      const createPaymentIntent = await createOneTimePayment({
        stripeSignature: secret ?? "",
        data: {
          id: paymentIntent.id,
          stripePaymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          priceId: paymentIntent.metadata.priceId,
          userId: userId.data.id as string,
          currency: paymentIntent.currency,
          status: paymentIntent.status,
          stripeCustomerId: paymentIntent.customer as string,
        },
      });
      if (!createPaymentIntent.data) {
        return NextResponse.json(
          { error: createPaymentIntent.error },
          { status: 500 }
        );
      }
      return NextResponse.json({ status: 200 });
    case "invoice.upcoming":
      const invoiceUpdated = event.data.object;
      const invoiceUpdatedUpSubscription = await updateSubscription({
        stripeSignature: secret ?? "",
        subId: invoiceUpdated.subscription as string,
        data: {
          nextPaymentAttempt: invoiceUpdated.amount_due,
        },
      });

      if (!invoiceUpdatedUpSubscription.data) {
        return NextResponse.json(
          { error: invoiceUpdatedUpSubscription.error },
          { status: 500 }
        );
      }
      return NextResponse.json({ status: 200 });

    // SECTION Product and Price management
    // NOTE : Product created
    case "product.created":
      const isProductExist = (await getStripeProduct(event.data.object.id))
        .success;
      if (isProductExist) {
        return NextResponse.json({ status: 200 });
      }
      const createPlan = await createOrUpdatePlanStripeToBdd({
        type: "create",
        stripePlan: event.data.object,
      });
      if (createPlan.error) {
        return NextResponse.json({ error: createPlan.error }, { status: 500 });
      }
      await createOrUpdateProductStripeToBdd({
        type: "create",
        stripeProduct: event.data.object,
        id: createPlan.data.data.id,
      });
      return NextResponse.json({ status: 200 });
    // NOTE : Product updated
    case "product.updated":
      await new Promise((resolve) => setTimeout(resolve, 4000));
      const crateProduct = await createOrUpdateProductStripeToBdd({
        type: "update",
        stripeProduct: event.data.object,
      });
      if (crateProduct.error) {
        return NextResponse.json(
          { error: crateProduct.error },
          { status: 500 }
        );
      }
      const upPlan = await createOrUpdatePlanStripeToBdd({
        type: "update",
        stripePlan: event.data.object,
      });
      if (upPlan.error) {
        return NextResponse.json({ error: upPlan.error }, { status: 500 });
      }
      return NextResponse.json({ status: 200 });
    case "price.updated":
      await createOrUpdatePriceStripeToBdd("update", event.data.object);
      return NextResponse.json({ status: 200 });
    case "price.created":
      const isPriceExist = (await getStripePrice(event.data.object.id)).success;
      if (isPriceExist) {
        return NextResponse.json({ status: 200 });
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await createOrUpdatePriceStripeToBdd("create", event.data.object);
      if (event.data.object.type === "one_time") {
        const product = await getStripeProduct(
          event.data.object.product as iStripeProduct["id"]
        );
        if (product.error) {
          console.error(product.error);
          return NextResponse.json({ error: product.error }, { status: 500 });
        }
        if (product.data && product.data.PlanId) {
          const upPlan = await updatePlan({
            id: product.data.PlanId,
            saasType: "PAY_ONCE",
          });
          if (upPlan.error) {
            // console.error(product.error);
            return NextResponse.json({ error: upPlan.error }, { status: 500 });
          }
        }
      }
      return NextResponse.json({ status: 200 });

    case "price.deleted":
      await deleteStripePrice(event.data.object.id);
      return NextResponse.json({ status: 200 });

    case "product.deleted":
      await deleteProduct(event.data.object.id);
      await deletePlan({ id: event.data.object.id, type: "stripe" });
      return NextResponse.json({ status: 200 });

    case "coupon.created":
      await createOrUpdateCouponStripeToBdd("create", event.data.object);
      return NextResponse.json({ status: 200 });
    case "coupon.updated":
      await createOrUpdateCouponStripeToBdd("update", event.data.object);
      return NextResponse.json({ status: 200 });

    case "coupon.deleted":
      await deleteStripeCoupon(event.data.object.id);
      return NextResponse.json({ status: 200 });

    default:
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 }
      );
  }
}
