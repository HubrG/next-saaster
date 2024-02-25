"use client";
import { MenuItem } from "@/src/components/ui/user-interface/MenuItem";
import { MenuSubItem } from "@/src/components/ui/user-interface/MenuSubItem";
import { useIntersectionObserver } from "@/src/hooks/useIntersectionObserver";
import useScrollToSection from "@/src/hooks/useScrollToSection";
import {
  BadgeDollarSign,
  BarChart2,
  Cog,
  Coins,
  Contact,
  Contact2,
  Cookie,
  Dot,
  FilePenLine,
  Filter,
  GaugeCircle,
  Info,
  Languages,
  LayoutDashboard,
  Mail,
  MessageCircleQuestion,
  MousePointerClick,
  Palette,
  Receipt,
  Rss,
  Scale,
  Settings2,
  Share2,
  SquarePen,
  UserCheck,
  View,
} from "lucide-react";
import { useState } from "react";

export const AdminNavbar = () => {
  const [activeSection, setActiveSection] = useState("");
  const [activeSubSection, setActiveSubSection] = useState("");
  const updateActiveItem = (id: string, isSubSection = false) => {
    if (isSubSection) {
      setActiveSubSection(id);
      // Optionnellement, déterminez ici la section parente pour l'état activeSection
    } else {
      setActiveSection(id);
      // Réinitialiser l'état de la sous-section si nécessaire
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
            handleScroll={handleScroll}>
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
          <MenuItem
            activeSection={activeSection}
            icon={<Languages className="icon" />}
            text="Languages"
            sectionObserve="testt"
            handleScroll={handleScroll}
          />
          <MenuItem
            activeSection={activeSection}
            icon={<UserCheck className="icon" />}
            text="Administrators"
            sectionObserve="Administrators"
            handleScroll={handleScroll}
          />
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
            text="Settings"
            handleScroll={handleScroll}>
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
            <MenuSubItem
              parent="SaasSettings"
              activeSection={activeSubSection}
              sectionObserve="sub-saas-set-saas-settings"
              text="More settings"
              icon={<Dot className="icon" />}
              handleScroll={handleScroll}
            />
          </MenuItem>
          {/* SECTION PRICING */}
          <MenuItem
            activeSection={activeSection}
            sectionObserve="Pricing"
            text="Pricing"
            icon={<Coins className="icon" />}
            handleScroll={handleScroll}>
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
            sectionObserve="SaasCustomers"
            icon={<Contact2 className="icon" />}
            text="Customers"
            handleScroll={handleScroll}
          />

          {/* marketing */}
          <MenuItem
            activeSection={activeSection}
            sectionObserve="Funnel"
            icon={<Filter className="icon" />}
            text="Funnel"
            handleScroll={handleScroll}
          />
          <MenuItem
            activeSection={activeSection}
            sectionObserve="Mailing"
            icon={<Mail className="icon" />}
            text="Mailing"
            handleScroll={handleScroll}>
            {/* Settings */}
            <MenuSubItem
              parent="Mailing"
              activeSection={activeSubSection}
              sectionObserve="sub-mailing-settings"
              text="Settings"
              icon={<Dot className="icon" />}
              handleScroll={handleScroll}
            />
            {/* Newsletter */}
            <MenuSubItem
              parent="Mailing"
              activeSection={activeSubSection}
              sectionObserve="sub-mailing-newsletter"
              text="Newsletter"
              icon={<Dot className="icon" />}
              handleScroll={handleScroll}
            />
          </MenuItem>
          <MenuItem
            activeSection={activeSection}
            sectionObserve="SaasMetrics"
            icon={<BarChart2 className="icon" />}
            text="Metrics"
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
      <div>
        <h3>
          Static pages <FilePenLine className="icon" />
        </h3>
        <ul className="text-left">
          <MenuItem
            activeSection={activeSection}
            icon={<Share2 className="icon" />}
            text="Social networks"
            sectionObserve="SocialNetworks"
            handleScroll={handleScroll}
          />
          <MenuItem
            activeSection={activeSection}
            icon={<Contact className="icon" />}
            text="Contact"
            sectionObserve="Contacts"
            handleScroll={handleScroll}
          />
          <MenuItem
            activeSection={activeSection}
            sectionObserve="ManageCategories"
            icon={<Receipt className="icon" />}
            text="GSC"
            handleScroll={handleScroll}
          />
          <MenuItem
            activeSection={activeSection}
            sectionObserve="ManageCategories"
            icon={<MousePointerClick className="icon" />}
            text="GCU"
            handleScroll={handleScroll}
          />
          <MenuItem
            activeSection={activeSection}
            sectionObserve="ManageCategories"
            icon={<Scale className="icon" />}
            text="Legal"
            handleScroll={handleScroll}
          />
          <MenuItem
            activeSection={activeSection}
            sectionObserve="ManageCategories"
            icon={<Cookie className="icon" />}
            text="Privacy"
            handleScroll={handleScroll}
          />
          <MenuItem
            activeSection={activeSection}
            sectionObserve="ManageCategories"
            icon={<MessageCircleQuestion className="icon" />}
            text="FAQ"
            handleScroll={handleScroll}
          />
        </ul>
      </div>
    </>
  );
};
export default AdminNavbar;