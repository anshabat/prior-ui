const { Resend } = require("resend");
const { config } = require("@workspace/config");

const { API_BASE_URL } = config.auth;

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * @param {string} email
 * @param {string} token
 * @returns {Promise<void>}
 */
const sendVerificationEmail = async (email, token) => {
  const confirmLink = `${API_BASE_URL}/page/verify-email?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Verify your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to verify your email</p>`,
  });
};

/**
 * @param {string} email
 * @param {string} token
 * @param {string} callbackUrl
 * @returns {Promise<void>}
 */
const sendPasswordResetEmail = async (email, token, callbackUrl) => {
  const resetLink = buildResetLink(token, callbackUrl);

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password<br />${token}</p>`,
  });
};

/**
 * @param {string} email
 * @param {string} token
 * @returns {Promise<void>}
 */
const sendTwoFactorTokenEmail = async (email, token) => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Your 2FA Code",
    html: `<p>Your 2FA code is: ${token}</p>`,
  });
};

/**
 * @param {string} token
 * @param {string} callbackUrl
 * @returns {string}
 */
const buildResetLink = (token, callbackUrl) => {
  const url = new URL(callbackUrl);
  url.searchParams.set("resetPasswordToken", token);
  return url.toString();
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendTwoFactorTokenEmail,
};
