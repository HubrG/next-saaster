import React from "react";

type Props = {
  children: React.ReactNode;
  id?: string;
  sectionName?: string;
  className?: string;
};
export const UserInterfaceWrapper = ({children} : Props) => {
    return <div className="grid grid-cols-12 md:gap-5 gap-0">{children}</div>;
};
