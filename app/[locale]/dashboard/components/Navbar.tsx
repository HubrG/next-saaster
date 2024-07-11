"use client";
import { MenuItem } from "@/src/components/ui/@fairysaas/user-interface/MenuItem";
import { Badge } from "@/src/components/ui/badge";
import { Separator } from "@/src/components/ui/separator";
import { useIntersectionObserver } from "@/src/hooks/useIntersectionObserver";
import useScrollToSection from "@/src/hooks/useScrollToSection";
import { useSessionQuery } from "@/src/queries/useSessionQuery";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import {
  BarChart2,
  Bell,
  Building2,
  CircleUser,
  Cog,
  CreditCard,
  Mail,
  UserRoundCog,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export const DashboardNavbar = () => {
  const t = useTranslations("Dashboard.Components.Navbar");
  const { data: session, isLoading } = useSessionQuery();
  //

  const { saasSettings } = useSaasSettingsStore();
  const { appSettings } = useAppSettingsStore();
  const [activeSection, setActiveSection] = useState("");
  const [activeSubSection, setActiveSubSection] = useState("");
  const updateActiveItem = (id: string, isSubSection = false) => {
    if (isSubSection) {
      setActiveSubSection(id);
    } else {
      setActiveSection(id);
      setActiveSubSection("");
    }
  };
  useIntersectionObserver(updateActiveItem, {
    rootMargin: "-50% 0px -50% 0px",
    sectionSelector: ".user-inteface-main-content-section",
    subSectionSelector: ".user-inteface-main-content-subsection",
  });

  const handleScroll = useScrollToSection();

  return (
    <>
      <div>
        <h3 className="!max-sm:self-center">
          {t("title")}
          <Cog className="icon max-sm:hidden" />
        </h3>
        <Badge>{session?.user?.email}</Badge>
        <Separator className="my-5" />
        <ul>
          <MenuItem
            activeSection={activeSection}
            icon={<CircleUser className="icon" />}
            text={t("links.profile")}
            sectionObserve="Profile"
            handleScroll={handleScroll}
          />
          <MenuItem
            icon={<UserRoundCog className="icon" />}
            text={t("links.account")}
            activeSection={activeSection}
            sectionObserve="Account"
            handleScroll={handleScroll}></MenuItem>

          {saasSettings.saasType !== "PAY_ONCE" && (
            <>
              <MenuItem
                activeSection={activeSection}
                text={t("links.organization")}
                icon={<Building2 className="icon" />}
                sectionObserve="Organization"
                handleScroll={handleScroll}
              />
              <MenuItem
                activeSection={activeSection}
                text={t("links.billing")}
                icon={<CreditCard className="icon" />}
                sectionObserve="Billing"
                handleScroll={handleScroll}
              />
              <MenuItem
                activeSection={activeSection}
                text={t("links.usage")}
                icon={<BarChart2 className="icon" />}
                sectionObserve="Usage"
                handleScroll={handleScroll}
              />
            </>
          )}
          <MenuItem
            activeSection={activeSection}
            text={t("links.purchases")}
            icon={<CreditCard className="icon" />}
            sectionObserve="Purchase"
            handleScroll={handleScroll}
          />
          <MenuItem
            activeSection={activeSection}
            icon={<Mail className="icon" />}
            text={t("links.emails")}
            sectionObserve="Emails"
            handleScroll={handleScroll}
          />
          {appSettings.activeNotification && (
            <MenuItem
              activeSection={activeSection}
              icon={<Bell className="icon" />}
              text={t("links.notification")}
              sectionObserve="Notifications"
              handleScroll={handleScroll}
            />
          )}
        </ul>
      </div>
    </>
  );
};
export default DashboardNavbar;
