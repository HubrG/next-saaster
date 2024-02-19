import { Index } from "@/app/[locale]/register/components/Index";
import { Suspense } from "react";

export default async function RegisterPage() {
  return (
    <div className="w-full  md:h-screen h-auto flex justify-center items-center">
      <Suspense>
        <Index />
      </Suspense>
    </div>
  );
}
