
type Props = {
  children: React.ReactNode;
  handleScroll: (e: any) => void;
  activeSection: string;
  sectionObserve: string;
};
export const MenuItem = ({
  children,
  handleScroll,
  activeSection,
  sectionObserve,
}: Props) => {
  return (
    <li
      className={activeSection === sectionObserve ? "active" : ""}
      onClick={() => handleScroll(sectionObserve)}>
      {children}
    </li>
  );
};
