import { getErrorMessage } from "./getErrorMessage";

export function handleResponse<T>(
  data: T,
  error?: unknown
): { data?: T; error?: string } {
  if (error) {
    console.error(error);
    return { error: getErrorMessage(error) };
  }
  return { data: data };
}
