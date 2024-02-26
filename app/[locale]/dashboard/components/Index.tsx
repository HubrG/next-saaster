"use client";

import { UserInterfaceMainWrapper } from "@/src/components/ui/user-interface/UserInterfaceMainWrapper";
import { UserInterfaceNavWrapper } from "@/src/components/ui/user-interface/UserInterfaceNavWrapper";
import { UserInterfaceWrapper } from "@/src/components/ui/user-interface/UserInterfaceWrapper";
import AdminMain from "../../admin/components/@subcomponents/Main";
import DashboardNavbar from "./@subcomponents/Navbar";

export const Index = () => {
  return (
    <div>
     <UserInterfaceWrapper>
      <UserInterfaceNavWrapper>
        <DashboardNavbar />
      </UserInterfaceNavWrapper>
      <UserInterfaceMainWrapper text="Dashboard">
        <AdminMain />
      </UserInterfaceMainWrapper>
    </UserInterfaceWrapper>
    </div>
  );
};
