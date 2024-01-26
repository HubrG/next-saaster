"use server";
/**
 * @param {string} email
 * @returns {boolean} true if the user is an admin, false otherwise
 * @description This function checks if the user is an admin.
 * @example
 * const isAdmin = require("src/functions/isAdmin.ts");
 */
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/next-auth/auth";

export const isAdmin = async () => {
    const session = await getServerSession(authOptions);
    if (!session) return false;
    if (session.user.role !== "ADMIN") return false;
    return true;
}