import { ERROR_MESSAGES } from "../constants";

type AuthErrorKey = keyof typeof ERROR_MESSAGES;

const isErrorKey = (key: string | undefined | null): key is AuthErrorKey => {
  return !!key && key in ERROR_MESSAGES;
};

export const getErrorMessage = (
  errorKey: string | undefined | null,
  fallbackMessage?: string,
): string => {
  if (isErrorKey(errorKey) && errorKey !== "InternalServerError") {
    return ERROR_MESSAGES[errorKey];
  }
  return fallbackMessage || ERROR_MESSAGES.InternalServerError;
};
