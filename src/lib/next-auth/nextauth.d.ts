import { User } from "@prisma/client";
import type { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: User & { sub: string }
  }
}

declare module "next-auth/jwt" {
  type JWT = User & { sub: string } & DefaultSession;
 
}