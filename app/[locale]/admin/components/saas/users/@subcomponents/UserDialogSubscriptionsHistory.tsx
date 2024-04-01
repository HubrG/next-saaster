"use client";
import { CopySomething } from "@/src/components/ui/@fairysaas/copy-something";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/components/ui/table";
import { ReturnUserDependencyProps } from "@/src/helpers/dependencies/user";
import { convertCurrencyName } from "@/src/helpers/functions/convertCurencies";
import {
    calculateDifferenceBetweenUnixDates,
    formatUnixDate,
} from "@/src/helpers/functions/convertDate";
import { cn } from "@/src/lib/utils";
import { Check, CircleDashed, CircleOff, Copy, Hourglass } from "lucide-react";
import Stripe from "stripe";
import { CurrencyComponentStore } from "./table";
type SubscriptionHistoryProps = {
  user: ReturnUserDependencyProps;
};

export const SubscriptionHistory = ({ user }: SubscriptionHistoryProps) => {
  return (
    <>
      <h4>Subscriptions history</h4>
      <Table className="user-dialog-subscriptions">
        <TableHeader>
          <TableRow className="!border-0 !font-bold">
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Start at</TableHead>
            <TableHead>End at</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {user?.info.subscriptions
            ?.sort((a, b) => {
              const timeA = a.subscription?.createdAt
                ? a.subscription.createdAt.getTime()
                : 0;
              const timeB = b.subscription?.createdAt
                ? b.subscription.createdAt.getTime()
                : 0;
              return timeB - timeA;
            })
            .map((sub) => {
              const subscriptionAllDatas = sub.subscription
                ?.allDatas as Stripe.Subscription | null;
              return (
                <TableRow
                  key={sub.subscriptionId + user.info.id}
                  className={cn(
                    {
                      "bg-theming-background-100 !rounded-default":
                        subscriptionAllDatas?.status === "active" ||
                        subscriptionAllDatas?.status === "trialing",
                    },
                  )}>
                  <TableCell className="font-medium flex flex-row items-center">
                    <CopySomething
                      id={sub.subscriptionId + user.info.id + "stripeId"}
                      what="Stripe ID"
                      copyText={
                        sub.subscription?.id ?? "No subscription ID found"
                      }>
                      <Copy className="icon" />
                    </CopySomething>
                    {sub.subscription?.price?.productRelation?.name}
                    {user.activeSubscription &&
                      sub.subscriptionId ===
                        user.activeSubscription.subscription?.id && (
                        <>
                          {" "}
                          (
                          {convertCurrencyName(
                            user.activeSubscription.currency,
                            "sigle"
                          )}
                          {user.activeSubscription.priceWithDiscount}/
                          {user.activeSubscription.recurring})
                        </>
                      )}
                  </TableCell>
                  <TableCell>
                    {subscriptionAllDatas?.status === "active" ? (
                      <span className="flex flex-row items-center font-bold gap-2">
                        <Check className="text-green-500 icon" /> active
                      </span>
                    ) : subscriptionAllDatas?.status === "canceled" ? (
                      <span className="flex flex-row items-center font-medium gap-2">
                        <CircleOff className="text-red-500 icon" /> canceled
                      </span>
                    ) : subscriptionAllDatas?.status === "trialing" ? (
                      <span className="flex flex-row items-center font-medium gap-2">
                        <Hourglass className="text-green-500 icon" /> trialing (
                        {user.activeSubscription?.trialDaysRemaining} days left)
                      </span>
                    ) : (
                      <span className="flex flex-row items-center gap-2">
                        <CircleDashed className="icon" />{" "}
                        {subscriptionAllDatas?.status}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {formatUnixDate(
                      subscriptionAllDatas?.start_date ?? 0,
                      "US"
                    )}
                  </TableCell>
                  <TableCell>
                    {subscriptionAllDatas?.ended_at && (
                      <>
                        {formatUnixDate(
                          subscriptionAllDatas?.ended_at ?? 0,
                          "US"
                        )}{" "}
                        <span className="text-xs">
                          (
                          {calculateDifferenceBetweenUnixDates(
                            subscriptionAllDatas?.start_date,
                            subscriptionAllDatas?.ended_at
                          ) ?? 0}
                          )
                        </span>
                      </>
                    )}
                  </TableCell>
                  <TableCell>
                    <CurrencyComponentStore />
                    {sub.subscription?.SubscriptionPayments?.reduce(
                      (acc, payment) => acc + (payment.amount ?? 0) / 100,
                      0
                    ) ?? 0}
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Total spent</TableCell>
            <TableCell className="text-right">
              <CurrencyComponentStore />
              {user.payments.total_amount_subscriptions}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
};
