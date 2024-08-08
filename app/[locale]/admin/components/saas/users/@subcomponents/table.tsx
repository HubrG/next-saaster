"use client";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  Award,
  Check,
  ChevronDown,
  CircleDashed,
  CircleOff,
  Crown,
  Hourglass,
  User,
} from "lucide-react";
import React, { useEffect, useState } from "react";

import { CopySomething } from "@/src/components/ui/@blitzinit/copy-something";
import { SkeletonLoader } from "@/src/components/ui/@blitzinit/loader";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/@shadcn/avatar";
import { Button } from "@/src/components/ui/@shadcn/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/src/components/ui/@shadcn/dropdown-menu";
import { Input } from "@/src/components/ui/@shadcn/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/@shadcn/table";
import { getUserInfos } from "@/src/helpers/dependencies/user-info";
import { useSlice } from "@/src/hooks/utils/useSlice";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { useUserStore } from "@/src/stores/userStore";
import { iUsers } from "@/src/types/db/iUsers";
import { UserRole } from "@prisma/client";
import { round, upperCase } from "lodash";
import { useFormatter } from "next-intl";
import { Tooltip } from "react-tooltip";
import { UserDialog } from "./UserDialog";

export const columns: ColumnDef<iUsers>[] = [
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return <UserDialog user={row.original as iUsers} />;
    },
  },
  {
    accessorKey: "image",
    header: undefined,
    cell: ({ row }) => (
      <Avatar className="!no-underline h-8 w-8 mx-auto ">
        {row.getValue("image") !== "" && (
          <AvatarImage
            src={row.getValue("image")}
            alt={row.original.name ?? "User avatar"}
          />
        )}
        <AvatarFallback style={{ textDecoration: "transparent" }}>
          <span className="!no-underline text-base">
            {upperCase(
              row.original.name
                ?.toString()
                .split(" ")
                .map((n) => n[0])
                .join("")
            )}
          </span>
        </AvatarFallback>
      </Avatar>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="link"
          className="!px-0 self-start float-left"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase text-left">
        <CopySomething
          what={row.getValue("email")}
          id={row.getValue("email") + "cs"}
          copyText={row.getValue("email")}>
          <span className="cursor-pointer">
            {useSlice(row.getValue("email"), 14)}
          </span>
        </CopySomething>
      </div>
    ),
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="link"
          className="mx-auto"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Joined on
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div className="text-center font-medium text-sm">
          {date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      );
    },
  },

  {
    accessorKey: "subscriptions",
    header: ({ column }) => {
      return (
        <Button
          variant="link"
          className="mx-auto"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Subscription
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const format = useFormatter();
      const userInfo = getUserInfos({ user: row.original as iUsers });
      return (
        <>
          {userInfo.activeSubscription ? (
            <div className="flex flex-col justify-center">
              <div className="text-center font-medium flex text-sm flex-row !items-center !justify-center gap-2">
                {userInfo.activeSubscription.isTrial ? (
                  <Hourglass
                    className="text-green-500 icon"
                    data-tooltip-id={userInfo.info.id + "trial"}
                  />
                ) : (
                  <Check className="text-green-500 icon" />
                )}
                {userInfo.activeSubscription.planObject.name} (
                {format.number(userInfo.activeSubscription.priceWithDiscount, {
                  style: "currency",
                  currency: userInfo.activeSubscription.currency,
                })}
                /{userInfo.activeSubscription.recurring})
              </div>
              <Tooltip
                id={userInfo.info.id + "trial"}
                place="left"
                className="tooltip">
                Trialing - {userInfo.activeSubscription.trialDaysRemaining} days
                left
              </Tooltip>
            </div>
          ) : (userInfo.info.subscriptions?.length ?? 0) > 0 ? (
            <div className="text-center font-medium flex text-sm flex-row items-center gap-2">
              <CircleOff className="text-red-500 icon" />
              Canceled
            </div>
          ) : (
            <div className="text-center font-medium flex text-sm flex-row items-center gap-2 opacity-50">
              <CircleDashed className="icon" />
              No subscription
            </div>
          )}
        </>
      );
    },
  },
  {
    accessorKey: "subscriptions2",
    header: ({ column }) => {
      return <>Total spent</>;
    },
    cell: ({ row }) => {
      const { saasSettings } = useSaasSettingsStore.getState();

      const format = useFormatter();
      const userInfo = getUserInfos({ user: row.original as iUsers });
      const totalOneTime = userInfo.payments.total_amount_ontime_payments ?? 0;
      const totalSubscriptions =
        userInfo.payments.total_amount_subscriptions ?? 0;
      const total = totalOneTime + totalSubscriptions;
      return (
        <>
          <div className="text-sm">
            {format.number(round(total, 3), {
              style: "currency",
              currency: saasSettings.currency ?? "usd",
            })}
          </div>
        </>
      );
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <Button
          variant="link"
          className="mx-auto"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Role
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const role = row.getValue("role") as UserRole;
      return (
        <div className="text-center font-medium flex justify-center">
          {role === "SUPER_ADMIN" && (
            <Crown
              data-tooltip-id={row.original.id + "tt"}
              className="icon text-yellow-500"
            />
          )}
          {role === "ADMIN" && (
            <Award
              data-tooltip-id={row.original.id + "tt"}
              className="icon text-blue-500"
            />
          )}
          {role === "EDITOR" && (
            <Award
              data-tooltip-id={row.original.id + "tt"}
              className="icon text-blue-500"
            />
          )}
          {role === "USER" && (
            <User data-tooltip-id={row.original.id + "tt"} className="icon" />
          )}
          <Tooltip id={row.original.id + "tt"} place="left" className="tooltip">
            <span>{role}</span>
          </Tooltip>
        </div>
      );
    },
  },
];

export function DataTableDemo() {
  const { usersStore, fetchUsersStore, isUserStoreLoading } = useUserStore();
  const [data, setData] = useState([] as iUsers[]);
  useEffect(() => {
    if (data.length === 0 && usersStore.length === 0) {
      fetchUsersStore();
    }
    if (usersStore.length > 0 && data.length === 0) {
      setData(usersStore);
    }
  }, [isUserStoreLoading, fetchUsersStore, data, usersStore]);

  useEffect(() => {
    if (usersStore.length > 0 && data.length > 0) {
      setData(usersStore);
    }
  }, [usersStore, data]);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (isUserStoreLoading) return <SkeletonLoader type="card-page" />;
  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }>
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="pb-14">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="mx-auto text-center font-bold">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="!py-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm ml-10 text-muted-foreground">
          {/* {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected. */}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
