import { DivFullScreenGradient } from "@/src/components/ui/@blitzinit/layout-elements/gradient-background";
import { ReactNode } from "react";
import SideBar from "./@components/SideBar";

interface LayoutProps {
  children: ReactNode;
  components: ReactNode;
}

export default function BlogLayout({ children, components }: LayoutProps) {
  return (
    <>
      <DivFullScreenGradient gradient="gradient-to-bl" />
      <div className="min-h-screen flex flex-col mx-auto">
        <div className="flex md:flex-row flex-col min-h-screen items-start justify-between  w-10/12 mx-auto gap-5">
          <div className="w-full">{children}</div>
          <div className="sticky top-24 mt-12 md:w-2/6 w-full">
            <SideBar />
          </div>
        </div>
      </div>
    </>
  );
}
