export const ERROR_MESSAGES = {
  // Maps an apis/auth ErrorCode and is used directly in the client.
  SignInError: "Sign-in failed. Please try again.",

  // Maps an apis/auth ErrorCode.
  InternalServerError: "Something went wrong. Please try again.",
  AccountNotLinked:
    "This email is already associated with an account, but not with this sign-in method. Use the method you originally used.",
  EmailVerificationRequired: "Email verification is required.",
  EmailNotVerified:
    "Invalid or expired email verification token. Please request a new sign-in link.",
  OAuthSignInError: "Could not start OAuth sign-in. Please try again.",
  TwoFactorInvalidCode: "Invalid two-factor code. Please try again.",

  // Used in the client.
  RegisterError: "Registration failed. Please try again.",
  SignOutError: "Sign-out encountered an issue.",
  PasswordResetFailed: "Failed to request password reset",
  PasswordResetTokenGenerationFailed: "Failed to generate password reset token",
  UpdataPasswordMatch: "Passwords do not match",
  UpdatePasswordMissingToken: "Missing token",
} as const;
