import type {
  ResetPasswordPayload,
  ResetPasswordResponse,
} from "@workspace/api-auth";
import { config } from "@workspace/config";
import { tryCatchAsync } from "@workspace/utils";
import { ERROR_MESSAGES } from "../constants";
import { getErrorMessage } from "../utils";

const { API_BASE_URL } = config.auth;

export async function resetPassword({
  email,
  callbackUrl,
}: ResetPasswordPayload) {
  const response = await fetch(`${API_BASE_URL}/api/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, callbackUrl }),
  });

  const [data, jsonError] = await tryCatchAsync<ResetPasswordResponse>(
    response.json(),
  );

  if (jsonError) {
    throw new Error(ERROR_MESSAGES.PasswordResetFailed);
  }

  if (!data.success) {
    throw new Error(
      getErrorMessage(data.error, ERROR_MESSAGES.PasswordResetFailed),
    );
  }

  if (!response.ok) {
    throw new Error(ERROR_MESSAGES.PasswordResetFailed);
  }

  return data;
}
