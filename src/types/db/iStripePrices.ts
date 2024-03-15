import { StripePrice, StripeProduct } from "@prisma/client";

export interface iStripePrice extends StripePrice {
  productRelation: StripeProduct | null;
}

export interface iSearchPrices {
  product: string;
  active: boolean;
  type: string;
  recurringInterval: string;
  oldPrice: number;
  defaultPrice: string;
  newPriceId: string;
}
