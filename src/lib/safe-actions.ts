import { getServerSession } from "next-auth";
import { createSafeActionClient, DEFAULT_SERVER_ERROR } from "next-safe-action";
import { authOptions } from "./next-auth/auth";

export class ActionError extends Error {}

const handleReturnedServerError = (e: Error) => {
  // If the error is an instance of `ActionError`, unmask the message.
  if (e instanceof ActionError) {
    console.error("Action error:", e.message);
    return e.message;
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
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new ActionError("You must be connected")
    } else {
      return session;
    }
  },
  handleReturnedServerError,
});
