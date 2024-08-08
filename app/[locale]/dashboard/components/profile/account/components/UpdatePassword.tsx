"use client";
import { updatePassword } from "@/app/[locale]/dashboard/queries/profile.action";
import { Goodline } from "@/src/components/ui/@aceternity/good-line";
import { ButtonWithLoader } from "@/src/components/ui/@blitzinit/button-with-loader";
import {
  Credenza,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/src/components/ui/@blitzinit/credenza";
import { toaster } from "@/src/components/ui/@blitzinit/toaster/ToastConfig";
import { Form } from "@/src/components/ui/@shadcn/form";
import { Field } from "@/src/components/ui/@shadcn/form-field";
import { handleError } from "@/src/lib/error-handling/handleError";
import { cn } from "@/src/lib/utils";
import { useUserStore } from "@/src/stores/userStore";
import { iUsers } from "@/src/types/db/iUsers";
import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyhole } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ForgotPassword } from "./ForgotPassword";
type UpdatePasswordProps = {
  className: string;
  user: iUsers;
};

export const UpdatePassword = ({ className, user }: UpdatePasswordProps) => {
  const t = useTranslations(
    "Dashboard.Components.Profile.Account.Components.UpdatePassword"
  );
  const [isLoading, setIsLoading] = useState(false);
  const { setUserStore } = useUserStore();
  const [open, setOpen] = useState(false);

  const formSchema = z
    .object({
      oldPassword: z.string().min(6, {
        message: t("form.password-error", { varIntlMin: 6 }),
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
          message: t("form.passwords-not-matching"),
          code: "custom",
        });
      }
    });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const { confirmPassword, ...formData } = values;
    const changePassword = await updatePassword({
      email: user.email ?? "",
      password: formData.password,
      oldPassword: formData.oldPassword,
      oldPasswordCrypted: user.password ?? "",
    });
    if (handleError(changePassword).error) {
      toaster({
        type: "error",
        description: handleError(changePassword).message,
      });
      setIsLoading(false);
      return;
    }
    toaster({
      type: "success",
      duration: 5000,
      description: t("toasters.password-updated"),
    });
    setUserStore({
      ...user,
      password: changePassword.data?.success?.password ?? null,
    });
    form.reset({
      oldPassword: "",
      password: "",
      confirmPassword: "",
    });
    setOpen(false);
    setIsLoading(false);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger>
        <span className={`${className} flex flex-row mt-5`}>
          <LockKeyhole className="icon mt-1" /> {t("title")}
        </span>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader className="flex flex-col gap-y-6">
          <CredenzaTitle>{t("title")}</CredenzaTitle>
          <Goodline />
          <CredenzaDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn("relative")}>
                <div className={cn("space-y-3 -mt-10 ")}>
                  <div className="flex flex-row  gap-2">
                    <Field
                      type="password"
                      className="w-full"
                      label={t("form.actual-password")}
                      name="oldPassword"
                      form={form}
                    />
                    <ForgotPassword user={user} className="mb-1" />
                  </div>
                  <Field
                    type="password"
                    label={t("form.new-password")}
                    name="password"
                    form={form}
                  />
                  <Field
                    type="password"
                    label={t("form.password-confirmation")}
                    name="confirmPassword"
                    form={form}
                  />
                  <Goodline className="!mt-10" />
                  <ButtonWithLoader
                    type="submit"
                    loading={isLoading}
                    disabled={isLoading || !form.formState.isValid}
                    className={cn(
                      { disabled: isLoading },
                      "w-full !mt-10 mb-0"
                    )}>
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
