"use client";
import { MenuItem } from "@/src/components/ui/user-interface/MenuItem";
import useIntersectionObserver from "@/src/hooks/useIntersectionObserver";
import useScrollToSection from "@/src/hooks/useScrollToSection";
import {
  BadgeDollarSign,
  BarChart2,
  Cable,
  Cog,
  Coins,
  Contact2,
  Cookie,
  FilePenLine,
  Hash,
  Info,
  Languages,
  LayoutDashboard,
  MessageCircleQuestion,
  MousePointerClick,
  Palette,
  Receipt,
  RefreshCcw,
  Rss,
  Scale,
  Settings2,
  SquarePen,
  UserCheck,
  View,
} from "lucide-react";
import { useState } from "react";

export const AdminNavbar = () => {
  const [activeSection, setActiveSection] = useState("");

  useIntersectionObserver(setActiveSection, {
    rootMargin: "-50% 0px -50% 0px",
    targetClass: ".admin-section",
  });

  const handleScroll = useScrollToSection();

  return (
    <aside>
      <nav>
        <div>
          <h3>
            Setup
            <Cog className="icon" />
          </h3>
          <ul>
            <MenuItem
              activeSection={activeSection}
              sectionObserve="InfosApp"
              handleScroll={handleScroll}>
              <Info className="icon" /> Info
            </MenuItem>
            <MenuItem
              activeSection={activeSection}
              sectionObserve="Design"
              handleScroll={handleScroll}>
              <Palette className="icon" /> Design
            </MenuItem>
            <MenuItem
              activeSection={activeSection}
              sectionObserve="Layout"
              handleScroll={handleScroll}>
              <LayoutDashboard className="icon" /> Layout
            </MenuItem>
            <MenuItem
              activeSection={activeSection}
              sectionObserve="testt"
              handleScroll={handleScroll}>
              <Languages className="icon" /> Langs
            </MenuItem>
            <li onClick={() => handleScroll("theme-section")}>
              <Cable className="icon" /> APIs
            </li>
            <li onClick={() => handleScroll("theme-section")}>
              <Hash className="icon" /> Networks
            </li>
            <li onClick={() => handleScroll("theme-section")}>
              <UserCheck className="icon" /> Administrators
            </li>
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
              handleScroll={handleScroll}>
              <Settings2 className="icon" /> Settings
            </MenuItem>
            <MenuItem
              activeSection={activeSection}
              sectionObserve="Pricing"
              handleScroll={handleScroll}>
              <Coins className="icon" /> Pricing
            </MenuItem>
            <li onClick={() => handleScroll("theme-section")}>
              <Contact2 className="icon" /> Customers
            </li>
            <li onClick={() => handleScroll("theme-section")}>
              <RefreshCcw className="icon" /> Subscriptions
            </li>
            <li onClick={() => handleScroll("theme-section")}>
              <BarChart2 className="icon" /> Metrics
            </li>
          </ul>
        </div>
        <div>
          <h3>
            Blog <Rss className="icon" />
          </h3>
          <ul>
            <li onClick={() => handleScroll("theme-section")}>
              <SquarePen className="icon" /> Create a post
            </li>
            <li onClick={() => handleScroll("theme-section")}>
              <View className="icon" /> View posts
            </li>
          </ul>
        </div>
        <div>
          <h3>
            Édition <FilePenLine className="icon" />
          </h3>
          <ul className="text-left">
            <li onClick={() => handleScroll("theme-section")}>
              <Receipt className="icon" /> GSC
            </li>
            <li onClick={() => handleScroll("theme-section")}>
              <MousePointerClick className="icon" /> GCU
            </li>
            <li onClick={() => handleScroll("theme-section")}>
              <Scale className="icon" /> Legal
            </li>
            <li onClick={() => handleScroll("theme-section")}>
              <Cookie className="icon" /> Privacy
            </li>
            <li onClick={() => handleScroll("theme-section")}>
              <MessageCircleQuestion className="icon" /> FAQ
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
};
