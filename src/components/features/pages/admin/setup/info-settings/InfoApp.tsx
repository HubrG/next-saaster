"use client";
import * as z from "zod";
import React, { useEffect } from "react";
import { appSettings } from "@prisma/client";
import { Button } from "@/src/components/ui/button";
import { Form } from "@/src/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateInfosApp } from "./actions.server";
import { Toastify } from "@/src/components/layout/toastify/Toastify";
import { useRouter } from "next/navigation";
import { Field } from "@/src/components/ui/form-field";

type Props = {
  data: appSettings;
};

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  description: z.string().min(50, {
    message: "Description must be at least 50 characters.",
  }),
  baseline: z.string().min(2, {
    message: "Baseline must be at least 2 characters.",
  }),
});

export const InfoApp = ({ data }: Props) => {
  const router = useRouter();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data?.name ?? "",
      description: data?.description ?? "",
      baseline: data?.baseline ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const updateInfo = await updateInfosApp(data?.id, values);
    if (updateInfo) {
      return Toastify({
        type: "success",
        value: "Informations updated",
        callbackOnOpen: () => {
          router.refresh();
        },
      });
    }
  }

  return (
    <div>
     
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Field
              label="Nom du site (logo, meta title and more)"
              name="name"
              placeholder="SaaSter"
              description="Meta title, logo and more..."
              form={form}
            />
            <Field
              label="Baseline"
              name="baseline"
              description="On base meta title for SEO"
              placeholder="baseline"
              form={form}
            />
            <Field
              label="Description du site"
              name="description"
              description="The maximum recommended size for the meta description (SEO) was often between 150 and 160 characters max."
              placeholder="description"
              form={form}
            />

            <Button type="submit">Submit</Button>
          </form>
        </Form>
     
    </div>
  );
};
 