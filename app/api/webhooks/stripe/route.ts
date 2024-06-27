import { createOneTimePayment } from "@/src/helpers/db/oneTimePayments.action";
import {
  createOrUpdatePlanStripeToBdd,
  deletePlan,
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
  getStripeProduct,
} from "@/src/helpers/db/stripeProducts.action";
import { createSubcriptionPayment } from "@/src/helpers/db/subscriptionPayments.action";
import {
  createSubscription,
  updateSubscription,
} from "@/src/helpers/db/subscriptions.action";
import {
  createUserSubscription,
  updateUserSubscription,
} from "@/src/helpers/db/userSubscription.action";
import { getUserByCustomerId } from "@/src/helpers/db/users.action";
import { todoWhenPaymentSuceeded } from "@/src/helpers/functions/todoWhenPaymentSuceeded";
import { handleError } from "@/src/lib/error-handling/handleError";
import { iStripeProduct } from "@/src/types/db/iStripeProducts";
import { SubscriptionStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2024-06-20",
  typescript: true,
});

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET || "";
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature");

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
    // NOTE : Checkout session completed
    case "checkout.session.completed":
      // console.log(event.data.object);
      todoWhenPaymentSuceeded(event.data.object);
      //
      return NextResponse.json({ status: 200 });
    // NOTE : Subscription created
    case "customer.subscription.created":
      const subscription = event.data.object as Stripe.Subscription;
      const priceId = subscription.items.data[0].price.id;
      const customerId = subscription.customer as string;
      let user = await getUserByCustomerId({
        customerId,
        stripeSignature: secret,
      });
      if (handleError(user).error)
        return NextResponse.json(
          { error: handleError(user).message },
          { status: 500 }
        );
      try {
        const createSub = await createSubscription({
          stripeSignature: secret ?? "",
          data: {
            id: subscription.id,
            allDatas: JSON.stringify(subscription),
            status: event.data.object.status as SubscriptionStatus,
            priceId: priceId ?? null,
            nextPaymentAttempt: undefined,
            stripeCustomerId: customerId,
            startDate: new Date().toISOString(),
            endDate: undefined,
          },
        });
        if (handleError(createSub).error)
          return NextResponse.json(
            { error: handleError(createSub).message },
            { status: 500 }
          );
        if (subscription.id) {
          const updateSubUser = await updateUserSubscription({
            stripeSignature: secret ?? "",
            data: {
              isActive: false,
              creditRemaining: parseInt(
                event.data.object.metadata.creditByMonth ?? 0
              ) as number,
              userId: user.data?.success?.id as string,
              subscriptionId: subscription.id as string,
            },
          });
          if (handleError(updateSubUser).error)
            return NextResponse.json(
              { error: handleError(updateSubUser).message },
              { status: 500 }
            );
        }
        const createSubUser = await createUserSubscription({
          stripeSignature: secret ?? "",
          data: {
            creditRemaining: parseInt(
              event.data.object.metadata.creditByMonth ?? 0
            ) as number,
            isActive: true,
            userId: user.data?.success?.id as string,
            subscriptionId: subscription.id as string,
          },
        });
        if (handleError(createSubUser).error)
          return NextResponse.json(
            { error: handleError(createSubUser).message },
            { status: 500 }
          );
        return NextResponse.json({ status: 200 });
      } catch (error) {
        console.error("Error retrieving session details:", error);
        return NextResponse.json({ error: error }, { status: 500 });
      }
    // NOTE : Subscription updated
    case "customer.subscription.updated":
      const upsubscription = event.data.object as Stripe.Subscription;
      await new Promise((resolve) => setTimeout(resolve, 4000));
      const uppriceId = upsubscription.items.data[0].price.id;
      const upSub = await updateSubscription({
        stripeSignature: secret ?? "",
        data: {
          id: upsubscription.id,
          allDatas: JSON.stringify(upsubscription),
          status: event.data.object.status as SubscriptionStatus,
          startDate: new Date().toISOString(),
          priceId: uppriceId ?? null,
        },
      });
      if (handleError(upSub).error)
        return NextResponse.json(
          { error: handleError(upSub).message },
          { status: 500 }
        );
      return NextResponse.json({ status: 200 });
    // NOTE : Subscription deleted
    case "customer.subscription.deleted":
      const delsubscription = event.data.object as Stripe.Subscription;
      const delpriceId = delsubscription.items.data[0].price.id;
      const delSub = await updateSubscription({
        stripeSignature: secret ?? "",
        data: {
          id: delsubscription.id,
          allDatas: JSON.stringify(delsubscription),
          status: delsubscription.status as SubscriptionStatus,
          priceId: delpriceId ?? null,
          startDate: new Date().toISOString(),
          endDate: undefined,
        },
      });
      if (handleError(delSub).error)
        return NextResponse.json(
          { error: handleError(delSub).message },
          { status: 500 }
        );
      const upUserSub = await updateUserSubscription({
        stripeSignature: secret ?? "",
        data: {
          isActive: false,
          creditRemaining: 0,
          userId: "",
          subscriptionId: delsubscription.id as string,
        },
      });
      if (handleError(upUserSub).error)
        return NextResponse.json(
          { error: handleError(upUserSub).message },
          { status: 500 }
        );
      return NextResponse.json({ status: 200 });
    // NOTE : Invoice paid
    case "invoice.paid":
      // We wait 5sc before create invoice (to be sure that the payment is well done and the invoice is created in the database)
      await new Promise((resolve) => setTimeout(resolve, 5000));
      const invoice = event.data.object as Stripe.Invoice;
      const createInvoice = await createSubcriptionPayment({
        stripeSignature: secret ?? "",
        data: {
          id: invoice.id,
          amount: invoice.amount_paid,
          currency: invoice.currency,
          status: invoice.status ?? "paid",
          subscriptionId: invoice.subscription as string,
          stripePaymentIntentId: invoice.payment_intent as string,
        },
      });
      if (handleError(createInvoice).error)
        return NextResponse.json(
          { error: handleError(createInvoice).message },
          { status: 500 }
        );
      return NextResponse.json({ status: 200 });
    // NOTE : Invoice payment succeeded
    case "invoice.payment_succeeded":
      return NextResponse.json({ status: 200 });
    // NOTE : Invoice payment failed
    case "invoice.payment_failed":
      const invoiceFailed = event.data.object as Stripe.Invoice;
      const createInvoiceFailed = await createSubcriptionPayment({
        stripeSignature: secret ?? "",
        data: {
          id: invoiceFailed.id,
          amount: invoiceFailed.amount_paid,
          currency: invoiceFailed.currency,
          subscriptionId: invoiceFailed.subscription as string,
          status: invoiceFailed.status ?? "unpaid",
          stripePaymentIntentId: invoiceFailed.payment_intent as string,
        },
      });
      if (handleError(createInvoiceFailed).error)
        return NextResponse.json(
          { error: handleError(createInvoiceFailed).message },
          { status: 500 }
        );
      // We update the subscription status
      const upSubFailed = await updateSubscription({
        stripeSignature: secret ?? "",
        data: {
          id: invoiceFailed.subscription as string,
          status: "unpaid" as SubscriptionStatus,
        },
      });
      if (handleError(upSubFailed).error)
        return NextResponse.json(
          { error: handleError(upSubFailed).message },
          { status: 500 }
        );
      return NextResponse.json({ status: 200 });
    // NOTE : Payment intent succeeded
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      const userId = await getUserByCustomerId({
        customerId: paymentIntent.customer as string,
        stripeSignature: secret ?? ""
      });
      if (handleError(userId).error)
        return NextResponse.json(
          { error: handleError(userId).message },
          { status: 500 }
        );
      const createPaymentIntent = await createOneTimePayment({
        stripeSignature: secret ?? "",
        data: {
          stripePaymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          priceId: paymentIntent.metadata?.priceId ?? "",
          userId: userId.data?.success?.id as string,
          metadata: JSON.stringify(paymentIntent.metadata),
          currency: paymentIntent.currency,
          status: paymentIntent.status,
          stripeCustomerId: paymentIntent.customer as string,
        },
      });
      if (handleError(createPaymentIntent).error) {
        console.error("Error payment intent succeeded :", handleError(createPaymentIntent).message);
        return NextResponse.json(
          { error: handleError(createPaymentIntent).message },
          { status: 500 }
        );
      }
      return NextResponse.json({ status: 200 });
    // NOTE : Invoice upcoming
    case "invoice.upcoming":
      const invoiceUpdated = event.data.object;
      const invoiceUpdatedUpSubscription = await updateSubscription({
        stripeSignature: secret ?? "",
        data: {
          id: invoiceUpdated.subscription as string,
          nextPaymentAttempt: invoiceUpdated.amount_due,
        },
      });

      if (handleError(invoiceUpdatedUpSubscription).error)
        return NextResponse.json(
          { error: handleError(invoiceUpdatedUpSubscription).message },
          { status: 500 }
        );
      return NextResponse.json({ status: 200 });
    // SECTION Product and Price management
    // NOTE : Product created
    case "product.created":
      const isProductExist = (
        await getStripeProduct({
          id: event.data.object.id,
          stripeSignature: secret ?? "",
        })
      ).data?.success?.id;
      if (isProductExist) {
        return NextResponse.json({ status: 200 });
      }
      const createPlan = await createOrUpdatePlanStripeToBdd({
        type: "create",
        stripePlan: event.data.object,
        stripeSignature: secret ?? "",
      });
      if (createPlan.serverError || createPlan.validationErrors) {
        const error = await errorHandling(
          createPlan.serverError ?? createPlan.validationErrors ?? undefined
        );
        console.error("Error product created :", error);
        return NextResponse.json(
          {
            error,
          },
          { status: 500 }
        );
      }
      const createProd = await createOrUpdateProductStripeToBdd({
        type: "create",
        data: event.data.object as any,
        planId: createPlan.data?.success?.id,
        stripeSignature: secret ?? "",
      });
      if (handleError(createProd).error) {
        return NextResponse.json(
          { error: handleError(createProd).message },
          { status: 500 }
        );
      }
      return NextResponse.json({ status: 200 });
    // NOTE : Product updated
    case "product.updated":
      await new Promise((resolve) => setTimeout(resolve, 4000));
      const updateProd = await createOrUpdateProductStripeToBdd({
        type: "update",
        data: event.data.object as any,
        stripeSignature: secret ?? "",
      });
      if (handleError(updateProd).error) {
        return NextResponse.json(
          { error: handleError(updateProd).message },
          { status: 500 }
        );
      }
      const upPlan = await createOrUpdatePlanStripeToBdd({
        type: "update",
        stripePlan: event.data.object,
        stripeSignature: secret ?? "",
      });
      if (upPlan.serverError || upPlan.validationErrors) {
        const error = await errorHandling(upPlan);
        console.error("Error product updated :", error);
        return NextResponse.json(
          {
            error,
          },
          { status: 500 }
        );
      }
      return NextResponse.json({ status: 200 });
    // NOTE : Product deleted
    case "product.deleted":
      const delProduct = event.data.object as Stripe.Product;
      const del = await deletePlan({
        id: delProduct.id,
        stripeSignature: secret ?? "",
      });
      if (del.serverError || del.validationErrors) {
        const error = await errorHandling(del);
        console.error("Error product deleted :", error);
        return NextResponse.json(
          {
            error,
          },
          { status: 500 }
        );
      }
      return NextResponse.json({ status: 200 });
    // NOTE : Price updated
    case "price.updated":
      await createOrUpdatePriceStripeToBdd({
        type: "update",
        data: event.data.object as any,
        stripeSignature: secret ?? "",
      });
      return NextResponse.json({ status: 200 });
    // NOTE : Price created
    case "price.created":
      const isPriceExist = await getStripePrice({
        id: event.data.object.id,
        stripeSignature: secret ?? "",
      });
      if (isPriceExist.data?.success?.id) {
        return NextResponse.json({ status: 200 });
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await createOrUpdatePriceStripeToBdd({
        type: "create",
        data: event.data.object as any,
        stripeSignature: secret ?? "",
      });
      if (event.data.object.type === "one_time") {
        const product = await getStripeProduct({
          id: event.data.object.product as iStripeProduct["id"],
          stripeSignature: secret ?? "",
        });
        if (handleError(product).error)
          return NextResponse.json(
            { error: handleError(product).message },
            { status: 500 }
          );
      }
      return NextResponse.json({ status: 200 });
    // NOTE : Price deleted
    case "price.deleted":
      await deleteStripePrice({
        id: event.data.object.id,
        stripeSignature: secret ?? "",
      });
      return NextResponse.json({ status: 200 });
    // NOTE : Coupon created
    case "coupon.created":
      await createOrUpdateCouponStripeToBdd({
        type: "create",
        data: event.data.object as any,
        stripeSignature: secret ?? "",
      });
      return NextResponse.json({ status: 200 });
    // NOTE : Coupon updated
    case "coupon.updated":
      await createOrUpdateCouponStripeToBdd({
        type: "update",
        data: event.data.object as any,
        stripeSignature: secret ?? "",
      });
      return NextResponse.json({ status: 200 });
    // NOTE : Coupon deleted
    case "coupon.deleted":
      await deleteStripeCoupon({
        id: event.data.object.id,
        stripeSignature: secret ?? "",
      });
      return NextResponse.json({ status: 200 });
    // NOTE : Default
    default:
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 }
      );
  }
}

async function errorHandling(data: any) {
  return [
    `Type errror : ${data.validationErrors?.data ?? undefined}`,
    `Server error : ${data.serverError ?? undefined}`,
  ];
}
