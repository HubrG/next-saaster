"use client";
import { MenuItem } from "@/src/components/ui/user-interface/MenuItem";
import { useIntersectionObserver } from "@/src/hooks/useIntersectionObserver";
import useScrollToSection from "@/src/hooks/useScrollToSection";
import {
  Cog,
  Info,
  Languages,
  LayoutDashboard,
  Palette
} from "lucide-react";
import { useState } from "react";

export const DashboardNavbar = () => {
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
            icon={<Info className="icon" />}
            text="Profile"
            sectionObserve="Profile"
            handleScroll={handleScroll}
          />
          <MenuItem
            icon={<Palette className="icon" />}
            text="Account"
            activeSection={activeSection}
            sectionObserve="Account"
            handleScroll={handleScroll}></MenuItem>
          <MenuItem
            activeSection={activeSection}
            text="Billing"
            icon={<LayoutDashboard className="icon" />}
            sectionObserve="Billing"
            handleScroll={handleScroll}
          />
          <MenuItem
            activeSection={activeSection}
            icon={<Languages className="icon" />}
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
