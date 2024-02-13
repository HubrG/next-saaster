import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    GITHUB_ID: z.string().min(1),
    GITHUB_SECRET: z.string().min(1),
    GOOGLE_ID: z.string().min(1),
    GOOGLE_SECRET: z.string().min(1),
    SMTP_USER: z.string().min(1),
    SMTP_PASSWORD: z.string().min(1),
    SMTP_HOST: z.string().min(1),
    SMTP_PORT: z.string().min(1),
    RESEND_FROM: z.string().min(1),
  },
  client: {},
  runtimeEnv: {
    GITHUB_ID: process.env.GITHUB_ID,
    GITHUB_SECRET: process.env.GITHUB_SECRET,
    GOOGLE_ID: process.env.GOOGLE_ID,
    GOOGLE_SECRET: process.env.GOOGLE_SECRET,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    RESEND_FROM: process.env.RESEND_FROM,
  },
});
