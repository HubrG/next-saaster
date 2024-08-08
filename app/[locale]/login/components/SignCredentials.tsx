"use client";
import { ButtonWithLoader } from "@/src/components/ui/@blitzinit/button-with-loader";
import { Form } from "@/src/components/ui/@shadcn/form";
import { Field } from "@/src/components/ui/@shadcn/form-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ForgotPassword } from "../../dashboard/components/profile/account/components/ForgotPassword";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, {
    message: "Your password must be at least 6 characters.",
  }),
});

export default function Credentials() {
  const t = useTranslations("Login.Credentials");
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    const formData = values;
    await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: true,
    });
    setIsLoading(false)
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 -mt-10">
        <Field
          type="email"
          label={t("form.email")}
          name="email"
          placeholder={t("form.email")}
          form={form}
        />
        <div className="flex flex-row  gap-2">
          <Field
            type="password"
            label={t("form.password")}
            className="w-full"
            name="password"
            placeholder={t("form.password")}
            form={form}
          />
          <ForgotPassword className=" self-end mb-1 !-mt-6" />
        </div>
        <ButtonWithLoader
          loading={isLoading}
          disabled={isLoading}
          type="submit"
          className="w-full">
          {t("form.login-with-email")}
        </ButtonWithLoader>
      </form>
    </Form>
  );
}
