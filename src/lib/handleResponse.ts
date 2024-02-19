import { getErrorMessage } from "./getErrorMessage";

export function handleResponse<T>(
  data: T,
  error?: any
): { success?: boolean; data?: T; error?: string } {
  if (error) {
    console.error(error);
    return { error: getErrorMessage(error) };
  }
  return { success: true, data };
}
