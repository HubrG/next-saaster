import { Goodline } from "@/src/components/ui/@aceternity/good-line";
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
import { sendNotification } from "@/src/helpers/db/notifications.action";
import { ReturnUserDependencyProps } from "@/src/helpers/dependencies/user-info";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import { handleError } from "@/src/lib/error-handling/handleError";
import { cn } from "@/src/lib/utils";
import { useNotificationSettingsStore } from "@/src/stores/admin/notificationSettingsStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bell } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ManageNotificationType } from "../../../setup/notifications-settings/subcomponents/ManageNotificationType";

export const UserDialogSendNotification = ({
  user,
}: {
  user: ReturnUserDependencyProps;
}) => {
  const t = useTranslations("Admin.Components.UserDialogSendNotification");
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { notificationTypesStore } = useNotificationSettingsStore();
  const formSchema = z.object({
    notificationText: z.string().min(1, {
      message: "You must provide a notification text",
    }),
    // {{ edit_1 }}
    title: z.string().min(1, {
      message: "You must provide a title",
    }),
    type: z.string().cuid(),
    link: z.string().url().optional(),
    // {{ edit_1 }}
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const { notificationText, title, type, link } = values;
    const send = await sendNotification({
      userId: user.info.id,
      content: notificationText,
      title,
      link: link || "",
      type,
      read: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      secret: chosenSecret(),
    });

    if (handleError(send).error) {
      toaster({
        type: "error",
        description: "Error while sending notification",
      });
      setIsLoading(false);
      return;
    }

    toaster({
      type: "success",
      description: "Notification sent",
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
          <Bell className="icon" /> Send notification
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader className="flex flex-col gap-y-6">
          <CredenzaTitle>Send notification to {user.info.name}</CredenzaTitle>
          <Goodline />
          <CredenzaContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn("relative")}>
                <div className={cn("space-y-3 -mt-10 gap-10")}>
                  {/* {{ edit_2 }} */}
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
                    <ManageNotificationType  />
                  </div>
                  <Field type="text" label="Link to" name="link" form={form} />
                  {/* {{ edit_2 }} */}
                  <Field
                    type="textarea"
                    label="Notification text"
                    name="notificationText"
                    form={form}
                  />
                  <Goodline className="!mt-10" />
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
          </CredenzaContent>
        </CredenzaHeader>
      </CredenzaContent>
    </Credenza>
  );
};
