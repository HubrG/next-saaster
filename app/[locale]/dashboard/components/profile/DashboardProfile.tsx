"use client";

import { SkeletonLoader } from "@/src/components/ui/@blitzinit/loader";
import { SectionWrapper } from "@/src/components/ui/@blitzinit/user-interface/SectionWrapper";
import { useNotificationSettingsStore } from "@/src/stores/admin/notificationSettingsStore";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import {
  BarChartBig,
  Bell,
  Building2,
  CircleUser,
  CreditCard,
  Mail,
  UserRoundCog
} from "lucide-react";
import { useTranslations } from "next-intl";
import { ProfileAccount } from "./account/ProfileAccount";
import { ProfileBilling } from "./billing/ProfileBilling";
import { ProfileEmail } from "./emails/ProfileEmail";
import { ProfileNotifications } from "./notifications/Notifications";
import { ProfileOrganization } from "./organization/ProfileOrganization";
import { ProfileSetup } from "./profile/ProfileSetup";
import { ProfilePurchase } from "./purchase/ProfilePurchase";
import ProfileUsage from "./usage/ProfileUsage";

type DashboardProfileProps = {};

export const DashboardProfile = ({}: DashboardProfileProps) => {
  const t = useTranslations("Dashboard.Components.Profile");
  const { saasSettings } = useSaasSettingsStore();
  const { appSettings, isStoreLoading } = useAppSettingsStore();
  const { isNotificationStoreLoading } = useNotificationSettingsStore();

  return (
    <>
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
        <SectionWrapper
          id="Profile"
          sectionName={t("Profile.title")}
          // mainSectionName={t("Account.title")}
          icon={<CircleUser className="icon" />}>
          <ProfileSetup />
        </SectionWrapper>
        <SectionWrapper
          id="Account"
          sectionName={t("Account.title")}
          // mainSectionName={t("Account.title")}
          icon={<UserRoundCog className="icon" />}>
          <ProfileAccount />
        </SectionWrapper>
      </div>

      {saasSettings.saasType !== "PAY_ONCE" && (
        <>
          <SectionWrapper
            id="Organization"
            sectionName={t("Organization.title")}
            // mainSectionName={t("Account.title")}
            icon={<Building2 className="icon" />}>
            <ProfileOrganization />
          </SectionWrapper>
          <SectionWrapper
            id="Billing"
            sectionName={t("Billing.title")}
            // mainSectionName="Billing"
            icon={<CreditCard className="icon" />}>
            <ProfileBilling />
          </SectionWrapper>
        </>
      )}
      {saasSettings.activeCreditSystem && (
        <SectionWrapper
          id="Usage"
          sectionName={t("Usage.title")}
          // mainSectionName="Credit"
          icon={<BarChartBig className="icon" />}>
          <ProfileUsage />
        </SectionWrapper>
      )}
      <SectionWrapper
        id="Purchase"
        sectionName={t("Purchases.title")}
        // mainSectionName="Purchase"
        icon={<CreditCard className="icon" />}>
        <ProfilePurchase />
      </SectionWrapper>
      <SectionWrapper
        id="Emails"
        sectionName={t("Emails.title")}
        // mainSectionName="Emails"
        icon={<Mail className="icon" />}>
        <ProfileEmail />
      </SectionWrapper>
      {!isStoreLoading && appSettings.activeNotification && (
        <>
          {isNotificationStoreLoading ? (
            <SkeletonLoader type="card-page" />
          ) : (
            <SectionWrapper
              id="Notifications"
              sectionName={t("Notifications.title")}
              // mainSectionName="Emails"
              icon={<Bell className="icon" />}>
              <ProfileNotifications />
            </SectionWrapper>
          )}
        </>
      )}
    </>
  );
};
