"use client";
import { updatePassword } from "@/app/[locale]/dashboard/queries/profile.action";
import { Goodline } from "@/src/components/ui/@aceternity/good-line";
import { ButtonWithLoader } from "@/src/components/ui/@fairysaas/button-with-loader";
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
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { handleError } from "@/src/lib/error-handling/handleError";
import { cn } from "@/src/lib/utils";
import { useUserStore } from "@/src/stores/userStore";
import { iUsers } from "@/src/types/db/iUsers";
import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyhole } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ForgotPassword } from "./ForgotPassword";
type UpdatePasswordProps = {
  className: string;
  user: iUsers;
};
export const UpdatePassword = ({ className, user }: UpdatePasswordProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { setUserStore } = useUserStore();
  const [open, setOpen] = useState(false);

  const formSchema = z
    .object({
      oldPassword: z.string().min(6, {
        message: "Must be at least 6 characters.",
      }),
      password: z.string().min(6, {
        message: "Must be at least 6 characters.",
      }),
      confirmPassword: z.string().min(6, {
        message: "Must be at least 6 characters.",
      }),
    })
    .superRefine((data, ctx) => {
      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          path: ["confirmPassword"],
          message: "The passwords did not match.",
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
    toaster({ type: "success", duration:5000, description: "Password updated" });
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
    <Dialog open={open} defaultOpen={false} onOpenChange={setOpen}>
      <DialogTrigger>
        <span className={`${className} flex flex-row mt-5`}>
          <LockKeyhole className="icon mt-1" /> Update your password
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex flex-col gap-y-6">
          <DialogTitle>Update your password</DialogTitle>
          <Goodline />
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn("relative")}>
                <div className={cn("space-y-3 -mt-10 ")}>
                  <Field
                    type="password"
                    label="Actual password"
                    name="oldPassword"
                    form={form}>
                    <ForgotPassword className="button-in-input" user={user} />
                  </Field>
                  <Field
                    type="password"
                    label="New password"
                    name="password"
                    form={form}
                  />
                  <Field
                    type="password"
                    label="Confirm password"
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
                    Update password
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
