import { createPlan, deletePlan, updatePlan } from "@/src/helpers/utils/plans";
import {
  createStripePrice,
  deletePrice,
  updateStripePrice,
} from "@/src/helpers/utils/stripePrices";
import {
  createStripeProduct,
  deleteProduct,
  updateStripeProduct,
} from "@/src/helpers/utils/stripeProducts";
import { getErrorMessage } from "@/src/lib/getErrorMessage";
import { MRRSPlan } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2023-10-16",
});

const secret = process.env.STRIPE_SIGNIN_SECRET || "";
export const bodyparser = false;

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
      const createPlan = await createOrUpdatePlan("create", event.data.object);
      if (createPlan.error) {
        return NextResponse.json({ error: createPlan.error }, { status: 500 });
      }
      createOrUpdateProduct({
        type: "create",
        stripeProduct: event.data.object,
        id: createPlan.data.data.id,
      });
      return NextResponse.json({ status: 200 });
    case "product.updated":
      await createOrUpdateProduct({
        type: "update",
        stripeProduct: event.data.object,
      });
      const updatePlan = await createOrUpdatePlan("update", event.data.object);
      if (updatePlan.error) {
        return NextResponse.json({ error: updatePlan.error }, { status: 500 });
      }
      return NextResponse.json({ status: 200 });
    case "price.updated":
      createOrUpdatePrice("update", event.data.object);
      return NextResponse.json({ status: 200 });
    case "price.created":
      createOrUpdatePrice("create", event.data.object);
      return NextResponse.json({ status: 200 });
    case "price.deleted":
      deleteStripePrice(event.data.object.id);
      return NextResponse.json({ status: 200 });
    case "product.deleted":
      deleteStripeProduct(event.data.object.id);
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
    case "plan.updated":
      return NextResponse.json({ status: 200 });
    default:
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 }
      );
  }
}

// SECTION Products

// NOTE : Create a product
type CreateOrUpdateProductType = {
  type: "create" | "update";
  stripeProduct: Stripe.Product;
  id?: string;
};
const createOrUpdateProduct = async ({
  type,
  stripeProduct,
  id,
}: CreateOrUpdateProductType): Promise<{
  success?: boolean;
  data?: any;
  error?: string;
}> => {
  try {
    // Créer un nouvel objet avec les propriétés attendues par createStripeProduct
    const productData = {
      ...stripeProduct,
      id: stripeProduct.id,
      default_price: stripeProduct.default_price as Stripe.Price["id"],
      metadata: stripeProduct.metadata ?? {},
      unit_label: stripeProduct.unit_label ?? null,
      statement_descriptor: stripeProduct.statement_descriptor ?? null,
      name: stripeProduct.name,
      active: stripeProduct.active,
      MRRSPlanId: id,
      description: stripeProduct.description,
    };
    if (type === "create") {
      const product = await createStripeProduct(productData);
      return { success: true, data: product };
    } else if (type === "update") {
      const product = await updateStripeProduct(productData);
      return { success: true, data: product };
    } else {
      return { error: "An unknown error occurred" };
    }
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

const createOrUpdatePrice = async (
  type: "create" | "update",
  stripePrice: Stripe.Price
): Promise<{ success?: boolean; data?: any; error?: string }> => {
  try {
    const priceData = {
      ...stripePrice,
      id: stripePrice.id,
      active: stripePrice.active,
      billing_scheme: stripePrice.billing_scheme,
      custom_unit_amount: stripePrice.custom_unit_amount ?? null,
      currency: stripePrice.currency,
      lookup_key: stripePrice.lookup_key ?? null,
      metadata: stripePrice.metadata ?? {},
      nickname: stripePrice.nickname ?? null,
      product: stripePrice.product as Stripe.Product["id"],
      recurring: stripePrice.recurring,
      recurring_interval: stripePrice.recurring?.interval ?? null,
      recurring_interval_count: stripePrice.recurring?.interval_count ?? null,
      recurring_aggregrate_usage:
        stripePrice.recurring?.aggregate_usage ?? null,
      recurring_trial_period_days:
        stripePrice.recurring?.trial_period_days ?? null,
      recurring_usage_type: stripePrice.recurring?.usage_type ?? null,
      tier_mode: stripePrice.tiers_mode ?? null,
      transform_quantity: stripePrice.transform_quantity ?? null,
      transform_quantity_divide_by:
        stripePrice.transform_quantity?.divide_by ?? null,
      transform_quantity_round: stripePrice.transform_quantity?.round ?? null,
      type: stripePrice.type,
      unit_amount: stripePrice.unit_amount,
      unit_amount_decimal: stripePrice.unit_amount_decimal,
    };
    if (type === "create") {
      const price = await createStripePrice(priceData as any);
      return { success: true, data: price };
    } else if (type === "update") {
      const price = await updateStripePrice(priceData as any);
      return { success: true, data: price };
    } else {
      console.error("An unknown error occurred");
      return { error: "An unknown error occurred" };
    }
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

const createOrUpdatePlan = async (
  type: "create" | "update",
  stripePlan: Stripe.Product
): Promise<{ success?: boolean; data?: any; error?: string }> => {
  try {
    const planData = {
      ...stripePlan,
      active: stripePlan.active,
      stripeId: stripePlan.id,
      name: stripePlan.name,
      description: stripePlan.description,
    };
    if (type === "create") {
      const plan = await createPlan(planData as Partial<MRRSPlan>);
      return { success: true, data: plan };
    } else if (type === "update") {
      const plan = await updatePlan(planData as Partial<MRRSPlan>);
      return { success: true, data: plan };
    } else {
      console.error("An unknown error occurred");
      return { error: "An unknown error occurred" };
    }
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

const deleteStripePrice = async (
  id: string
): Promise<{ success?: boolean; data?: any; error?: string }> => {
  try {
    const price = await deletePrice(id);
    return { success: true, data: price };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

const deleteStripeProduct = async (
  id: string
): Promise<{ success?: boolean; data?: any; error?: string }> => {
  try {
    const product = await deleteProduct(id);
    const plan = await deletePlan(id);
    return { success: true, data: product };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};
