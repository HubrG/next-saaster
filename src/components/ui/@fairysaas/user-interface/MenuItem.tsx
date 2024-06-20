import { useUserInterfaceNavStore } from "@/src/stores/userInterfaceNavStore";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useEffect } from "react";

interface Props {
  children?: React.ReactNode;
  handleScroll?: (section: string) => void;
  activeSection: string;
  sectionObserve: string;
  text: string;
  icon: React.ReactNode;
}

export const MenuItem = ({
  children,
  handleScroll,
  activeSection,
  sectionObserve,
  text,
  icon,
}: Props) => {
  const {
    userInterfaceNav,
    toggleItemOpen,
    setForceOpen,
    openItem,
    closeItem,
    setUserInterfaceNav,
  } = useUserInterfaceNavStore();

  useEffect(() => {
    // Initialiser l'état de la section si elle n'existe pas
    if (!userInterfaceNav[sectionObserve]) {
      setUserInterfaceNav(sectionObserve, undefined, true, true);
    }
  }, [sectionObserve, setUserInterfaceNav, userInterfaceNav]);

  const handleClick = () => {
    toggleItemOpen(sectionObserve);
    const willBeOpen = !(userInterfaceNav[sectionObserve]?.open ?? false);
    setForceOpen(sectionObserve, willBeOpen);
    handleScroll && handleScroll(sectionObserve);
  };

  useEffect(() => {
    if (
      sectionObserve === activeSection &&
      !userInterfaceNav[sectionObserve]?.open
    ) {
      openItem(sectionObserve);
    } else if (
      sectionObserve !== activeSection &&
      userInterfaceNav[sectionObserve]?.open
    ) {
      closeItem(sectionObserve);
    }
  }, [activeSection, sectionObserve, openItem, closeItem, userInterfaceNav]);

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
            transition={{ duration: 0.2, delay: 0 }}>
            {children}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
};
