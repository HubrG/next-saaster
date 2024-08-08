import { ScrollArea } from "@/src/components/ui/@shadcn/scroll-area";
import { ReturnUserDependencyProps } from "@/src/helpers/dependencies/user-info";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { useUserInfoStore } from "@/src/stores/userInfoStore";
import { useFormatter, useTranslations } from "next-intl";
import { generateDatesForLast15Days } from "../ProfileUsage";

type ProfileUsageHistory = {
  startDate: Date;
  lastDays: number;
};

const ProfileUsageHistory = ({ startDate, lastDays }: ProfileUsageHistory) => {
  const { userInfoStore } = useUserInfoStore();
  const { saasSettings } = useSaasSettingsStore();
  const format = useFormatter();
  const t = useTranslations("Dashboard.Components.Profile.Usage");
  const lastXDays = generateDatesForLast15Days(startDate, lastDays);

  if (!userInfoStore?.info?.usage) {
    return <p>{t("no-usage-history")}</p>;
  }

  const rawData = userInfoStore.info
    .usage as ReturnUserDependencyProps["info"]["usage"];
  const filteredData =
    rawData &&
    rawData.filter((item) =>
      lastXDays.includes(
        new Date(item.createdAt ?? Date()).toISOString().split("T")[0]
      )
    );

  return (
    <div className="mt-8 mx-auto">
      <ScrollArea className="h-96 overflow-x-auto">
        <table className="w-full table-auto rounded-default">
          <thead className="sticky top-0 !rounded-default">
            <tr className="dark:bg-theming-background-200 bg-theming-background-200/50 backdrop-blur text-theming-text-800   text-sm leading-normal !rounded-default">
              <th className="py-3 px-6 text-left font-semibold !rounded-tl-default">
                {t("feature")}
              </th>
              <th className="py-3 px-6 text-left font-semibold">{t("date")}</th>
              <th className="py-3 px-6 text-left font-semibold">
                {t("usage-count")}
              </th>
              <th className="py-3 px-6 text-left font-semibold">
                {t("metered-credit")}
              </th>
              <th className="py-3 px-6 text-left font-semibold !rounded-tr-default">
                {t("credit-spent", {
                  varIntlCreditName: saasSettings.creditName,
                })}
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {filteredData
              ?.sort(
                (a, b) =>
                  new Date(b.createdAt ?? Date()).getTime() -
                  new Date(a.createdAt ?? Date()).getTime()
              )
              .map((item, index) => (
                <tr
                  key={index}
                  className={` dark:hover:bg-theming-background-200/50 hover:bg-theming-background-200/20 text-theming-text-800 dark:text-theming-text-800`}>
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {item.feature?.name || "-"}
                  </td>
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {format.dateTime(new Date(item.createdAt ?? Date()), {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {item.quantityForFeature || 0}
                  </td>
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {item.consumeStripeMeteredCredit || 0}
                  </td>
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {item.consumeCredit || 0}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </ScrollArea>
    </div>
  );
};

export default ProfileUsageHistory;
