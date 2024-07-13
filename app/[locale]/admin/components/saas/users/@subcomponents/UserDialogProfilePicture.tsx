"use client";

import { ButtonWithLoader } from "@/src/components/ui/@fairysaas/button-with-loader";
import { toaster } from "@/src/components/ui/@fairysaas/toaster/ToastConfig";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/src/components/ui/avatar";
import { Form } from "@/src/components/ui/form";
import { Field } from "@/src/components/ui/form-field";
import { updateUser } from "@/src/helpers/db/users.action";
import { ReturnUserDependencyProps } from "@/src/helpers/dependencies/user";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import { handleError } from "@/src/lib/error-handling/handleError";
import { UploadFile } from "@/src/lib/storage.action";
import { cn } from "@/src/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { upperCase } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Tooltip } from "react-tooltip";
import { z } from "zod";

const formSchema = z.object({
  file: z.any(),
});

export const UserDialogProfilePicture = ({
  userStore,
  setUpdate,
}: {
  userStore: ReturnUserDependencyProps["info"];
  setUpdate: (update: boolean) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File>();
  //   const { userStore, setUserStore } = useUserStore();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file: undefined,
    },
  });

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = useCallback(async () => {
    console.log("onSubmit");
    setLoading(true);
    if (!file) {
      toaster({
        type: "error",
        description: "No file provided",
        duration: 5000,
      });
      setLoading(false);
      return;
    } else if (file.size < 1) {
      toaster({ type: "error", description: "File is empty", duration: 5000 });
      setLoading(false);
      return;
    } else if (file.size > 2097152) {
      // 2MB
      toaster({
        type: "error",
        description: "File is too large",
        duration: 5000,
      });
      setLoading(false);
      return;
    } else if (!file.type.includes("image")) {
      toaster({
        type: "error",
        description: "File is not an image",
        duration: 5000,
      });
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.set("file", file);
    const upload = await UploadFile({
      data,
      provider: "cloudinary",
      secret: chosenSecret(),
    });

    if (handleError(upload).error) {
      toaster({
        type: "error",
        description: handleError(upload).message,
      });
      setLoading(false);
      return;
    }

    const url = upload.data?.success;

    const updateUserPP = await updateUser({
      data: {
        email: userStore.email ?? "",
        image: url,
      },
      secret: chosenSecret(),
    });

    if (handleError(updateUserPP).error) {
      toaster({
        type: "error",
        description: handleError(updateUserPP).message,
      });
      setLoading(false);
      return;
    }

    toaster({
      type: "success",
      description: "Profile picture updated successfully",
    });
    setUpdate(true);

    // Reset the form after the file has been uploaded
    form.reset({ file });
    setLoading(false);
  }, [file, userStore, form]);
  useEffect(() => {
    // Only if file changes
    if (file) {
      onSubmit();
      setFile(undefined);
    }
  }, [file, onSubmit, loading]);
  return (
    <div className="w-full">
      <Avatar
        className="!no-underline h-36 w-36 mx-auto"
        data-tooltip-id={"changeAvatar" + userStore.id}>
        {userStore?.image && (
          <AvatarImage
            onClick={handleAvatarClick}
            src={userStore.image}
            className={cn(
              { "animate-pulse": loading },
              ` shadow-inner cursor-pointer`
            )}
            alt={userStore.name ?? "User avatar"}
          />
        )}
        <AvatarFallback
          onClick={handleAvatarClick}
          className={cn(
            { "animate-pulse": loading },
            "cursor-pointer shadow-inner"
          )}
          style={{ textDecoration: "transparent" }}>
          <span className="!no-underline text-5xl">
            {upperCase(
              userStore?.name
                ?.toString()
                .split(" ")
                .map((n) => n[0])
                .join("")
            )}
          </span>
        </AvatarFallback>
      </Avatar>
      <Tooltip
        id={"changeAvatar" + userStore.id}
        className="tooltip z-[99999]"
        opacity={100}
        place="top">
        Change profile picture
      </Tooltip>
      <Form {...form}>
        <form
          className="!hidden"
          onSubmit={form.handleSubmit(onSubmit)}
          encType="multipart/form-data">
          <Field
            type="file"
            accept="image/*"
            label="File"
            name="file"
            form={form}
            inputRef={fileInputRef}
            setFile={setFile}
          />
          <ButtonWithLoader
            loading={loading}
            disabled={loading || !form.formState.isValid}
            type="submit">
            Upload
          </ButtonWithLoader>
        </form>
      </Form>
    </div>
  );
};
