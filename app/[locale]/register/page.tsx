import { RegisterForm } from "@/src/components/pages/register/RegisterForm";
import { Suspense } from "react";

export default async function RegisterPage() {
  return (
    <div className="w-full  md:h-screen h-auto flex justify-center items-center">
      <Suspense>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
