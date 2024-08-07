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

export type ResponseProps<T> = {
  data?: T;
  error?: unknown;
  success?: T | undefined;
  statusCode?: number;
};

export type HandleResponseProps<T> =
  | {
      success: T;
      data?: T;
      statusCode: number;
      serverError: undefined;
      validationErrors: undefined;
    }
  | {
      success: undefined;
      error: string;
      statusCode: number;
      serverError: string | undefined;
      validationErrors: Record<string, string | string[]> | undefined; // Modification ici
    };

function handleSuccess<T>(data: T, statusCode: number): HandleResponseProps<T> {
  return {
    success: data,
    statusCode,
    serverError: undefined,
    validationErrors: undefined,
  };
}

// function handleError<T>(
//   error: unknown,
//   statusCode: number,
//   serverError?: string,
//   validationErrors?: Record<string, string | string[]> // Modification ici
// ): HandleResponseProps<T> {
//   return {
//     success: undefined,
//     error: getErrorMessage(error),
//     statusCode,
//     serverError,
//     validationErrors,
//   };
// }

export function handleRes<T>(args: ResponseProps<T>): HandleResponseProps<T> {
  const { data, error, success, statusCode = 200 } = args;

  if (error) {
    return {
      success: undefined,
      error: getErrorMessage(error),
      statusCode: 500,
      serverError: getErrorMessage(error),
      validationErrors: undefined,
    };
  }

  return handleSuccess(success!, statusCode);
}