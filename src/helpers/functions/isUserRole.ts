"use server";
/**
 * @param {string} email
 * @returns {boolean} true if the user is an admin, false otherwise
 * @description This function checks if the user is an admin.
 * @example
 * const isAdmin = require("src/functions/isAdmin.ts");
 */
import { getUser } from '@/src/helpers/db/users.action';
import { UserRole } from "@prisma/client";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "../../lib/next-auth/auth";

export const isAdmin = async () => {
  const session = await getServerSession(authOptions);
  if (!session) return false;
  if (session.user.role !== ("ADMIN" as UserRole)) return false;
  return true;
};

export const isMe = async (email: string) => {
  const session = await getServerSession(authOptions);
  if (!session) return false;
  if (session.user.email !== email) return false;
  return true;
}


export const isSuperAdmin = async () => {
  const session = await getServerSession(authOptions);
  if (!session) return false;
  if (session.user.role !== ("SUPER_ADMIN" as UserRole)) return false;
  return true;
};
//

export const isConnected = async () => {
  const session = await getServerSession(authOptions);
  if (!session) return false;
  return true;
};

export const isOrganizationOwner = async (organizationId: string, session:Session) => {
  console.log(session)
  const user = await getUser({ email: session.user.email ?? "" });
  const organization = user.data?.organization?.ownerId;
  console.log(organization, organizationId)
  if (!organization) return false;
  if (organization !== user.data?.id) return false;
  return true;
}
