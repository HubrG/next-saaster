import { Subscription } from "@prisma/client";
import { User } from "next-auth";

export interface iUserSubscription {
    user: User;
    subscription:Subscription

}