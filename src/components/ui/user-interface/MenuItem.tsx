type Props = {
  children?: React.ReactNode;
  handleScroll: (e: any) => void;
  activeSection: string;
  sectionObserve: string;
  icon?: React.ReactNode; // Prop pour l'icône
  text: string; // Prop pour le texte
};
export const MenuItem = ({
  children,
  handleScroll,
  activeSection,
  sectionObserve,
  text,
  icon
}: Props) => {
  return (
    <li
      className={activeSection === sectionObserve ? "active" : ""}
      onClick={() => { handleScroll(sectionObserve); }}>
      <div>{icon}{text}</div>
      {children && <ul>{children}</ul>}
    </li>
  );
};
