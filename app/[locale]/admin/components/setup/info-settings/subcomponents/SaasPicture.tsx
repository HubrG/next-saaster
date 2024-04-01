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
import { updateAppSettings } from "@/src/helpers/db/appSettings.action";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import { handleError } from "@/src/lib/error-handling/handleError";
import { UploadFile } from "@/src/lib/storage.action";
import { cn } from "@/src/lib/utils";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { upperCase } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Tooltip } from "react-tooltip";
import { z } from "zod";

export const SaasPicture = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File>();
  const { appSettings, setAppSettings } = useAppSettingsStore();
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
    setAppSettings({
      ...appSettings,
      image: url ?? appSettings.image,
    });
    const updateAppPP = await updateAppSettings({
      data: {
        image: url,
      },
      secret: chosenSecret(),
    });
    if (handleError(updateAppPP).error) {
      toaster({
        type: "error",
        description: handleError(updateAppPP).message,
      });
      setLoading(false);
      return;
    }
    toaster({
      type: "success",
      description: "File uploaded successfully",
    });

    form.reset({ file });
    setLoading(false);
  }, [file, appSettings, setAppSettings, form]);
  // 
  useEffect(() => {
    // Only if file changes
    if (file) {
      onSubmit();
      setFile(undefined);
    }
  }, [file, onSubmit, loading]);
  return (
    <div className="w-full flex justify-center items-center">
      <Avatar className="!no-underline  h-52 w-52 mx-auto ">
        {appSettings?.image && (
          <AvatarImage
            data-tooltip-id="change-avatar"
            onClick={handleAvatarClick}
            src={appSettings.image}
            className={cn(
              { "animate-pulse": loading },
              ` rounded cursor-pointer`
            )}
            alt={appSettings.name ?? "User avatar"}
          />
        )}
        <AvatarFallback
          onClick={handleAvatarClick}
          className={cn({ "animate-pulse": loading }, ` cursor-pointer`)}
          data-tooltip-id="change-avatar"
          style={{ textDecoration: "transparent" }}>
          <span className="!no-underline text-6xl">
            {upperCase(
              appSettings?.name
                ?.toString()
                .split(" ")
                .map((n) => n[0])
                .join("")
            )}
          </span>
        </AvatarFallback>
      </Avatar>
      <Tooltip id="change-avatar" className="tooltip" place="top">
        Change logo
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
