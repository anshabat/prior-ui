import type {
  UpdatePasswordPayload,
  UpdatePasswordResponse,
} from "@workspace/api-auth";
import { config } from "@workspace/config";
import { tryCatchAsync } from "@workspace/utils";
import { ERROR_MESSAGES } from "../utils/errors";

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
    throw new Error(data.error);
  }

  if (!response.ok) {
    throw new Error(ERROR_MESSAGES.PasswordResetTokenGenerationFailed);
  }

  return data;
}
