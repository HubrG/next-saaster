"use client";

import { ButtonWithLoader } from "@/src/components/ui/@fairysaas/button-with-loader";
import { Form } from "@/src/components/ui/form";
import { Field } from "@/src/components/ui/form-field";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { updateUser } from "@/src/helpers/db/users.action";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import { handleError } from "@/src/lib/error-handling/handleError";
import { UploadFile } from "@/src/lib/storage.action";
import { useUserStore } from "@/src/stores/userStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { upperCase } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Tooltip } from "react-tooltip";
import { z } from "zod";

export const ProfilePicture = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File>();
  const { userStore, setUserStore } = useUserStore();
  const [loading, setLoading] = useState(false);
  const formSchema = z.object({
    file: z.any(),
  });
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file: undefined,
    },
  });

  const onSubmit = useCallback(async () => {
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
        description: "File is too large (2MB maximum)",
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
    const response = await UploadFile({
      data,
      provider: "Cloudinary",
      secret: chosenSecret(),
    });
    if (handleError(response).error) {
      toaster({ type: "error", description: handleError(response).message });
      setLoading(false);
      return;
    }
    setUserStore({
      ...userStore,
      image: response.data?.success ?? userStore.image,
    });
    const updateUserPP = await updateUser({
      data: {
        email: userStore.email ?? "",
        image: response.data?.success,
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
      description: "File uploaded successfully",
    });
    // we reset the form after the file has been uploaded
    form.reset({ file });
    setLoading(false);
  }, [file, userStore, setUserStore, form]);
  useEffect(() => {
    // Only if file changes
    if (file) {
      onSubmit();
      setFile(undefined);
    }
  }, [file, onSubmit, loading]);
  return (
    <div className="w-full">
      <Avatar className="!no-underline">
        {userStore?.image && (
          <AvatarImage
            data-tooltip-id="change-avatar"
            onClick={handleAvatarClick}
            src={userStore.image}
            className="rounded-full w-24 h-24 mx-auto mt-20  cursor-pointer"
            alt={userStore.name ?? "User avatar"}
          />
        )}
        <AvatarFallback
          onClick={handleAvatarClick}
          className="!no-underline  cursor-pointer"
          data-tooltip-id="change-avatar"
          style={{ textDecoration: "transparent" }}>
          <span className="!no-underline">
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
      <Tooltip id="change-avatar" className="tooltip" place="top">
        Change avatar
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
