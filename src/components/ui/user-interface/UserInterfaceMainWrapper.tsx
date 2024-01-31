import React from "react";
import { Separator } from "../separator";
type Props = {
  children: React.ReactNode;
    text: string;
};
export const UserInterfaceMainWrapper = ({ children, text }: Props) => {
  return (
    <div className="user-inteface-main">
      <div id="headerAdminNavbar">
        <h1>{text}</h1>
        <Separator className="separator" />
      </div>
      <div className="user-inteface-main-content">{children} </div>
    </div>
  );
};
