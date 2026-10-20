| ErrorCode | status | service which throws it | logic which lead to this error |
| --- | --- | --- | --- |
| `PASSWORD_RESET_FAILED` | 400 | `requestPasswordReset`, `resetPassword` | <ul><li>No user exists for the email on a password-reset request.</li><li>No password-reset token exists for the submitted token.</li><li>The password-reset token exists, but its `expires` date is in the past.</li><li>The password-reset token is valid, but no user exists for the token's email.</li></ul> |
| `VALIDATION_FAILED` | 422 | `ValidationError` | Set by the `ValidationError` constructor. No service throws it yet. |
| `TwoFactorInvalidCode` | 401 | `verifyTwoFactorCode` | No two-factor token exists for the email, or the submitted code does not match it. |
| `TwoFactorExpiredCode` | 401 | `verifyTwoFactorCode` | The submitted code matches, but the token's `expires` date is in the past. The token is deleted before this is thrown. |
| `SignInError` | 500 | `resolveSignIn` | Passport's authenticate callback returned an `err`. The local strategy passes any `verifyLocalUser` failure this way, so those errors are replaced by this one. |
| `CredentialsSignin` | 401 | `verifyLocalUser`, `resolveSignIn` | <ul><li>No user exists for the submitted email.</li><li>The submitted password does not match the stored password.</li><li>Passport finished without a user and without an `err`. Status is `info.status` when set, otherwise 401.</li></ul> |
| `AccountNotLinked` | 403 | `verifyLocalUser` | A user exists for the email, but the account has no password. |
| `EmailVerificationRequired` | 403 | `resolveSignIn` | The local user authenticated, but `emailVerified` is not set. A new verification token is issued when the current one is missing or expired. |
| `EmailNotVerified` | 400 | `verifyEmailAction` (controller), `verifyEmail` | <ul><li>The `token` query parameter is missing or an empty string.</li><li>No verification token exists for the submitted token.</li><li>The verification token exists, but its `expires` date is in the past.</li></ul> |
| `OAuthSignInError` | 400 | `verifyOauthUser` | The OAuth profile has no email. |
