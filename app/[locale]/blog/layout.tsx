import { DivFullScreenGradient } from "@/src/components/ui/@fairysaas/layout-elements/gradient-background";
import { ReactNode } from "react";
import SideBar from "./@components/SideBar";

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <DivFullScreenGradient gradient="gradient-to-tl" />
      <div className="min-h-screen flex flex-col">
        <div className="flex md:flex-row flex-col min-h-screen items-start justify-between w-full gap-5">
          <div className="w-full">{children}</div>
          <div className="sticky top-24 md:w-2/6 w-full">
            <SideBar />
          </div>
        </div>
      </div>
    </>
  );
}
