"use client";

import { updatePassword } from "@/app/[locale]/dashboard/queries/profile.action";
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
import { updateUser } from "@/src/helpers/db/users.action";
import { ReturnUserDependencyProps } from "@/src/helpers/dependencies/user-info";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import { handleError } from "@/src/lib/error-handling/handleError";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPen } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UserDialogProfilePicture } from "./UserDialogProfilePicture";

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .optional(), 
});
type UserDialogEditInfoProps = {
  userStore: ReturnUserDependencyProps["info"];
  setUpdate: (update: boolean) => void;
};
export const UserDialogEditInfo = ({
  userStore,
  setUpdate,
}: UserDialogEditInfoProps) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: userStore.name ?? "",
      email: userStore.email ?? "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof userSchema>) => {
    setLoading(true);

    const updateUserResponse = await updateUser({
      data,
      secret: chosenSecret(),
    });

    //   If password is not empty, update the password
    if (data.password) {
      const changePassword = await updatePassword({
        email: userStore.email ?? "",
        password: data.password,
      });
      if (handleError(changePassword).error) {
        toaster({
          type: "error",
          description: handleError(changePassword).message,
        });
        return;
      }
      form.reset({ ...data, password: "" });
    }

    if (handleError(updateUserResponse).error) {
      toaster({
        type: "error",
        description: handleError(updateUserResponse).message,
      });
    } else {
      toaster({
        type: "success",
        description: "Profile updated successfully",
      });
      setUpdate(true);
    }

    setLoading(false);
  };

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger>
        <Button className="w-full">
          <UserPen className="icon" /> Edit Profile
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Edit Profile</CredenzaTitle>
        </CredenzaHeader>
        <CredenzaContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
              {/* Form fields */}
              <UserDialogProfilePicture
                setUpdate={setUpdate}
                userStore={userStore}
              />
              <Field type="text" label="Name" name="name" form={form} />
              <Field type="email" label="Email" name="email" form={form} />
              <Field
                type="password"
                label="Password"
                name="password"
                description="Leave empty to keep the same password"
                form={form}
              />
              {/* Add other fields here */}
              <ButtonWithLoader loading={loading} type="submit">
                Update
              </ButtonWithLoader>
            </form>
          </Form>
        </CredenzaContent>
      </CredenzaContent>
    </Credenza>
  );
};
