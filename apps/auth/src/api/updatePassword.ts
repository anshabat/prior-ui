import type {
  UpdatePasswordPayload,
  UpdatePasswordResponse,
} from "@workspace/api-auth";
import { config } from "@workspace/config";
import { tryCatchAsync } from "@workspace/utils";
import { ERROR_MESSAGES } from "../constants";
import { getErrorMessage } from "../utils";

const { API_BASE_URL } = config.auth;

export async function updatePassword({
  token,
  password,
}: UpdatePasswordPayload) {
  const response = await fetch(`${API_BASE_URL}/api/update-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, password }),
  });

  const [data, jsonError] = await tryCatchAsync<UpdatePasswordResponse>(
    response.json(),
  );

  if (jsonError) {
    throw new Error(ERROR_MESSAGES.PasswordResetTokenGenerationFailed);
  }

  if (!data.success) {
    throw new Error(
      getErrorMessage(
        data.error,
        ERROR_MESSAGES.PasswordResetTokenGenerationFailed,
      ),
    );
  }

  if (!response.ok) {
    throw new Error(ERROR_MESSAGES.PasswordResetTokenGenerationFailed);
  }

  return data;
}
