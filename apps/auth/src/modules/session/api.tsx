import type { AuthSession, SignInResponse } from "@workspace/api-auth";
import { config } from "@workspace/config";
import { tryCatchAsync } from "@workspace/utils";
import { ERROR_MESSAGES, getErrorMessage } from "../../utils/errors";

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

export async function getSession(): Promise<AuthSession | null> {
  const response = await fetch(`${API_BASE_URL}/api/session`, {
    credentials: "include",
  });
  const data = await response.json();

  if (!response.ok) {
    return null;
  }

  return data;
}

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
    throw new Error(ERROR_MESSAGES.SignInError);
  }

  return data;
}

export async function register(credentials: SignInCredentials) {
  const response = await fetch(`${API_BASE_URL}/api/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return response.json();
}

export function signInWithOAuth(provider: string) {
  const callbackUrl = window.location.href;
  const url = callbackUrl
    ? `${API_BASE_URL}/api/auth/signin/${provider}?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : `${API_BASE_URL}/api/auth/signin/${provider}`;
  window.location.href = url;
}

export async function resetPassword(email: string, callbackUrl: string) {
  const response = await fetch(`${API_BASE_URL}/api/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, callbackUrl }),
  });

  return response.json();
}

export async function updatePassword(token: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/api/update-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, password }),
  });

  return response.json();
}
