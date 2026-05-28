import { ERROR_MESSAGES, getErrorMessage } from "../../utils/errors";

export const getServerErrorMessage = () => {
  const error = new URLSearchParams(window.location.search).get("error");
  const message = error ? getErrorMessage(error, ERROR_MESSAGES.Default) : null;
  return message;
};
