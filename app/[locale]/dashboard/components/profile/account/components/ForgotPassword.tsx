"use client";
import { Goodline } from "@/src/components/ui/@aceternity/good-line";
import { ButtonWithLoader } from "@/src/components/ui/@fairysaas/button-with-loader";
import { toaster } from "@/src/components/ui/@fairysaas/toaster/ToastConfig";
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
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const formSchema = z.object({
    email: z.string().email({
      message: "Must be at least 6 characters.",
    }),
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const { ...formData } = values;
    const response = await fetch("/api/forgot-password", {
      method: "POST",
      body: JSON.stringify({
        email: formData.email,
      }),
    });
    const responseData: ApiResponse = await response.json();

    if (!responseData.error) {
      try {
        // Resend API (mail)
        const send = await sendEmail({
          to: formData.email,
          type: "forgotPassword",
          subject: "Reset your password",
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
            description: responseData.message,
          });
          setIsLoading(false);
        } else {
          toaster({
            type: "error",
            description:
              "An error occurred while sending the email. Please try again.",
          });
        }
      } catch (error) {
        toaster({
          type: "error",
          description:
            "An error occurred while sending the email. Please try again.",
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
      <DialogTrigger>
        <div
          className={`${className}`}>
          Forgot password ?
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex flex-col gap-y-6">
          <DialogTitle>Forgot password</DialogTitle>
          <Goodline />
          <DialogDescription>
            <p className="mb-5">
              Enter your email address and we&apos;ll send you a link to reset
              your password.
            </p>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn("relative")}>
                <div className={cn("space-y-3 -mt-10 ")}>
                  <Field
                    type="email"
                    label="Your email"
                    name="email"
                    form={form}
                  />
                  <Goodline className="!mt-10" />
                  <ButtonWithLoader
                    type="submit"
                    loading={isLoading}
                    disabled={isLoading || !form.formState.isValid}
                    className={cn({ disabled: isLoading }, "w-full !mt-10")}>
                    Send me a reset link
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
