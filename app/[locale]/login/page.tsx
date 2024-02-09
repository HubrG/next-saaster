import { LoginForm } from "@/src/components/features/pages/login/LoginForm";
import React, { Suspense } from "react";

export default async function LoginPage() {
  return (
    <section>
      <Suspense>
      <LoginForm />
      </Suspense>
    </section>
  );
}
