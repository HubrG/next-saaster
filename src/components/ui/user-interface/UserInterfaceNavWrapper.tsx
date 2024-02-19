import React from "react";
type Props = {
  children: React.ReactNode;
};
export const UserInterfaceNavWrapper = ({ children }: Props) => {
  return (
    <aside className="user-inteface-aside">
      <nav>{children}</nav>
    </aside>
  );
};
