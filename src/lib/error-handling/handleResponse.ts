import { getErrorMessage } from "./getErrorMessage";

export function handleResponse<T>(
  data: T,
  error?: unknown,
  statusCode: number = 500
): { data?: T; error?: string; statusCode?: number } {
  if (error) {
    return { error: getErrorMessage(error), statusCode: statusCode || 500 };
  }
  return { data: data };
}




// 


export type ResponseProps<T> = {
  data?: T;
  error?: unknown;
  success?: T | undefined;
  statusCode?: number;
};

export type HandleResponseProps<T> =
  | { success: T; data?: T; statusCode: number }
  | { success: undefined; error: string; statusCode: number };

function handleSuccess<T>(data: T, statusCode: number): HandleResponseProps<T> {
  return { success: data, statusCode };
}

function handleError<T>(
  error: unknown,
  statusCode: number
): HandleResponseProps<T> {
  return { success: undefined, error: getErrorMessage(error), statusCode };
}

export function handleRes<T>(args: ResponseProps<T>): HandleResponseProps<T> {
  const { data, error, success, statusCode = 200 } = args;

  if (error) {
    return handleError(error, statusCode);
  }

  return handleSuccess(success!, statusCode);
}
