import { StripePrice } from "@prisma/client";
import { iStripeProduct } from "./iStripeProducts";

export interface iStripePrice extends StripePrice {
  productRelation: iStripeProduct;
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
