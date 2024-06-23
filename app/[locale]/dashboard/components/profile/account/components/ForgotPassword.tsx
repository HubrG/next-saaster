"use client";
import { Goodline } from "@/src/components/ui/@aceternity/good-line";
import { ButtonWithLoader } from "@/src/components/ui/@fairysaas/button-with-loader";
import { toaster } from "@/src/components/ui/@fairysaas/toaster/ToastConfig";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Form } from "@/src/components/ui/form";
import { Field } from "@/src/components/ui/form-field";
import { sendEmail } from "@/src/helpers/emails/sendEmail";
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
        const send = await sendEmail({
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
    <Dialog open={open} defaultOpen={false} onOpenChange={setOpen}>
      <DialogTrigger className={`${className}`} asChild>
        <Button variant={"outline"} className={`${className}`}>{t("titleForgot")}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex flex-col gap-y-6">
          <DialogTitle>{t("titleForgot")}</DialogTitle>
          <Goodline />
          <DialogDescription>
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
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
