"use client";
import { MenuItem } from "@/src/components/ui/@fairysaas/user-interface/MenuItem";
import { MenuSubItem } from "@/src/components/ui/@fairysaas/user-interface/MenuSubItem";
import { useIntersectionObserver } from "@/src/hooks/useIntersectionObserver";
import useScrollToSection from "@/src/hooks/useScrollToSection";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import {
  BadgeDollarSign,
  Cog,
  Coins,
  Dot,
  Info,
  LayoutDashboard,
  Palette,
  Rss,
  Settings2,
  SquarePen,
  UsersRound,
  View
} from "lucide-react";
import { useState } from "react";

export const AdminNavbar = () => {
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
          Setup
          <Cog className="icon" />
        </h3>
        <ul>
          <MenuItem
            activeSection={activeSection}
            icon={<Info className="icon" />}
            text="Infos"
            sectionObserve="InfosApp"
            handleScroll={handleScroll}
          />
          <MenuItem
            icon={<Palette className="icon" />}
            text="Design"
            activeSection={activeSection}
            sectionObserve="Design"
            >
            <MenuSubItem
              parent="Design"
              activeSection={activeSubSection}
              sectionObserve="sub-theme-color"
              text="Theme color"
              icon={<Dot className="icon" />}
              handleScroll={handleScroll}
            />
            <MenuSubItem
              parent="Design"
              activeSection={activeSubSection}
              sectionObserve="sub-rounded-corner"
              text="Rounded corner"
              icon={<Dot className="icon" />}
              handleScroll={handleScroll}
            />
          </MenuItem>
          {/*  */}
          <MenuItem
            activeSection={activeSection}
            text="Layout"
            icon={<LayoutDashboard className="icon" />}
            sectionObserve="Layout"
            handleScroll={handleScroll}
          />
          {/* <MenuItem
            activeSection={activeSection}
            icon={<Languages className="icon" />}
            text="Languages"
            sectionObserve="testt"
            handleScroll={handleScroll}
          /> */}
          {/* <MenuItem
            activeSection={activeSection}
            icon={<UserCheck className="icon" />}
            text="Administrators"
            sectionObserve="Administrators"
            handleScroll={handleScroll}
          /> */}
        </ul>
      </div>
      <div>
        <h3>
          SaaS <BadgeDollarSign className="icon" />
        </h3>
        <ul>
          <MenuItem
            activeSection={activeSection}
            sectionObserve="SaasSettings"
            icon={<Settings2 className="icon" />}
            text="Settings">
            <MenuSubItem
              parent="SaasSettings"
              activeSection={activeSubSection}
              sectionObserve="sub-saas-set-saas-type"
              text="Business model"
              icon={<Dot className="icon" />}
              handleScroll={handleScroll}
            />
            <MenuSubItem
              parent="SaasSettings"
              activeSection={activeSubSection}
              sectionObserve="sub-saas-set-saas-tax"
              text="Currency"
              icon={<Dot className="icon" />}
              handleScroll={handleScroll}
            />
            {(saasSettings.saasType === "MRR_SIMPLE" ||
              saasSettings.saasType === "PER_SEAT") && (
              <MenuSubItem
                parent="SaasSettings"
                activeSection={activeSubSection}
                sectionObserve="sub-saas-set-saas-settings"
                text="More settings"
                icon={<Dot className="icon" />}
                handleScroll={handleScroll}
              />
            )}
          </MenuItem>
          {/* SECTION PRICING */}
          <MenuItem
            activeSection={activeSection}
            sectionObserve="Pricing"
            text="Pricing"
            icon={<Coins className="icon" />}>
            <MenuSubItem
              parent="Pricing"
              activeSection={activeSubSection}
              sectionObserve="ManagePricing"
              text="Manage plans"
              icon={<Dot className="icon" />}
              handleScroll={handleScroll}
            />
            <MenuSubItem
              parent="Pricing"
              activeSection={activeSubSection}
              sectionObserve="ManageFeatures"
              text="Manage features"
              icon={<Dot className="icon" />}
              handleScroll={handleScroll}
            />
          </MenuItem>
          {/*  */}
          <MenuItem
            activeSection={activeSection}
            sectionObserve="SaasUsers"
            icon={<UsersRound className="icon" />}
            text="Users"
            handleScroll={handleScroll}
          />
        </ul>
      </div>
      <div>
        <h3>
          Blog <Rss className="icon" />
        </h3>
        <ul>
          <MenuItem
            activeSection={activeSection}
            sectionObserve="ManageCategories"
            icon={<SquarePen className="icon" />}
            text="Create a post"
            handleScroll={handleScroll}
          />
          <MenuItem
            activeSection={activeSection}
            sectionObserve="ManageCategories"
            icon={<SquarePen className="icon" />}
            text="Manage categories"
            handleScroll={handleScroll}
          />
          <MenuItem
            activeSection={activeSection}
            sectionObserve="ManagePosts"
            icon={<View className="icon" />}
            text="Manage posts"
            handleScroll={handleScroll}
          />
        </ul>
      </div>
    </>
  );
};
export default AdminNavbar;
