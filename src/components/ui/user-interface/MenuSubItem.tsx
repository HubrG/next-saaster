import { cn } from "@/src/lib/utils";

type Props = {
  children?: React.ReactNode;
  handleScroll: (e: any) => void;
  activeSection: string;
  sectionObserve: string;
  icon?: React.ReactNode; // Prop pour l'icône
  text: string; // Prop pour le texte
};
export const MenuSubItem = ({
  children,
  handleScroll,
  activeSection,
  sectionObserve,
  icon,
  text
}: Props) => {
  return (
    <li
      className={cn({ subactive: activeSection === sectionObserve }, "subitem")}
      onClick={() => handleScroll(sectionObserve)}>
      {icon}
      {text}
      {children && children}
    </li>
  );
};
