"use client";

import { UserInterfaceMainWrapper } from "@/src/components/ui/user-interface/UserInterfaceMainWrapper";
import { UserInterfaceNavWrapper } from "@/src/components/ui/user-interface/UserInterfaceNavWrapper";
import { UserInterfaceWrapper } from "@/src/components/ui/user-interface/UserInterfaceWrapper";
import AdminMain from "../../admin/components/@subcomponents/Main";
import AdminNavbar from "../../admin/components/@subcomponents/Navbar";

export const Index = () => {
  return (
    <div>
     <UserInterfaceWrapper>
      <UserInterfaceNavWrapper>
        <AdminNavbar />
      </UserInterfaceNavWrapper>
      <UserInterfaceMainWrapper text="Dashboard">
        <AdminMain />
      </UserInterfaceMainWrapper>
    </UserInterfaceWrapper>
    </div>
  );
};
