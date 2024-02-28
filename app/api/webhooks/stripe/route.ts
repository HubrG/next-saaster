import { createOneTimePayment } from "@/src/helpers/db/oneTimePayments";
import {
  createOrUpdatePlanStripeToBdd,
  deletePlan,
  updatePlan,
} from "@/src/helpers/db/plans";
import {
  createOrUpdateCouponStripeToBdd,
  deleteStripeCoupon,
} from "@/src/helpers/db/stripeCoupons";
import {
  createOrUpdatePriceStripeToBdd,
  deleteStripePrice,
  getStripePrice,
} from "@/src/helpers/db/stripePrices";
import {
  createOrUpdateProductStripeToBdd,
  deleteProduct,
  getStripeProduct,
} from "@/src/helpers/db/stripeProducts";
import {
  createSubcriptionPayment,
  updateSubscriptionPayment,
} from "@/src/helpers/db/subscriptionPayments";
import {
  createSubscription,
  updateSubscription,
} from "@/src/helpers/db/subscriptions";
import { getUserByCustomerId } from "@/src/helpers/db/users";
import { iStripeProduct } from "@/src/types/iStripeProducts";
import { SubscriptionStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2023-10-16",
  typescript: true,
});

const secret = process.env.STRIPE_SIGNIN_SECRET || "";

export async function POST(req: NextRequest) {
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
    // SECTION : Subscription
    case "checkout.session.completed":
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
        const updateInvoice = await updateSubscriptionPayment({
          subId: subscription.latest_invoice as string,
          data: {
            subscriptionId: subscription.id as string,
          },
        });
        
        const createSub = await createSubscription({
          data: {
            id: subscription.id,
            userId: user.data.id,
            status: event.data.object.status as SubscriptionStatus,
            priceId: priceId ?? null,
            stripeCustomerId: customerId,
            startDate: new Date().toISOString(),
            endDate: null,
            items: JSON.stringify(subscription.items.data),
            discount: JSON.stringify(subscription.discount),
          },
        });
        if (!createSub.data) {
          return NextResponse.json({ error: createSub.error }, { status: 500 });
        } else {
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
        subId: upsubscription.id,
        data: {
          status: event.data.object.status as SubscriptionStatus,
          priceId: uppriceId ?? null,
          startDate: new Date().toISOString(),
          endDate: null,
          items: JSON.stringify(upsubscription.items.data),
          discount: JSON.stringify(upsubscription.discount),
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
        subId: delsubscription.id,
        data: {
          status: event.data.object.status as SubscriptionStatus,
          priceId: delpriceId ?? null,
          startDate: new Date().toISOString(),
          endDate: null,
          items: JSON.stringify(delsubscription.items.data),
          discount: JSON.stringify(delsubscription.discount),
        },
      });
      if (!delSub.data) {
        return NextResponse.json({ error: delSub.error }, { status: 500 });
      }
      return NextResponse.json({ status: 200 });
    case "invoice.paid":
      // We wait 5sc befroe create invoice
      await  new Promise((resolve) => setTimeout(resolve, 5000));
      const invoice = event.data.object as Stripe.Invoice;
      const createInvoice = await createSubcriptionPayment({
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
      console.log(event.data.object);
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      
      const userId = await getUserByCustomerId({ customerId: paymentIntent.customer as string});
      if (!userId.data) {
        return NextResponse.json({ error: userId.error }, { status: 500 });
      }
      const createPaymentIntent = await createOneTimePayment({
        id: paymentIntent.id,
        stripePaymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount,
        priceId: paymentIntent.metadata.priceId,
        userId: userId.data.id as string,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        stripeCustomerId: paymentIntent.customer as string,
      });
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

    case "invoice.created":
      return NextResponse.json({ status: 200 });

    case "invoice.updated":
      return NextResponse.json({ status: 200 });

    default:
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 }
      );
  }
}
