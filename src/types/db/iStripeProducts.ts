import { StripePrice, StripeProduct } from "@prisma/client";
import { iStripePrice } from "./iStripePrices";

export interface iStripeProduct extends StripeProduct {
  prices: StripePrice[];
  default_price: iStripePrice["id"];
}
