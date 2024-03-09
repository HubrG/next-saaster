import { UserRole } from "@prisma/client";
import type { DefaultUser } from "next-auth";
import "next-auth/jwt";

declare module 'next-auth' {
  interface Session {
    user: DefaultUser & {
      id: string;
      role: UserRole;
      userId: string;
      customerId: string;
    };
  }
}
declare module "next-auth/jwt/types" {
  interface JWT {
    uid: string;
    role: UserRole;
  }
}