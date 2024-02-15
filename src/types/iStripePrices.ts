import { StripePrice } from "@prisma/client";
import { iStripeProduct } from "./iStripeProducts";

export interface iStripePrice extends StripePrice {
  productRelation: iStripeProduct;
}
