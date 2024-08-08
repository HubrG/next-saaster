"use client";
import { CopySomething } from "@/src/components/ui/@blitzinit/copy-something";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/@shadcn/table";
import { ReturnUserDependencyProps } from "@/src/helpers/dependencies/user-info";
import { useSlice } from "@/src/hooks/utils/useSlice";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { round } from "lodash";
import { ShoppingCart } from "lucide-react";
import { useFormatter } from "next-intl";
import { useEffect, useState } from "react";
type PurchaseMetadatasType = {
  name: string;
  refill: number | string;
};
type SubscriptionHistoryProps = {
  user: ReturnUserDependencyProps;
};
export const PurchaseHistory = ({ user }: SubscriptionHistoryProps) => {
  const format = useFormatter();
  const [currency, setCurrency] = useState<string>("USD");
  const { saasSettings } = useSaasSettingsStore();
  useEffect(() => {
    setCurrency(saasSettings.currency ?? "USD");
  }, [saasSettings]);

  return (
    <>
      <h4 className="flex-row-center">
        <ShoppingCart className="icon" /> Purchase history
      </h4>
      <ScrollArea className=" !overflow-x-auto ">
        <Table className="user-dialog-subscriptions !overflow-x-auto max-sm:w-[200%]">
          <TableHeader>
            <TableRow className="!border-0">
              <TableHead className="!font-bold">Name</TableHead>
              <TableHead className="!font-bold">Price ID</TableHead>
              <TableHead className="!font-bold">Refill credit amount</TableHead>
              <TableHead className="!font-bold">Created at</TableHead>
              <TableHead className="!font-bold">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {user?.info.oneTimePayments
              ?.sort((a, b) => {
                const timeA = a.createdAt ? a.createdAt.getTime() : 0;
                const timeB = b?.createdAt ? b.createdAt.getTime() : 0;
                return timeB - timeA;
              })
              .map((sub) => {
                const purchaseMetadata = sub.metadata as PurchaseMetadatasType;
                return (
                  <TableRow key={sub.id + user.info.id}>
                    <TableCell className="font-medium flex flex-row items-center text-left">
                     
                        <CopySomething
                          id={sub.id + user.info.id + "stripeId"}
                          what="Stripe ID"
                          copyText={
                            sub?.stripePaymentIntentId ?? "No purchase ID found"
                          }>
                          {sub?.metadata.name
                            ? sub?.metadata.name
                            : sub?.priceId
                              ? sub?.price?.productRelation?.PlanRelation?.name +
                              " (plan)"
                              : "No name found"}
                        </CopySomething>
                      
                    </TableCell>
                    <TableCell>
                      {sub?.priceId &&
                        <CopySomething
                          id={sub.priceId + user.info.id + "priceId"}
                          what="Price ID"
                          copyText={sub.priceId ?? "No price ID found"}>
                          {useSlice(sub.priceId ?? "", 10)}
                        </CopySomething>
                      }
                    </TableCell>
                    <TableCell>{purchaseMetadata.refill}</TableCell>
                    <TableCell>
                      {sub.createdAt ? format.dateTime(sub.createdAt) : "-"}
                    </TableCell>
                    <TableCell>
                      {format.number(round(sub.amount / 100, 2), {
                        style: "currency",
                        currency: currency,
                      }) ?? 0}{" "}
                      <span className="text-xs opacity-85">
                        (
                        {format.relativeTime(sub.createdAt ?? new Date(), {
                          style: "short",
                        })}
                        )
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>Total spent</TableCell>
              <TableCell className="text-right  font-extrabold">
                {format.number(
                  round(
                    (user.info.oneTimePayments?.reduce(
                      (total, payment) => total + payment.amount,
                      0
                    ) ?? 0) / 100,
                    2
                  ),
                  {
                    style: "currency",
                    currency,
                  }
                )}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </ScrollArea>
    </>
  );
};
