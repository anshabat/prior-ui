import type {
  AuthSession,
  RegisterPayload,
  SignInResponse,
  SignOutResponse,
  RegisterResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
  UpdatePasswordPayload,
  UpdatePasswordResponse,
} from "@workspace/api-auth";
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
    throw new Error(ERROR_MESSAGES.SignOutError);
  }

  return data;
}

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

export function signInWithOAuth(provider: string) {
  const callbackUrl = window.location.href;
  const url = callbackUrl
    ? `${API_BASE_URL}/api/auth/signin/${provider}?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : `${API_BASE_URL}/api/auth/signin/${provider}`;
  window.location.href = url;
}

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
    throw new Error(data.error);
  }

  if (!response.ok) {
    throw new Error(ERROR_MESSAGES.PasswordResetFailed);
  }

  return data;
}

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
