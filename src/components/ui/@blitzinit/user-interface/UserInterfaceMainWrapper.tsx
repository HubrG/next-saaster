import React from "react";
type Props = {
  children: React.ReactNode;
  text: string;
  icon?: React.ReactNode;
};

export const UserInterfaceMainWrapper = ({ children, icon, text }: Props) => {
  return (
    <>
      <div className="user-inteface-main">
        <div id="headerAdminNavbar"></div>
        <div className="user-inteface-main-content pt-10 !w-full">
          {children}
        </div>
      </div>
    </>
  );
};
