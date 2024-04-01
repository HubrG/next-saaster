"use client";

import { UserInterfaceMainWrapper } from "@/src/components/ui/@fairysaas/user-interface/UserInterfaceMainWrapper";
import { UserInterfaceNavWrapper } from "@/src/components/ui/@fairysaas/user-interface/UserInterfaceNavWrapper";
import { UserInterfaceWrapper } from "@/src/components/ui/@fairysaas/user-interface/UserInterfaceWrapper";
import DashboardNavbar from "./Navbar";
import { DashboardProfile } from "./profile/DashboardProfile";
export const Index = () => {
  return (
    <UserInterfaceWrapper>
      <UserInterfaceNavWrapper>
        <DashboardNavbar />
      </UserInterfaceNavWrapper>
      <UserInterfaceMainWrapper text="Dashboard">
        <DashboardProfile />
      </UserInterfaceMainWrapper>
    </UserInterfaceWrapper>
  );
};
