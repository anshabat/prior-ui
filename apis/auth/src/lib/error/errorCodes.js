/** @enum {string} */
const ErrorCode = {
  INTERNAL_SERVER_ERROR: "InternalServerError",
  PASSWORD_RESET_FAILED: "PasswordResetFailed",
  TWO_FACTOR_INVALID_CODE: "TwoFactorInvalidCode",
  SIGN_IN_FAILED: "SignInError",
  ACCOUNT_NOT_LINKED: "AccountNotLinked",
  EMAIL_VERIFICATION_REQUIRED: "EmailVerificationRequired",
  EMAIL_NOT_VERIFIED: "EmailNotVerified",
  OAUTH_SIGN_IN: "OAuthSignInError",
};

module.exports = {
  ErrorCode,
};
