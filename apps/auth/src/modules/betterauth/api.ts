import type {
  AuthSession,
  RegisterPayload,
  RegisterResponse,
  SignInResponse,
  SignOutResponse,
} from "@workspace/api-auth";
import { tryCatchAsync } from "@workspace/utils";
import { ERROR_MESSAGES } from "../../utils/errors";
import { authClient } from "./authClient";

export interface SignInCredentials {
  email: string;
  password: string;
}

function toAuthSession(
  data: {
    user?: {
      id: string;
      name?: string | null;
      email: string;
      image?: string | null;
      role?: string | null;
      provider?: string | null;
    };
    session?: { expiresAt: Date | string };
  } | null,
): AuthSession | null {
  if (!data?.user || !data.session) return null;

  return {
    user: {
      id: data.user.id,
      name: data.user.name ?? null,
      email: data.user.email,
      image: data.user.image ?? null,
      role: data.user.role ?? null,
      provider: data.user.provider ?? null,
    },
    expires:
      data.session.expiresAt instanceof Date
        ? data.session.expiresAt.toISOString()
        : String(data.session.expiresAt),
  };
}

export async function getSession(): Promise<AuthSession | null> {
  const [result, fetchError] = await tryCatchAsync(authClient.getSession());

  if (fetchError || result.error) {
    return null;
  }

  return toAuthSession(result.data);
}

export async function signIn(
  credentials: SignInCredentials,
): Promise<SignInResponse> {
  const [result, fetchError] = await tryCatchAsync(
    authClient.signIn.email({
      email: credentials.email,
      password: credentials.password,
    }),
  );

  if (fetchError || result.error) {
    throw new Error(
      result?.error?.message || ERROR_MESSAGES.SignInError,
    );
  }

  return {
    twoFactor: false,
    error: null,
    session: toAuthSession(result.data),
  };
}

export async function register(
  credentials: RegisterPayload,
): Promise<RegisterResponse> {
  const name = credentials.email.split("@")[0] || "User";
  const [result, fetchError] = await tryCatchAsync(
    authClient.signUp.email({
      email: credentials.email,
      password: credentials.password,
      name,
    }),
  );

  if (fetchError || result.error) {
    const code = result?.error?.code;
    if (
      code === "USER_ALREADY_EXISTS" ||
      code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"
    ) {
      throw new Error(ERROR_MESSAGES.UserAlreadyExists);
    }
    throw new Error(result?.error?.message || ERROR_MESSAGES.RegisterError);
  }

  return { data: true, error: null };
}

export async function logout(): Promise<SignOutResponse> {
  const [result, fetchError] = await tryCatchAsync(authClient.signOut());

  if (fetchError || result.error) {
    throw new Error(result?.error?.message || ERROR_MESSAGES.SignOutError);
  }

  return { data: true, error: null };
}
