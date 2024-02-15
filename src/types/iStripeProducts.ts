import { StripePrice, StripeProduct } from "@prisma/client";

export interface iStripeProduct extends StripeProduct {
  prices: StripePrice[];
}
