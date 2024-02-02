import React, { createContext, useContext, useState } from "react";

interface MenuContextType {
  expandedItems: { [key: string]: boolean };
  toggleItem: (id: string, isAuto?: boolean) => void;
}


interface MenuContextType {
  expandedItems: { [key: string]: boolean };
  autoExpandedItems: { [key: string]: boolean }; // Ajoutez ceci si nécessaire
  toggleItem: (id: string, isAuto?: boolean) => void;
  setExpandedItemsAutomatically: (id: string, isExpanded: boolean) => void; // Nouvelle fonction
  isItemExpandedManually: (id: string) => boolean;
  activeSec: string; // Ajoutez cette ligne
}

const defaultContextValue: MenuContextType = {
  expandedItems: {},
  autoExpandedItems: {},
  toggleItem: (id: string, isAuto?: boolean) => {
  },
  setExpandedItemsAutomatically: (id: string, isExpanded: boolean) => {
    // Implémentation par défaut vide
  },
  isItemExpandedManually: (id: string) => false, // Implémentation par défaut
  activeSec: "", // Ajoutez cette ligne
};
type ExpandedItems = {
  [key: string]: boolean;
};

export const MenuContext = createContext<MenuContextType>(defaultContextValue);

export const useMenu = () => useContext(MenuContext);

export const MenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [expandedItems, setExpandedItems] = useState<ExpandedItems>({});
  const [autoExpandedItems, setAutoExpandedItems] = useState<ExpandedItems>({});
  const [activeSec, setActiveSec] = useState<string>(""); // Assurez-vous d'initialiser activeSec

const toggleItem = (id: string) => {
  setExpandedItems((prev) => ({
    ...prev,
    [id]: !prev[id],
  }));
    console.log(id)
};
  // Définition de setExpandedItemsAutomatically
  const setExpandedItemsAutomatically = (id: string, isExpanded: boolean) => {
    setAutoExpandedItems((prev) => ({ ...prev, [id]: isExpanded }));
  };
  const updateActiveSec = (section: string) => {
    setActiveSec(section);
  };
  // Définition de isItemExpandedManually
  const isItemExpandedManually = (id: string) => {
    // Exemple d'implémentation retournant un booléen
    return !!expandedItems[id] && !autoExpandedItems[id];
  };

  const value = {
    expandedItems,
    autoExpandedItems,
    toggleItem,
    setExpandedItemsAutomatically,
    isItemExpandedManually, // Vérifiez que ceci retourne un booléen
    activeSec,
    updateActiveSec,
  };

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};
