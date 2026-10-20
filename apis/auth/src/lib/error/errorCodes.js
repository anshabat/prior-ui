/** @enum {string} */
const ErrorCode = {
  PASSWORD_RESET_FAILED: "PASSWORD_RESET_FAILED",
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
