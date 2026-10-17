/** @enum {string} */
const ErrorCode = {
  PASSWORD_RESET_FAILED: "PASSWORD_RESET_FAILED",
  VALIDATION_FAILED: "VALIDATION_FAILED",
  TWO_FACTOR_INVALID_CODE: "TwoFactorInvalidCode",
  TWO_FACTOR_EXPIRED_CODE: "TwoFactorExpiredCode",
  SIGN_IN_FAILED: "SignInError",
  CREDENTIALS_SIGN_IN: "CredentialsSignin",
};

module.exports = {
  ErrorCode,
};
