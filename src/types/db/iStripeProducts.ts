import { Plan, StripePrice, StripeProduct } from "@prisma/client";

export interface iStripeProduct extends StripeProduct {
  prices: StripePrice[];
  PlanRelation?: Plan | null;
}
