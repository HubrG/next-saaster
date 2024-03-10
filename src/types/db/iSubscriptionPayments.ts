import { Subscription, SubscriptionPayment } from "@prisma/client";


export interface iSubscriptionPayment extends SubscriptionPayment {
  subscription: Subscription | null;
}
