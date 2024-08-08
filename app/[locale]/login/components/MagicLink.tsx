import { Button } from "@/src/components/ui/@shadcn/button";
import { Input } from "@/src/components/ui/@shadcn/input";
import { Label } from "@/src/components/ui/@shadcn/label";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import React from "react";

export const MagicLink = () => {
  const t = useTranslations("Login.MagicLink");
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    signIn("email", { email });
  };
  return (
    <form className="space-y-4 w-full md:space-y-6" onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="email">{t('form.your-email')}</Label>
        <Input name="email" type="email" id="email" placeholder={t('form.placeholder-email') + "@gmail.com"} />
      </div>

      <Button type="submit">{t('form.submit')}</Button>
    </form>
  );
};
