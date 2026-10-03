import type { SignOutResponse } from "@workspace/api-auth";
import { config } from "@workspace/config";
import { tryCatchAsync } from "@workspace/utils";
import { ERROR_MESSAGES } from "../constants";
import { getErrorMessage } from "../utils/errors";

const { API_BASE_URL } = config.auth;

export async function logout(): Promise<SignOutResponse> {
  const response = await fetch(`${API_BASE_URL}/api/logout`, {
    method: "POST",
    credentials: "include",
  });
  const [data, jsonError] = await tryCatchAsync<SignOutResponse>(
    response.json(),
  );

  if (jsonError) {
    throw new Error(ERROR_MESSAGES.SignOutError);
  }

  if (data.error) {
    throw new Error(getErrorMessage(data.error, ERROR_MESSAGES.SignOutError));
  }

  if (!response.ok) {
    throw new Error(ERROR_MESSAGES.SignOutError);
  }

  return data;
}
