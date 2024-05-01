"use client";
import { ButtonWithLoader } from "@/src/components/ui/@fairysaas/button-with-loader";
import { SimpleLoader } from "@/src/components/ui/@fairysaas/loader";
import { toaster } from "@/src/components/ui/@fairysaas/toaster/ToastConfig";
import { Form } from "@/src/components/ui/form";
import { Field } from "@/src/components/ui/form-field";
import { sendEmail } from "@/src/helpers/emails/sendEmail";
import { useRouter } from "@/src/lib/intl/navigation";
import { cn } from "@/src/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type ApiResponse = {
  error?: string;
  message?: string;
  token?: string;
};
export default function Credentials() {
  const t = useTranslations("Register.SignUpWithCredentials");
  const locale = useLocale();
  const router = useRouter();
  const formSchema = z
    .object({
      email: z.string().email({
        message: t("form.email-error"),
      }),
      password: z.string().min(6, {
        message: t("form.password-error", { varIntlMin: 6 }),
      }),
      confirmPassword: z.string().min(6, {
        message: t("form.password-error", { varIntlMin: 6 }),
      }),
    })
    .superRefine((data, ctx) => {
      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          path: ["confirmPassword"],
          message: t("form.password-did-not-match"),
          code: "custom",
        });
      }
    });
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const { confirmPassword, ...formData } = values;
    const response = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({
        locale,
        email: formData.email,
        password: formData.password,
      }),
    });
    const responseData: ApiResponse = await response.json();
    if (response.ok) {
      try {
        // Resend API (mail)
        await sendEmail({
          to: formData.email,
          type: "verifyEmail",
          subject: t("emailSent.subject"),
          vars: {
            verifyEmail: {
              verificationToken: responseData.token ?? "",
            },
          },
          tag_name: "category",
          tag_value: "confirm_email",
        });
      } catch (error) {
        console.error("Error sending email", error);
      }
      //
      toaster({
        type: "success",
        description: responseData.message,
        duration: 5000,
      });
      setIsLoading(false);
      router.push("/login");
    } else {
      setIsLoading(false);
      toaster({ type: "error", description: responseData.error });
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={cn("relative")}>
          <SimpleLoader
            className={cn(
              { hidden: !isLoading },
              "!absolute top-[45%] left-[45%]"
            )}
          />
          <div className={cn({ "blur-md": isLoading }, "space-y-3 -mt-10 ")}>
            <Field
              type="email"
              label={t("form.email")}
              name="email"
              placeholder={t("form.email")}
              form={form}
            />
            <Field
              type="password"
              label={t("form.password")}
              name="password"
              placeholder={t("form.password")}
              form={form}
            />
            <Field
              type="password"
              label={t("form.confirm-password")}
              name="confirmPassword"
              placeholder={t("form.confirm-password")}
              form={form}
            />
            <ButtonWithLoader
              type="submit"
              disabled={isLoading}
              className={cn({ disabled: isLoading }, "w-full")}>
              {t("form.register-with-email")}
            </ButtonWithLoader>
          </div>
        </form>
      </Form>
    </>
  );
}
