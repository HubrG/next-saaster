import { PrismaClient } from "@prisma/client";

declare module "node" {
  interface Global {
    prisma?: PrismaClient;
  }
}
declare module "nodemailer";
declare module "react-beautiful-dnd";
declare module "formidable";
declare module "formidable-serverless";
declare module "bcrypt";
declare module "@t3-oss/env-core";
declare module "js-cookie";
declare module "validator";
declare module "bcrypt";
declare module "react-grid-layout";
declare module "array-move";
declare module "uuid";
declare module "cookie";
declare module "react-resizable";
declare module "lodash";
declare module "react-lazyload";
declare module "react-lottie"
declare module "@/utils/openAIStream";
declare module "uuid";

declare module "isomorphic-fetch";
declare module "unified";
declare module "remark-parse";
declare module "uuid";

declare module "@adobe/helix-md2docx";
