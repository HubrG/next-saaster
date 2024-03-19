interface ErrorData<TValidationErrors = Record<string, string | string[]>> {
  serverError?: string | Record<string, any>; 
  validationErrors?: TValidationErrors;
}

export function handleError<T extends ErrorData>(
  data: T
): { error: boolean; message?: string } {
  if (data.serverError && Object.keys(data.serverError).length > 0) {
    console.error("Server error: ", data.serverError);
    const message =
      typeof data.serverError === "string"
        ? data.serverError
        : JSON.stringify(data.serverError);
    return { error: true, message };
  } else if (
    data.validationErrors &&
    Object.keys(data.validationErrors).length > 0
  ) {
    const firstValidationErrorKey = Object.keys(data.validationErrors)[0];
    const firstValidationError = data.validationErrors[firstValidationErrorKey];
    console.error("Validation error: ", data.validationErrors);
    const errorMessage = Array.isArray(firstValidationError)
      ? firstValidationError[0]
      : firstValidationError;
    return { error: true, message: errorMessage };
  } else {
    return { error: false };
  }
}
