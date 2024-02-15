import {
  ResendContact,
  Subscription,
  Transaction,
  User,
  UserFeature,
} from "@prisma/client";
export interface iUsers extends User {
  transactions: Transaction[];
  subscriptions: Subscription[];
  UserFeatures: UserFeature[];
  contacts: ResendContact[];
}
