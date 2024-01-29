import { PrismaClient } from "@prisma/client";

declare module "node" {
  interface Global {
    prisma?: PrismaClient;
  }
}

declare module "react-beautiful-dnd";
declare module 'bcrypt';
declare module '@t3-oss/env-core';
declare module 'js-cookie';
declare module 'validator';
declare module 'bcrypt';
declare module "react-grid-layout";
declare module 'react-places-autocomplete'
declare module "array-move"
declare module "uuid"
declare module 'cookie';
declare module 'showdown';
declare module 'react-resizable';
declare module 'lodash'
declare module 'react-lazyload'

declare module "@/utils/openAIStream"
declare module "uuid"
declare module "tiktoken"
declare module "@dqbd/tiktoken"

declare module "isomorphic-fetch"
declare module "unified"
declare module "remark-parse"
declare module "uuid"

declare module '@adobe/helix-md2docx';
