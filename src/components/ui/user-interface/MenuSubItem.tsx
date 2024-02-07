import { cn } from "@/src/lib/utils";
import { useUserInterfaceNavStore } from "@/src/stores/admin/userInterfaceNavStore";

type Props = {
  children?: React.ReactNode;
  handleScroll: (e: any) => void;
  activeSection: string;
  sectionObserve: string;
  icon?: React.ReactNode; // Prop pour l'icône
  text: string; // Prop pour le texte
  parent: string;
};
export const MenuSubItem = ({
  children,
  parent,
  handleScroll,
  activeSection,
  sectionObserve,
  icon,
  text,
}: Props) => {
  const { userInterfaceNav } = useUserInterfaceNavStore();
  const isParentOpen = userInterfaceNav[parent]?.open;
  const handleClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    event.stopPropagation(); // Empêche l'événement de se propager aux éléments parents
    handleScroll(sectionObserve);
  };

  return (
    <li
      data-parent={parent}
      className={cn(
        {
          subactive: activeSection === sectionObserve,
          "!hidden": !isParentOpen,
        },
        "subitem"
      )}
      onClick={handleClick}>
      {icon}
      {text}
      {children}
    </li>
  );
};
