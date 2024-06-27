"use client";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/src/components/ui/sheet";
import { Menu } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../../button";
type Props = {
  children: React.ReactNode;
};
export const UserInterfaceNavWrapper = ({ children }: Props) => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {!isMobile ? (
        <aside className="user-inteface-aside">
          <nav>{children}</nav>
        </aside>
      ) : (
        <Sheet>
          <SheetTrigger
            className="md:hidden !sticky !bottom-0  w-full !shadow-2xl"
            asChild>
            <Button
              variant="default"
              className="!fixed !right-0 top-[50%] w-8 !h-10 z-50  !rounded-r-none">
              <Menu className="icon !-mr-1 mt-0.5" />
            </Button>
          </SheetTrigger>
          <SheetContent className="user-interface">
            <aside className="user-inteface-aside !block">
              <nav className="!block">{children}</nav>
            </aside>
          </SheetContent>
          <SheetClose />
        </Sheet>
      )}
    </>
  );
};
