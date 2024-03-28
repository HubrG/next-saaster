"use client";

import { ButtonWithLoader } from "@/src/components/ui/@fairysaas/button-with-loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { Form } from "@/src/components/ui/form";
import { Field } from "@/src/components/ui/form-field";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { updateUser } from "@/src/helpers/db/users.action";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import { handleError } from "@/src/lib/error-handling/handleError";
import { cn } from "@/src/lib/utils";
import { useUserStore } from "@/src/stores/userStore";
import { zodResolver } from "@hookform/resolvers/zod";

import { upperCase } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Tooltip } from "react-tooltip";
import { z } from "zod";
type ApiResponse = {
  error?: string;
  success?: string;
  json?: () => Promise<any>;
};
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
    data.set("provider", "Cloudinary");
    data.set("secret", chosenSecret());
    const response: ApiResponse = (await fetch("/api/upload", {
      method: "POST",
      body: data,
    })) as unknown as { success: string; data: { success: string } };

    if (response.error) {
      toaster({ type: "error", description: response.error });
      setLoading(false);
      return;
    }
    if (response.json) {
      const responseBody = await response.json();
      setUserStore({
        ...userStore,
        image: responseBody.success ?? userStore.image,
      });
      const updateUserPP = await updateUser({
        data: {
          email: userStore.email ?? "",
          image: responseBody.success,
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
    }
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
      <Avatar className="!no-underline h-36 w-36 mx-auto mt-20">
        {userStore?.image && (
          <AvatarImage
            data-tooltip-id="change-avatar"
            onClick={handleAvatarClick}
            src={userStore.image}
            className={cn(
              { "animate-pulse": loading },
              `rounded-full mx-auto cursor-pointer`
            )}
            alt={userStore.name ?? "User avatar"}
          />
        )}
        <AvatarFallback
          onClick={handleAvatarClick}
          className={cn({ "animate-pulse": loading }, "cursor-pointer")}
          data-tooltip-id="change-avatar"
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
