export const ERROR_MESSAGES = {
  // Sign-in flow
  SignInError: "Sign-in failed. Please try again.",
  AccessDenied: "Sign-in was denied by the server.",
  CredentialsSignin:
    "Invalid credentials. Check your email and password and try again.",
  AccountNotLinked:
    "This email is already associated with an account, but not with this sign-in method. Use the method you originally used.",
  OAuthAccountNotLinked:
    "This email is already associated with an account, but not with this OAuth provider. Sign in using the provider you originally used.",
  EmailSignInError:
    "Could not start email sign-in. Check the email address and try again.",
  OAuthSignInError: "Could not start OAuth sign-in. Please try again.",
  OAuthCallbackError:
    "The OAuth provider returned an error during sign-in. Please try again.",
  OAuthProfileParseError:
    "We couldn’t read your profile from the OAuth provider. Please try again.",
  CallbackRouteError: "Could not finish sign-in. Please try again.",
  TwoFactorRequired: "Two-factor authentication is required.",

  // CSRF / security / verification
  MissingCSRF:
    "Security check failed (missing CSRF token). Please refresh and try again.",
  InvalidCheck:
    "Security check failed during OAuth (state/nonce/PKCE). Please try again.",
  InvalidCallbackUrl: "Invalid callback URL detected. Please try again.",
  Verification:
    "Invalid or expired verification link/token. Please sign in again.",

  // Session / sign-out
  SessionTokenError: "Could not load your session. Please try again.",
  JWTSessionError:
    "Session token could not be processed. Please sign in again.",
  SignOutError: "Sign-out encountered an issue.",

  // Configuration / server-side issues (usually not user-fixable)
  AdapterError:
    "Server error while accessing the database. Please try again later.",
  MissingAdapter: "Server configuration error (missing database adapter).",
  MissingAdapterMethods:
    "Server configuration error (database adapter is incomplete).",
  MissingAuthorize:
    "Server configuration error (credentials authorize function is missing).",
  MissingSecret: "Server configuration error (missing secret).",
  InvalidEndpoints:
    "Server configuration error (provider endpoints are missing/misconfigured).",
  InvalidProvider: "Unknown or unsupported sign-in provider.",
  UnsupportedStrategy:
    "Server configuration error (credentials requires JWT session strategy).",
  ExperimentalFeatureNotEnabled:
    "Server configuration error (experimental feature not enabled).",
  EventError: "Server error while running an authentication hook.",
  ErrorPageLoop:
    "Server configuration error (error page requires authentication).",
  DuplicateConditionalUI:
    "Server configuration error (multiple providers enabled conditional UI).",
  MissingWebAuthnAutocomplete:
    "Server configuration error (WebAuthn conditional UI setup is incomplete).",
  WebAuthnVerificationError: "WebAuthn verification failed. Please try again.",
  UnknownAction: "Unsupported authentication action.",

  // Deployment-related
  UntrustedHost: "Server configuration error (untrusted host).",

  // Fallback
  Default: "Authentication failed. Please try again.",

  // 2FA-specific
  TwoFactorInvalidCode: "Invalid two-factor code. Please try again.",
  TwoFactorExpiredCode: "Two-factor code has expired. Please sign in again.",
  TwoFactorError: "Two-factor authentication failed. Please try again.",

  // Email verification-specific
  EmailRequired: "Email verification is required.",
  EmailNotVerified:
    "Invalid or expired email verification token. Please request a new sign-in link.",
  OAuthProvidersRequestFailed:
    "Failed to fetch OAuth providers. Please refresh the page and try again.",

  // Registration-specific
  UserAlreadyExists: "An account with this email already exists.",
  RegisterError: "Registration failed. Please try again.",

  // Password reset-specific
  PasswordResetFailed: "Failed to request password reset",
  PasswordResetTokenGenerationFailed: "Failed to generate password reset token",
  UpdataPasswordMatch: "Passwords do not match",
  UpdatePasswordFailed: "Failed to update password",
  UserNotFound: "User not found",
  TokenExpired: "Token expired",
  InvalidOrExpiredToken: "Invalid or expired token",
} as const;

type AuthErrorKey = keyof typeof ERROR_MESSAGES;

const isErrorKey = (key: string | undefined | null): key is AuthErrorKey => {
  return !!key && key in ERROR_MESSAGES;
};

export const getErrorMessage = (
  errorKey: string | undefined | null,
  fallbackMessage?: string,
): string => {
  if (isErrorKey(errorKey)) {
    return ERROR_MESSAGES[errorKey];
  }
  return fallbackMessage || ERROR_MESSAGES.Default;
};
