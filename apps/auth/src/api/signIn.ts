import type { SignInResponse } from "@workspace/api-auth";
import { config } from "@workspace/config";
import { tryCatchAsync } from "@workspace/utils";
import { ERROR_MESSAGES } from "../constants";
import { getErrorMessage } from "../utils/errors";

const { API_BASE_URL } = config.auth;

export interface SignInCredentials {
  email: string;
  password: string;
  code?: string;
}

export async function signIn(
  credentials: SignInCredentials,
): Promise<SignInResponse> {
  const response = await fetch(`${API_BASE_URL}/api/signin`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const [data, jsonError] = await tryCatchAsync<SignInResponse>(
    response.json(),
  );

  if (jsonError) {
    throw new Error(ERROR_MESSAGES.SignInError);
  }

  if (data.error) {
    throw new Error(getErrorMessage(data.error, ERROR_MESSAGES.SignInError));
  }

  if (!response.ok) {
    throw new Error(ERROR_MESSAGES.SignInError);
  }

  return data;
}
