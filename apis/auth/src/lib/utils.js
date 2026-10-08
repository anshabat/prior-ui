/**
 * @typedef {import('../../types').PasswordResetToken} PasswordResetToken
 * @typedef {import('../../types').User} User
 * @typedef {import('../../types').TwoFactorToken} TwoFactorToken
 * @typedef {import('../../types').VerificationToken} VerificationToken
 */

const { randomUUID, randomInt } = require("node:crypto");
const { generatePasswordHash } = require("./password");
const { sendVerificationEmail } = require("./mail");
const { getUserByEmail, createUser } = require("../repository/userRepository");
const {
  getAccountByProvider,
  createAccount,
} = require("../repository/accountRepository");
const {
  getVerificationTokenByToken,
  getVerificationTokenByEmail,
  deleteVerificationToken,
  createVerificationToken,
  confirmVerificationToken,
} = require("../repository/verificationTokenRepository");
const {
  getTwoFactorTokenByEmail,
  deleteTwoFactorToken,
  createTwoFactorToken,
} = require("../repository/twoFactorTokenRepository");
const {
  getPasswordResetTokenByEmail,
  deletePasswordResetToken,
  createPasswordResetToken,
  confirmPasswordResetToken,
} = require("../repository/passwordResetTokenRepository");

/**
 * @param {string} email
 * @returns {Promise<VerificationToken>}
 */
const generateVerificationToken = async (email) => {
  const token = randomUUID();
  const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    const deletedToken = await deleteVerificationToken(existingToken.id);
    if (!deletedToken) {
      throw new Error("Failed to delete verification token");
    }
  }

  const verificationToken = await createVerificationToken({
    email,
    token,
    expires,
  });
  if (!verificationToken) {
    throw new Error("Failed to create verification token");
  }

  return verificationToken;
};

/**
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ user: User, verificationToken: VerificationToken }>}
 */
const registerUser = async (email, password) => {
  if (!email || !password) {
    throw new Error("Missing email or password");
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    if (existingUser.emailVerified) {
      throw new Error("UserAlreadyExists");
    }

    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(email, verificationToken.token);

    return { user: existingUser, verificationToken };
  }

  const passwordHash = await generatePasswordHash(password);
  const user = await createUser({
    email,
    password: passwordHash,
    name: "Session user",
  });
  if (!user) {
    throw new Error("Failed to create user");
  }

  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(email, verificationToken.token);

  return { user, verificationToken };
};

/**
 *
 * @param {string} email
 * @returns {Promise<TwoFactorToken>}
 */
const generateTwoFactorToken = async (email) => {
  const token = randomInt(100_000, 1_000_000).toString(); // 6 digit code
  const expires = new Date(Date.now() + 1000 * 60 * 10); // 10 minutes

  const existingToken = await getTwoFactorTokenByEmail(email);

  if (existingToken) {
    const isTokenDeleted = await deleteTwoFactorToken(existingToken);
    if (!isTokenDeleted) {
      throw new Error("Failed to delete two factor token");
    }
  }

  const twoFactorToken = await createTwoFactorToken({
    email,
    token,
    expires,
  });
  if (!twoFactorToken) {
    throw new Error("Failed to create two factor token");
  }

  return twoFactorToken;
};

/**
 * @param {Object} params
 * @param {string} params.provider
 * @param {string} params.providerAccountId
 * @param {string} params.email
 * @param {string | null} params.name
 * @param {string | null} params.image
 * @returns {Promise<User | null>}
 */
const findOrCreateOAuthUser = async ({
  provider,
  providerAccountId,
  email,
  name = null,
  image = null,
}) => {
  const existingAccount = await getAccountByProvider(
    provider,
    providerAccountId,
  );

  if (existingAccount) {
    return existingAccount.user;
  }

  let user = email ? await getUserByEmail(email) : null;
  if (!user) {
    user = await createUser({
      email,
      name,
      image,
      emailVerified: new Date(),
    });
  }

  if (user) {
    const account = await createAccount({
      userId: user.id,
      provider,
      providerAccountId,
    });
    if (!account) {
      // TODO: Create the user and account in one transaction. A failed account create returns null after createUser has already persisted the user.
      return null;
    }
  }

  return user;
};

/**
 * @param {string} token
 * @returns {Promise<boolean>}
 */
const verifyEmail = async (token) => {
  const verificationToken = await getVerificationTokenByToken(token);

  if (!verificationToken) {
    // TODO: Logger
    console.error("Verification token not found");
    throw new Error("Verification");
  }

  if (new Date(verificationToken.expires) < new Date()) {
    // TODO: Logger
    console.error("Verification token expired");
    throw new Error("Verification");
  }

  const confirmed = await confirmVerificationToken(verificationToken);
  if (!confirmed) {
    throw new Error("Verification");
  }

  return true;
};

/**
 * @param {string} email
 * @returns {Promise<boolean>}
 */
const resendVerificationEmail = async (email) => {
  const existingToken = await getVerificationTokenByEmail(email);
  const isExpired =
    existingToken && new Date(existingToken.expires) < new Date();

  if (!existingToken || isExpired) {
    const newToken = await generateVerificationToken(email);
    await sendVerificationEmail(email, newToken.token);
    return true;
  }

  return false;
};

/**
 * @param {string} email
 * @returns {Promise<PasswordResetToken>}
 */
const generatePasswordResetToken = async (email) => {
  const token = randomUUID();
  const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    const deletedToken = await deletePasswordResetToken(existingToken.id);
    if (!deletedToken) {
      throw new Error("Failed to delete password reset token");
    }
  }

  const passwordResetToken = await createPasswordResetToken({
    email,
    token,
    expires,
  });
  if (!passwordResetToken) {
    throw new Error("Failed to create password reset token");
  }

  return passwordResetToken;
};

/**
 * @param {string} userId
 * @param {string} tokenId
 * @param {string} password
 * @returns {Promise<void>}
 */
const updateUserPasswordByToken = async (userId, tokenId, password) => {
  if (!userId || !password || !tokenId) {
    throw new Error("Missing params");
  }

  const passwordHash = await generatePasswordHash(password);
  const confirmed = await confirmPasswordResetToken(
    userId,
    passwordHash,
    tokenId,
  );
  if (!confirmed) {
    throw new Error("Failed to update user password");
  }
};

module.exports = {
  registerUser,
  generateTwoFactorToken,
  findOrCreateOAuthUser,
  verifyEmail,
  resendVerificationEmail,
  generatePasswordResetToken,
  updateUserPasswordByToken,
};
