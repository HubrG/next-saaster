import { Subscription, SubscriptionPayment, User } from "@prisma/client";


export interface iSubscriptionPayments extends Subscription {
  user: User | null;
}
export interface iSubscriptionPayment extends SubscriptionPayment {
  subscription: iSubscriptionPayments | null;
}
