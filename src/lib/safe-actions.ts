import { createSafeActionClient, DEFAULT_SERVER_ERROR } from "next-safe-action";

export class ActionError extends Error {}

export const handleReturnedServerError = async (e: Error | ActionError) => {
  // If the error is an instance of `ActionError`, unmask the message.
  if (e instanceof ActionError) {
    // console.error("Action error:", e.message, "Caused by:", e.cause, e.stack);
    return e.message;
  }
  // Otherwise return default error message.
  return DEFAULT_SERVER_ERROR;
};

export const action = createSafeActionClient({
  async middleware() {
    const { authOptions } = await import("./next-auth/auth");
    const { getServerSession } = await import("next-auth/next");
    const session = await getServerSession(authOptions);
    if (session) {
      const userSession = session;
      return { userSession };
    } else {
      const userSession = undefined;
      return { userSession };
    }
  },
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
      const userSession = session;
      return { userSession };
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
      const userSession = session.user;
      return { userSession };
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
      const userSession = session.user;
      return { userSession };
    }
  },
  handleReturnedServerError,
});
type MiddlewareData = {
  secret: string;
};

export const appAction = createSafeActionClient({
  async middleware(parsedInput) {
    // ...
    // Restrict actions execution to admins.
    // if (data?.userRole !== "admin") {
    throw new Error("Only admins can execute this action!");
    // }

    // ...
  },
  handleReturnedServerError,
});
