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
  getStripePrice,
} from "@/src/helpers/utils/stripePrices";
import {
  createOrUpdateProductStripeToBdd,
  deleteProduct,
  getStripeProduct,
} from "@/src/helpers/utils/stripeProducts";
import { iStripeProduct } from "@/src/types/iStripeProducts";
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
