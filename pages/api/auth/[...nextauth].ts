import { authOptions } from "@/src/lib/next-auth/auth";
import nextAuth from "next-auth";

export default nextAuth(authOptions)