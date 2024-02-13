"use client";
import { AnimatePresence, motion } from "framer-motion";

import useScrollDetect from "@/src/hooks/useScrollDetection";
import { useUserInterfaceNavStore } from "@/src/stores/userInterfaceNavStore";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useEffect } from "react";

type Props = {
  children?: React.ReactNode;
  handleScroll: (e: any) => void;
  activeSection: string;
  sectionObserve: string;
  icon?: React.ReactNode; // Prop pour l'icône
  text: string; // Prop pour le texte
  setOpen?: React.Dispatch<React.SetStateAction<string[]>>;
};
export const MenuItem = ({
  children,
  handleScroll,
  activeSection,
  sectionObserve,
  text,
  icon,
}: Props) => {
  // Gérer le clic pour basculer l'état open
  const {
    userInterfaceNav,
    toggleItemOpen,
    setForceOpen,
    openItem,
    closeItem,
  } = useUserInterfaceNavStore();

  const handleClick = () => {
    toggleItemOpen(sectionObserve);
    const willBeOpen = !(userInterfaceNav[sectionObserve]?.open ?? false); // État prévu après basculement
    if (willBeOpen) {
      setForceOpen(sectionObserve, true);
    } else {
      setForceOpen(sectionObserve, false);
    }
    handleScroll(sectionObserve);
  };

  const isScrolling = useScrollDetect();
  useEffect(() => {
    if (sectionObserve === activeSection) {
      if (!isScrolling) {
        openItem(sectionObserve);
      }
    } else if (!userInterfaceNav[sectionObserve]?.forceOpen) {
      closeItem(sectionObserve);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection, sectionObserve, openItem, closeItem, isScrolling]);

  return (
    <li
      className={activeSection === sectionObserve ? "active" : ""}
      onClick={handleClick}>
      <div>
        <span>
          {icon}
          {text}
        </span>
        {children && (
          <>
            {!userInterfaceNav[sectionObserve]?.open ? (
              <ChevronRight className="icon !justify-self-end" />
            ) : (
              <ChevronDown className="icon !justify-self-end" />
            )}
          </>
        )}
      </div>
      <AnimatePresence>
        {userInterfaceNav[sectionObserve]?.open && children && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, delay:0 }}
            >
            {children}
          </motion.ul>
        )}
      </AnimatePresence>{" "}
    </li>
  );
};

