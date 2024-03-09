import { createSafeActionClient, DEFAULT_SERVER_ERROR } from "next-safe-action";

export class ActionError extends Error {}

export const handleReturnedServerError = async (e: Error | ActionError) => {
  // If the error is an instance of `ActionError`, unmask the message.
  if (e instanceof ActionError) {
    console.error("Action error:", e.message, "Caused by:", e.cause, e.stack);
    return (e.message);
  }
  // Otherwise return default error message.
  return DEFAULT_SERVER_ERROR;
};

export const action = createSafeActionClient({
  // Can also be an async function.
  handleReturnedServerError,
});

export const authAction = createSafeActionClient({
  async middleware() {
    const { authOptions } = await import("./next-auth/auth");
    const { getServerSession } = await import("next-auth/next");
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new ActionError("You must be connected");
    } else {
      return session;
    }
  },
  handleReturnedServerError,
});

export const superAdminAction = createSafeActionClient({
  async middleware() {
    const { authOptions } = await import("./next-auth/auth");
    const { getServerSession } = await import("next-auth/next");
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new ActionError("You must be connected");
    } else if (session.user.role !== "SUPER_ADMIN") {
      throw new ActionError("You must be an admin");
    } else {
      return session;
    }
  },
  handleReturnedServerError,
});

export const adminAction = createSafeActionClient({
  async middleware() {
    const { authOptions } = await import("./next-auth/auth");
    const { getServerSession } = await import("next-auth/next");
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new ActionError("You must be connected");
    } else if (
      session.user.role !== "ADMIN" &&
      session.user.role !== "SUPER_ADMIN"
    ) {
      throw new ActionError("You must be an admin");
    } else {
      return session;
    }
  },
  handleReturnedServerError,
});

export const appAction = createSafeActionClient({
  async middleware(parseInput) {
   const { env } = await import("./zodEnv");
    const zodEnv = env.NEXTAUTH_SECRET;
    const envPublic = process.env.NEXT_AUTH_SECRET;
    if (zodEnv !== envPublic) {
      throw new ActionError("You must be connected");
    }
    const ret = true;
   return { ret };
  },
  handleReturnedServerError,
});


