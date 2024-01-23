"use client";
import React, { useState } from "react";
import useIntersectionObserver from "@/src/hooks/useIntersectionObserver";
import useScrollToSection from "@/src/hooks/useScrollToSection";
import { AdminMenuItem } from "./ui/AdminMenuItem";
import {
  BadgeDollarSign,
  Cable,
  Cog,
  Contact2,
  Cookie,
  FilePenLine,
  Gift,
  Hash,
  Languages,
  LayoutDashboard,
  MessageCircleQuestion,
  MousePointerClick,
  Palette,
  Receipt,
  RefreshCcw,
  Scale,
  Settings2,
  SquarePen,
  StickyNote,
  UserCheck,
  View,
} from "lucide-react";
import { Info } from "lucide-react";

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
            <AdminMenuItem
              activeSection={activeSection}
              sectionObserve="InfosApp"
              handleScroll={handleScroll}>
              <Info className="icon" /> Informations
            </AdminMenuItem>
            <AdminMenuItem
              activeSection={activeSection}
              sectionObserve="ThemeColorChange"
              handleScroll={handleScroll}>
              <Palette className="icon" /> Thème
            </AdminMenuItem>
            <AdminMenuItem
              activeSection={activeSection}
              sectionObserve="Layout"
              handleScroll={handleScroll}>
              <LayoutDashboard className="icon" /> Layout
            </AdminMenuItem>
            <AdminMenuItem
              activeSection={activeSection}
              sectionObserve="testt"
              handleScroll={handleScroll}>
              <Languages className="icon" /> Langues
            </AdminMenuItem>
            <li onClick={() => handleScroll("theme-section")}>
              <Cable className="icon" /> APIs
            </li>
            <li onClick={() => handleScroll("theme-section")}>
              <Hash className="icon" /> Réseaux
            </li>
            <li onClick={() => handleScroll("theme-section")}>
              <UserCheck className="icon" /> Administrateurs
            </li>
          </ul>
        </div>
        <div>
          <h3>
            SaaS <BadgeDollarSign className="icon" />
          </h3>
          <ul>
            <li onClick={() => handleScroll("theme-section")}>
              <Settings2 className="icon" /> Settings
            </li>
            <li onClick={() => handleScroll("theme-section")}>
              <Gift className="icon" /> Offres
            </li>
            <li onClick={() => handleScroll("theme-section")}>
              <Contact2 className="icon" /> Clients
            </li>
            <li onClick={() => handleScroll("theme-section")}>
              <RefreshCcw className="icon" /> Abonnements
            </li>
          </ul>
        </div>
        <div>
          <h3>
            Blog <StickyNote className="icon" />
          </h3>
          <ul>
            <li onClick={() => handleScroll("theme-section")}>
              <SquarePen className="icon" /> Créer un billet
            </li>
            <li onClick={() => handleScroll("theme-section")}>
              <View className="icon" /> Voir les billets
            </li>
          </ul>
        </div>
        <div>
          <h3>
            Édition <FilePenLine className="icon" />
          </h3>
          <ul className="text-left">
            <li onClick={() => handleScroll("theme-section")}>
              <Receipt className="icon" /> CGV
            </li>
            <li onClick={() => handleScroll("theme-section")}>
              <MousePointerClick className="icon" /> CGU
            </li>
            <li onClick={() => handleScroll("theme-section")}>
              <Scale className="icon" /> Mentions légales
            </li>
            <li onClick={() => handleScroll("theme-section")}>
              <Cookie className="icon" /> Confidentialité
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
