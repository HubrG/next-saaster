import { OneTimePayment, Plan, StripePrice, StripeProduct, User } from "@prisma/client";


interface oneTimeProduct extends StripeProduct {
  planRelation?: Plan | null;
}

interface oneTimePrice extends StripePrice {
  productRelation?: oneTimeProduct | null;
}


export interface iOneTimePayment extends OneTimePayment {
  user: User;
  price?: oneTimePrice | null;
}
