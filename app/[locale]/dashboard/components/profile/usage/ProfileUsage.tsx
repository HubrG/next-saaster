"use client";

import { Goodline } from "@/src/components/ui/@aceternity/good-line";
import { SimpleLoader } from "@/src/components/ui/@blitzinit/loader";
import { Button } from "@/src/components/ui/@shadcn/button";
import { ReturnUserDependencyProps } from "@/src/helpers/dependencies/user-info";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { useUserInfoStore } from "@/src/stores/userInfoStore";
import { ChevronLeft, ChevronRight, MoveHorizontal } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import {
  Bar,
  BarChart,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ProfileUsageHistory from "./components/ProfileUsageHistory";

type UsageData = {
  createdAt: string;
  consumeCredit: number;
  featureUsed?: string; // Optionnel si pas de données pour une date
};
export const generateDatesForLast15Days = (start: Date, lastDays:number) => {
  const dates = [];
  const now = new Date(start);
  for (let i = 0; i < lastDays; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    dates.push(date.toISOString().split("T")[0]);
  }
  return dates.reverse();
};
const ProfileUsage = () => {
  const { userInfoStore } = useUserInfoStore();
  const { saasSettings, isStoreLoading } = useSaasSettingsStore();
  const format = useFormatter();
  const t = useTranslations("Dashboard.Components.Profile.Usage");
  const [startDate, setStartDate] = useState(new Date());
  // Change the number of days to display
  const lastDays = 15;
  // Week, and next/previous buttons
  const isFirstDateWithinLastWeek = () => {
    const firstDate = new Date(lastXDays[0]);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return firstDate > oneWeekAgo;
  };
  const handlePrevious = () => {
    setStartDate(new Date(startDate.setDate(startDate.getDate() - lastDays)));
  };

  const handleNext = () => {
    const today = new Date().toISOString().split("T")[0];
    if (lastXDays[lastXDays.length - 1] !== today) {
      setStartDate(new Date(startDate.setDate(startDate.getDate() + lastDays)));
    }
  };
  // Data for the chart
  let tokenUsageData: UsageData[] = [];

  if (isStoreLoading && !saasSettings.creditName) {
    return <SimpleLoader />;
  }

  

  const lastXDays = generateDatesForLast15Days(startDate, lastDays);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() - 14);

  if (userInfoStore?.info?.usage) {
    const rawData = userInfoStore.info
      .usage as ReturnUserDependencyProps["info"]["usage"];

    // Aggregate tokens by date
    const aggregatedData = rawData?.reduce((acc, item) => {
      if (!item?.createdAt || item?.consumeCredit === undefined) return acc;
      const date = new Date(item.createdAt).toISOString().split("T")[0]; // Convert Date to ISO string and split
      if (!acc[date]) {
        acc[date] = { consumeCredit: 0, featureUsed: [] };
      }
      acc[date].consumeCredit += item.consumeCredit ?? 0;
      if (item.feature?.name) {
        acc[date].featureUsed.push(item.feature.name);
      }
      return acc;
    }, {} as Record<string, { consumeCredit: number; featureUsed: string[] }>);

    // Fill in missing dates with 0 consumeCredit
    tokenUsageData = lastXDays.map((date) => ({
      createdAt: format.dateTime(new Date(date), {
        day: "numeric",
        month: "short",
      }),
      consumeCredit:
        aggregatedData && aggregatedData[date]
          ? aggregatedData[date].consumeCredit
          : 0,
    }));
  } else {
    // If there is no usage data, just generate 0 data for the last lastDays days
    tokenUsageData = lastXDays.map((date) => ({
      createdAt: format.dateTime(new Date(date), {
        day: "numeric",
        month: "short",
      }),
      consumeCredit: 0,
    }));
  }

  if (!userInfoStore?.info?.id) {
    return <p>No usage data available.</p>;
  }

  const isFirstDateOldest = () => {
    if (!userInfoStore?.info?.usage) return true;

    const rawData = userInfoStore.info
      .usage as ReturnUserDependencyProps["info"]["usage"];
    const oldestDate =
      rawData &&
      new Date(
        Math.min(
          ...rawData.map((item) => new Date(item.createdAt ?? Date()).getTime())
        )
      );
    const firstDate = new Date(lastXDays[0]);
    if (!oldestDate) return true;
    return firstDate <= oldestDate;
  };

  return (
    <div className="mt-14">
      <div className="grid grid-cols-12  mb-4 !w-5/7 mx-auto">
        <Button
          onClick={handlePrevious}
          disabled={isFirstDateOldest()}
          className="flex items-center gap-2 md:col-span-2 col-span-4 select-none ">
          <ChevronLeft className="icon" />
          {t("previous")}
        </Button>
        <div className="mx-4 select-none flex md:flex-row flex-col items-center justify-center gap-0 max-sm:text-xs md:col-span-8 col-span-4">
          {format.dateTime(endDate, {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          })}
          <MoveHorizontal className="ml-2 icon" />
          {format.dateTime(startDate, {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          })}
        </div>
        <Button
          onClick={handleNext}
          disabled={
            lastXDays[lastXDays.length - 1] ===
            new Date().toISOString().split("T")[0]
          }
          className="flex items-center justify-between gap-2 md:col-span-2 col-span-4 select-none">
          {t("next")}
          <ChevronRight className="icon" />
        </Button>
      </div>
      <Goodline />
      <ResponsiveContainer width="100%" height={400} className="text-xs">
        <BarChart
          data={tokenUsageData}
          margin={{
            top: 40,
            right: 30,
            left: 20,
            bottom: 5,
          }}>
          <XAxis dataKey="createdAt" />
          <YAxis />
          <Tooltip
            cursor={false}
            content={<CustomTooltip saasSettings={saasSettings} t={t} />}
          />
          <Bar
            dataKey="consumeCredit"
            fill="#8884d8"
            className="!bg-theming-text-500">
            <LabelList
              dataKey="consumeCredit"
              content={renderCustomizedLabel}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <ProfileUsageHistory startDate={startDate} lastDays={lastDays} />
    </div>
  );
};

const renderCustomizedLabel = (props: any) => {
  const { x, y, value } = props;
  if (value === 0) {
    return null;
  }
  return (
    <text
      x={x + 20}
      y={y}
      dy={-10}
      className="!text-xs !font-bold dark:!fill-theming-text-700"
      textAnchor="middle">
      {value}
    </text>
  );
};

const CustomTooltip = ({ active, payload, label, saasSettings, t }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-recharts-tooltip">
        <p className="label">{`${label}`}</p>
        <p className="desc">{`${t("credit-spent", {
          varIntlCreditName: saasSettings.creditName,
        })} : ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

export default ProfileUsage;
