"use client";
import React, { useState } from 'react';
import useIntersectionObserver from '@/src/hooks/useIntersectionObserver';
import useScrollToSection from '@/src/hooks/useScrollToSection';
import { AdminMenuItem } from './ui/AdminMenuItem';
import { BadgeDollarSign, Cog, FilePenLine, StickyNote } from 'lucide-react';

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
              Informations
            </AdminMenuItem>
            <AdminMenuItem
              activeSection={activeSection}
              sectionObserve="ThemeColorChange"
              handleScroll={handleScroll}>
              Thème
            </AdminMenuItem>
            <AdminMenuItem
              activeSection={activeSection}
              sectionObserve="Layout"
              handleScroll={handleScroll}>
              Layout
            </AdminMenuItem>
            <AdminMenuItem
              activeSection={activeSection}
              sectionObserve="testt"
              handleScroll={handleScroll}>
              Langues
            </AdminMenuItem>
            <li onClick={() => handleScroll("theme-section")}>APIs</li>
            <li onClick={() => handleScroll("theme-section")}>Réseaux</li>
            <li onClick={() => handleScroll("theme-section")}>
              Administrateurs
            </li>
          </ul>
        </div>
        <div>
          <h3>
            SaaS <BadgeDollarSign className="icon" />
          </h3>
          <ul>
            <li onClick={() => handleScroll("theme-section")}>Settings</li>
            <li onClick={() => handleScroll("theme-section")}>Offres</li>
            <li onClick={() => handleScroll("theme-section")}>Clients</li>
            <li onClick={() => handleScroll("theme-section")}>Abonnements</li>
          </ul>
        </div>
        <div>
          <h3>
            Blog <StickyNote className="icon" />
          </h3>
          <ul>
            <li onClick={() => handleScroll("theme-section")}>
              Créer un billet
            </li>
            <li onClick={() => handleScroll("theme-section")}>
              Voir les billets
            </li>
          </ul>
        </div>
        <div>
          <h3>
            Édition <FilePenLine className="icon" />
          </h3>
          <ul className="text-left">
            <li onClick={() => handleScroll("theme-section")}>CGV</li>
            <li onClick={() => handleScroll("theme-section")}>CGU</li>
            <li onClick={() => handleScroll("theme-section")}>
              Mentions légales
            </li>
            <li onClick={() => handleScroll("theme-section")}>
              Confidentialité
            </li>
            <li onClick={() => handleScroll("theme-section")}>FAQ</li>
          </ul>
        </div>
      </nav>
    </aside>
  );
};
