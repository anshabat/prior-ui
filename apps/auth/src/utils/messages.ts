import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants";

type AuthErrorKey = keyof typeof ERROR_MESSAGES;
type AuthSuccessKey = keyof typeof SUCCESS_MESSAGES;

const isErrorKey = (key: string | undefined | null): key is AuthErrorKey => {
  return !!key && key in ERROR_MESSAGES;
};

const isSuccessKey = (
  key: string | undefined | null,
): key is AuthSuccessKey => {
  return !!key && key in SUCCESS_MESSAGES;
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

export const getSuccessMessage = (
  successKey: string | undefined | null,
  fallbackMessage?: string,
): string => {
  if (isSuccessKey(successKey)) {
    return SUCCESS_MESSAGES[successKey];
  }
  return fallbackMessage || "";
};
