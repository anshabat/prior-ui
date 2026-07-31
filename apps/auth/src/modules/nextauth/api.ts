import type {
  AuthSession,
  Provider,
  ProvidersResponse,
  SignInResponse,
  SignOutResponse,
  RegisterResponse,
  ResetPasswordResponse,
} from "@workspace/api-auth";
import { config } from "@workspace/config";
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
  const body = new URLSearchParams({
    email: credentials.email,
    password: credentials.password,
    ...(credentials.code ? { code: credentials.code } : {}),
    callbackUrl: `${API_BASE_URL}/api/responder/credentials/signIn`,
  }).toString();

  const response = await fetch(
    `${API_BASE_URL}/api/auth/callback/credentials`,
    {
      method: "POST",
      credentials: "include",
      redirect: "follow",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    },
  );

  if (!response.ok) {
    throw new Error(ERROR_MESSAGES.SignInError);
  }

  const data = (await response.json()) as SignInResponse;

  if (data.error) {
    throw new Error(getErrorMessage(data.error, ERROR_MESSAGES.SignInError));
  }

  return data;
}

export async function getSession(
  headers?: HeadersInit,
): Promise<AuthSession | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/session`, {
      method: "GET",
      credentials: "include",
      headers: headers || {},
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch {
    return null;
  }
}

export async function signOut() {
  const body = new URLSearchParams({
    callbackUrl: `${API_BASE_URL}/api/responder/credentials/signOut`,
  }).toString();

  const response = await fetch(`${API_BASE_URL}/api/auth/signout`, {
    method: "POST",
    credentials: "include",
    redirect: "follow",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    throw new Error(ERROR_MESSAGES.SignOutError);
  }

  const data = (await response.json()) as SignOutResponse;

  if (data.error) {
    throw new Error(getErrorMessage(data.error, ERROR_MESSAGES.SignOutError));
  }

  return data;
}

export async function getProviders(): Promise<Provider[]> {
  const response = await fetch(`${API_BASE_URL}/api/auth/providers`);

  if (!response.ok) {
    throw new Error(ERROR_MESSAGES.OAuthProvidersRequestFailed);
  }

  const data = (await response.json()) as ProvidersResponse;

  return Object.values(data);
}

export interface RegisterParams {
  email: string;
  password: string;
}
export async function register({
  email,
  password,
}: RegisterParams): Promise<RegisterResponse> {
  const response = await fetch(`${API_BASE_URL}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = (await response.json()) as RegisterResponse;

  if (!response.ok || !data.data || data.error) {
    throw new Error(getErrorMessage(data.error, ERROR_MESSAGES.RegisterError));
  }

  return data;
}

interface ResetPasswordParams {
  email: string;
  callbackUrl: string;
}
export async function resetPassword({
  email,
  callbackUrl,
}: ResetPasswordParams): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, callbackUrl }),
  });

  const data = (await response.json()) as ResetPasswordResponse;

  if (!response.ok || !data.data || data.error) {
    throw new Error(
      getErrorMessage(data.error, ERROR_MESSAGES.PasswordResetFailed),
    );
  }
}

interface UpdatePasswordParams {
  token: string;
  password: string;
}
export async function updatePassword({
  token,
  password,
}: UpdatePasswordParams): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/update-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token,
      password,
    }),
  });

  const result = (await response.json()) as UpdatePasswordResponse;

  if (!response.ok || result.error) {
    throw new Error(
      getErrorMessage(result.error, ERROR_MESSAGES.UpdatePasswordFailed),
    );
  }
}
