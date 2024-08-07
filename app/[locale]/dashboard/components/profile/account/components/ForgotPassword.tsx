"use client";
import { Goodline } from "@/src/components/ui/@aceternity/good-line";
import { ButtonWithLoader } from "@/src/components/ui/@blitzinit/button-with-loader";
import { Credenza, CredenzaContent, CredenzaDescription, CredenzaHeader, CredenzaTitle, CredenzaTrigger } from "@/src/components/ui/@blitzinit/credenza";
import { toaster } from "@/src/components/ui/@blitzinit/toaster/ToastConfig";
import { Button } from "@/src/components/ui/@shadcn/button";
import { Form } from "@/src/components/ui/@shadcn/form";
import { Field } from "@/src/components/ui/@shadcn/form-field";
import { useSendEmail } from "@/src/hooks/@blitzinit/useSendEmail";
import { cn } from "@/src/lib/utils";
import { iUsers } from "@/src/types/db/iUsers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type ForgotPasswordProps = {
  className?: string;
  user?: iUsers;
};
type ApiResponse = {
  error?: string;
  message?: string;
  token?: string;
};
export const ForgotPassword = ({ className, user }: ForgotPasswordProps) => {
  const t = useTranslations("Dashboard.Components.Profile.Account.Components.ForgotPassword");
  const locale = useLocale();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const formSchema = z.object({
    email: z.string().email({
      message: t("form.email-error"),
    }),
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const { ...formData } = values;
    const response = await fetch("/api/forgot-password", {
      method: "POST",
      body: JSON.stringify({
        email: formData.email,
        locale,
      }),
    });
    const responseData: ApiResponse = await response.json();

    if (!responseData.error) {
      try {
        // Resend API (mail)
        const send = await useSendEmail({
          to: formData.email,
          type: "forgotPassword",
          subject: t("emailSent.subject"),
          vars: {
            forgotPassword: {
                verificationToken: responseData.token ?? "",
            },
          },
          tag_name: "category",
          tag_value: "forgot_password",
        });
        if (!send.error) {
          toaster({
            type: "success",
            duration: 5000,
            description: responseData.message,
          });
          setIsLoading(false);
        } else {
          toaster({
            type: "error",
            description: t("toasters.send-email-error"),
          });
        }
      } catch (error) {
        toaster({
          type: "error",
          description: t("toasters.send-email-error"),
        });
        setIsLoading(false);
      }
    } else {
      toaster({
        type: "success",
        description: responseData.error,
      });
      setIsLoading(false);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: (user && user.email) ?? "",
    },
  });

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger className={`${className}`} asChild>
        <Button variant={"outline"} className={`${className}`}>{t("titleForgot")}</Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader className="flex flex-col gap-y-6">
          <CredenzaTitle>{t("titleForgot")}</CredenzaTitle>
          <Goodline />
          <CredenzaDescription>
            <p className="mb-5">{t("description")}</p>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn("relative")}>
                <div className={cn("space-y-3 -mt-10 ")}>
                  <Field
                    type="email"
                    label={t("form.email")}
                    name="email"
                    form={form}
                  />
                  <Goodline className="!mt-10" />
                  <ButtonWithLoader
                    type="submit"
                    loading={isLoading}
                    disabled={isLoading || !form.formState.isValid}
                    className={cn({ disabled: isLoading }, "w-full !mt-10")}>
                    {t("form.submit")}
                  </ButtonWithLoader>
                </div>
              </form>
            </Form>
          </CredenzaDescription>
        </CredenzaHeader>
      </CredenzaContent>
    </Credenza>
  );
};
