import { ButtonWithLoader } from "@/src/components/ui/@blitzinit/button-with-loader";
import {
  Credenza,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/src/components/ui/@blitzinit/credenza";
import { toaster } from "@/src/components/ui/@blitzinit/toaster/ToastConfig";
import { Button } from "@/src/components/ui/@shadcn/button";
import { Form } from "@/src/components/ui/@shadcn/form";
import { Field } from "@/src/components/ui/@shadcn/form-field";
import { sendNotificationForAllUsers } from "@/src/helpers/db/notifications.action";
import { handleError } from "@/src/lib/error-handling/handleError";
import { cn } from "@/src/lib/utils";
import { useNotificationSettingsStore } from "@/src/stores/admin/notificationSettingsStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ManageNotificationType } from "../../../setup/notifications-settings/subcomponents/ManageNotificationType";

export const SendNotificationToAllUsers = () => {
  const t = useTranslations("Admin.Components.SendNotificationToAllUsers");
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { notificationTypesStore } = useNotificationSettingsStore();

  const formSchema = z.object({
    notificationText: z.string().min(1, {
      message: "You must provide a notification text",
    }),
    title: z.string().min(1, {
      message: "You must provide a title",
    }),
    type: z.string().cuid(),
    link: z.string().url().optional(),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const { notificationText, title, type, link } = values;
    const send = await sendNotificationForAllUsers({
      content: notificationText,
      title,
      link: link || "",
      type,
      read: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      secret: "votre_secret_ici",
    });

    if (handleError(send).error) {
      toaster({
        type: "error",
        description: "Error sending notification",
      });
      setIsLoading(false);
      return;
    }

    toaster({
      type: "success",
      description: "Notification sent successfully",
    });
    setOpen(false);
    setIsLoading(false);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notificationText: "",
    },
  });

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger className="w-full">
        <Button className="w-full">
          <Users className="icon" /> Send notification to all users
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader className="flex flex-col gap-y-6">
          <CredenzaTitle>
            Send a notification to all users
          </CredenzaTitle>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className={cn("relative")}>
              <div className={cn("space-y-3 -mt-10 gap-10")}>
                <Field
                  type="text"
                  label="Notification title"
                  name="title"
                  form={form}
                />
                <div className="grid grid-cols-2 items-center gap-5">
                  <Field
                    type="select"
                    className=""
                    label="Notification type"
                    name="type"
                    form={form}
                    selectOptions={notificationTypesStore.map((type) => ({
                      label: type.name,
                      value: type.id,
                    }))}
                  />
                  <ManageNotificationType />
                </div>
                <Field type="text" label="Link to.." name="link" form={form} />
                <Field
                  type="textarea"
                  label="Notification text"
                  name="notificationText"
                  form={form}
                />
                <ButtonWithLoader
                  type="submit"
                  loading={isLoading}
                  disabled={isLoading || !form.formState.isValid}
                  className={cn({ disabled: isLoading }, "w-full !mt-10")}>
                  Send
                </ButtonWithLoader>
              </div>
            </form>
          </Form>
        </CredenzaHeader>
      </CredenzaContent>
    </Credenza>
  );
};
