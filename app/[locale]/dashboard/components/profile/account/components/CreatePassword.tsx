"use client";
import { createPassword } from "@/app/[locale]/dashboard/queries/profile.action";
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
import { handleError } from "@/src/lib/error-handling/handleError";
import { cn } from "@/src/lib/utils";
import { useUserStore } from "@/src/stores/userStore";
import { iUsers } from "@/src/types/db/iUsers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type CreatePasswordProps = {
  className?: string;
  user: iUsers;
};
export const CreatePassword = ({ className, user }: CreatePasswordProps) => {
  const t = useTranslations("Dashboard.Components.Profile.Account.Components.CreatePassword");
  const [isLoading, setIsLoading] = useState(false);
  const { setUserStore } = useUserStore();
  const [open, setOpen] = useState(false);

  const formSchema = z
    .object({
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
    const changePassword = await createPassword({
      email: user.email ?? "",
      password: formData.password,
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
      description: t("toasters.succes-password-created"),
    });
    setUserStore({
      ...user,
      password: changePassword.data?.success?.password ?? null,
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
    <Dialog open={open} defaultOpen={false} onOpenChange={setOpen}>
      <DialogTrigger className="w-full">
        <Button className={className}>{t("title")}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex flex-col gap-y-6">
          <DialogTitle>{t("title")}</DialogTitle>
          <Goodline />
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn("relative")}>
                <div className={cn("space-y-3 -mt-10 ")}>
                  <Field
                    type="password"
                    label={t("form.password")}
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
