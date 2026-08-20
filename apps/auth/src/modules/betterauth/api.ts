import type {
  AuthSession,
  RegisterPayload,
  RegisterResponse,
  SignInResponse,
  SignOutResponse,
} from "@workspace/api-auth";
import { config } from "@workspace/config";
import { tryCatchAsync } from "@workspace/utils";
import { ERROR_MESSAGES } from "../../utils/errors";
import { authClient } from "./authClient";

const { APP_BASE_URL } = config.auth;

export interface SignInCredentials {
  email: string;
  password: string;
}

export async function getSession(): Promise<AuthSession | null> {
  const [result, fetchError] = await tryCatchAsync(authClient.getSession());

  if (fetchError || result.error) {
    return null;
  }

  const data = result.data as AuthSession | null;
  return data?.user ? data : null;
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
    // for translations in future,check error.code
    throw new Error(result?.error?.message || ERROR_MESSAGES.SignInError);
  }

  return {
    twoFactor: false,
    error: null,
    session: await getSession(),
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
      callbackURL: APP_BASE_URL,
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
