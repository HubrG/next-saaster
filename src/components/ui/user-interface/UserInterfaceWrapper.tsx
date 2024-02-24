import React from "react";

type Props = {
  children: React.ReactNode;
  id?: string;
  sectionName?: string;
  className?: string;
};
export const UserInterfaceWrapper = ({ children }: Props) => {
  return <div className="user-interface">{children}</div>;
};
