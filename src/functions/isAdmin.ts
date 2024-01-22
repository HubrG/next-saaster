"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/next-auth/auth";

export const isAdmin = async () => {
    const session = await getServerSession(authOptions);
    if (!session) return false;
    if (session.user.role !== "ADMIN") return false;
    return true;
}