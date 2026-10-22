import type { RegisterPayload, RegisterResponse } from "@workspace/api-auth";
import { config } from "@workspace/config";
import { tryCatchAsync } from "@workspace/utils";
import { ERROR_MESSAGES } from "../constants";
import { getErrorMessage } from "../utils";

const { API_BASE_URL } = config.auth;

export async function register(credentials: RegisterPayload) {
  const response = await fetch(`${API_BASE_URL}/api/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const [data, jsonError] = await tryCatchAsync<RegisterResponse>(
    response.json(),
  );

  if (jsonError) {
    throw new Error(ERROR_MESSAGES.RegisterError);
  }

  if (data.error) {
    throw new Error(getErrorMessage(data.error, ERROR_MESSAGES.RegisterError));
  }

  if (!response.ok) {
    throw new Error(ERROR_MESSAGES.RegisterError);
  }

  return data;
}
