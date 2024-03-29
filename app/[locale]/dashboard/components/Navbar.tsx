"use client";
import { MenuItem } from "@/src/components/ui/user-interface/MenuItem";
import { useIntersectionObserver } from "@/src/hooks/useIntersectionObserver";
import useScrollToSection from "@/src/hooks/useScrollToSection";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { BarChart2, Building2, CircleUser, Cog, CreditCard, Mail, UserRoundCog } from "lucide-react";
import { useState } from "react";

export const DashboardNavbar = () => {
  const { saasSettings } = useSaasSettingsStore();
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
        <h3>
          Profile
          <Cog className="icon" />
        </h3>
        <ul>
          <MenuItem
            activeSection={activeSection}
            icon={<CircleUser className="icon" />}
            text="Profile"
            sectionObserve="Profile"
            handleScroll={handleScroll}
          />
          <MenuItem
            icon={<UserRoundCog className="icon" />}
            text="Account"
            activeSection={activeSection}
            sectionObserve="Account"
            handleScroll={handleScroll}></MenuItem>
          {saasSettings.saasType === "PAY_ONCE" ? (
            <MenuItem
              activeSection={activeSection}
              text="Purchase"
              icon={<CreditCard className="icon" />}
              sectionObserve="Purchase"
              handleScroll={handleScroll}
            />
          ) : (
            <>
              <MenuItem
                activeSection={activeSection}
                text="Organization"
                icon={<Building2 className="icon" />}
                sectionObserve="Organization"
                handleScroll={handleScroll}
              />
              <MenuItem
                activeSection={activeSection}
                text="Billing"
                icon={<CreditCard className="icon" />}
                sectionObserve="Billing"
                handleScroll={handleScroll}
              />
              <MenuItem
                activeSection={activeSection}
                text="Usage"
                icon={<BarChart2 className="icon" />}
                sectionObserve="Usage"
                handleScroll={handleScroll}
              />
            </>
          )}
          <MenuItem
            activeSection={activeSection}
            icon={<Mail className="icon" />}
            text="Emails"
            sectionObserve="Emails"
            handleScroll={handleScroll}
          />
        </ul>
      </div>
    </>
  );
};
export default DashboardNavbar;
