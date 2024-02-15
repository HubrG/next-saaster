import {
  createOrUpdatePlanStripeToBdd,
  deletePlan,
  updatePlan,
} from "@/src/helpers/utils/plans";
import {
  createOrUpdateCouponStripeToBdd,
  deleteStripeCoupon,
} from "@/src/helpers/utils/stripeCoupons";
import {
  createOrUpdatePriceStripeToBdd,
  deleteStripePrice,
} from "@/src/helpers/utils/stripePrices";
import {
  createOrUpdateProductStripeToBdd,
  deleteProduct,
  getStripeProduct,
} from "@/src/helpers/utils/stripeProducts";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2023-10-16",
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
    case "product.created":
      const isProductExist = await getStripeProduct(event.data.object.id);
      if (isProductExist.success) {
        return NextResponse.json({ status: 200 });
      }
      const createPlan = await createOrUpdatePlanStripeToBdd(
        "create",
        event.data.object
      );
      if (createPlan.error) {
        return NextResponse.json({ error: createPlan.error }, { status: 500 });
      }
      createOrUpdateProductStripeToBdd({
        type: "create",
        stripeProduct: event.data.object,
        id: createPlan.data.data.id,
      });
      return NextResponse.json({ status: 200 });
    case "product.updated":
      await createOrUpdateProductStripeToBdd({
        type: "update",
        stripeProduct: event.data.object,
      });
      const upPlan = await createOrUpdatePlanStripeToBdd(
        "update",
        event.data.object
      );
      if (upPlan.error) {
        return NextResponse.json({ error: upPlan.error }, { status: 500 });
      }
      return NextResponse.json({ status: 200 });
    case "price.updated":
      createOrUpdatePriceStripeToBdd("update", event.data.object);
      return NextResponse.json({ status: 200 });

    case "price.created":
      createOrUpdatePriceStripeToBdd("create", event.data.object);
      if (event.data.object.type === "one_time") {
        const product = await getStripeProduct(
          event.data.object.product as string
        );
        if (product.error) {
          return NextResponse.json({ error: product.error }, { status: 500 });
        }
        if (product.data && product.data.PlanId) {
          const upPlan = await updatePlan({
            id: product.data.PlanId,
            saasType: "PAY_ONCE",
          });
          if (upPlan.error) {
            return NextResponse.json({ error: upPlan.error }, { status: 500 });
          }
        }
      }
      return NextResponse.json({ status: 200 });

    case "price.deleted":
      deleteStripePrice(event.data.object.id);
      return NextResponse.json({ status: 200 });

    case "product.deleted":
      deleteProduct(event.data.object.id);
      deletePlan({ id: event.data.object.id, type: "stripe" });
      return NextResponse.json({ status: 200 });

    case "coupon.created":
      createOrUpdateCouponStripeToBdd("create", event.data.object);
      return NextResponse.json({ status: 200 });
    case "coupon.updated":
      createOrUpdateCouponStripeToBdd("update", event.data.object);
      return NextResponse.json({ status: 200 });

    case "coupon.deleted":
      deleteStripeCoupon(event.data.object.id);
      return NextResponse.json({ status: 200 });

    case "checkout.session.completed":
      return NextResponse.json({ status: 200 });

    case "customer.subscription.created":
      return NextResponse.json({ status: 200 });

    case "customer.subscription.updated":
      return NextResponse.json({ status: 200 });

    case "customer.subscription.deleted":
      return NextResponse.json({ status: 200 });

    case "invoice.created":
      return NextResponse.json({ status: 200 });

    case "invoice.updated":
      return NextResponse.json({ status: 200 });

    case "invoice.payment_succeeded":
      return NextResponse.json({ status: 200 });

    default:
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 }
      );
  }
}
