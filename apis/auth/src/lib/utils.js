/**
 * @typedef {import('../../types').PasswordResetToken} PasswordResetToken
 * @typedef {import('../../types').User} User
 * @typedef {import('../../types').TwoFactorToken} TwoFactorToken
 * @typedef {import('../../types').VerificationToken} VerificationToken
 */

const bcrypt = require("bcryptjs");
const { randomUUID, randomInt } = require("node:crypto");
const db = require("./db");
const { sendVerificationEmail } = require("./mail");

const SALT_ROUNDS = 10;

/**
 * @param {string} id
 * @returns {Promise<User | null>}
 */

const getUserById = async (id) => {
  try {
    const user = await db.user.findUnique({ where: { id } });

    return user;
  } catch {
    return null;
  }
};

/**
 * @param {string} email
 * @returns {Promise<User | null>}
 */
const getUserByEmail = async (email) => {
  try {
    const user = await db.user.findUnique({ where: { email } });

    return user;
  } catch {
    return null;
  }
};

/**
 * @param {string} password
 * @returns {Promise<string>}
 */
const generatePasswordHash = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 *
 * @param {string} email
 * @returns {Promise<VerificationToken | null>}
 */
const getVerificationTokenByEmail = async (email) => {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: { email },
    });

    return verificationToken;
  } catch {
    return null;
  }
};

/**
 * @param {string} email
 * @returns {Promise<VerificationToken>}
 */

const generateVerificationToken = async (email) => {
  const token = randomUUID();
  const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db.verificationToken.delete({
      where: { id: existingToken.id },
    });
  }

  const verificationToken = await db.verificationToken.create({
    data: { email, token, expires },
  });

  return verificationToken;
};

/**
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ user: User, verificationToken: VerificationToken }>}
 */

const createUser = async (email, password) => {
  if (!email || !password) {
    throw new Error("Missing email or password");
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new Error("UserAlreadyExists");
  }

  const passwordHash = await generatePasswordHash(password);

  const user = await db.user.create({
    data: {
      email,
      name: "Session user",
      password: passwordHash,
    },
  });

  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(email, verificationToken.token);

  return { user, verificationToken };
};

/**
 * @param {string} email
 * @returns {Promise<TwoFactorToken | null>}
 */

const getTwoFactorTokenByEmail = async (email) => {
  try {
    return await db.twoFactorToken.findFirst({ where: { email } });
  } catch (error) {
    console.error("Error getting two factor token by email", error);
    return null;
  }
};

/**
 *
 * @param {TwoFactorToken} twoFactorToken
 * @returns {Promise<boolean>}
 */
const deleteTwoFactorToken = async (twoFactorToken) => {
  try {
    const deletedToken = await db.twoFactorToken.delete({
      where: { id: twoFactorToken.id },
    });
    return Boolean(deletedToken);
  } catch (error) {
    console.error("Error deleting two factor token", error);
    return false;
  }
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
    await db.twoFactorToken.delete({
      where: { id: existingToken.id },
    });
  }

  const twoFactorToken = await db.twoFactorToken.create({
    data: { email, token, expires },
  });

  return twoFactorToken;
};

/**
 * @param {Object} params
 * @param {string} params.provider
 * @param {string} params.providerAccountId
 * @param {string} params.email
 * @param {string | null} params.name
 * @param {string | null} params.image
 * @returns {Promise<User>}
 */
const findOrCreateOAuthUser = async ({
  provider,
  providerAccountId,
  email,
  name = null,
  image = null,
}) => {
  // Check if account already exists
  const existingAccount = await db.account.findUnique({
    where: {
      provider_providerAccountId: {
        provider,
        providerAccountId,
      },
    },
    include: {
      user: true,
    },
  });

  if (existingAccount) {
    return existingAccount.user;
  }

  // Check if user with this email exists and create new user if not
  let user = email ? await db.user.findUnique({ where: { email } }) : null;
  if (!user) {
    user = await db.user.create({
      data: {
        email,
        name,
        image,
        emailVerified: new Date(),
      },
    });
  }

  // Create new account
  await db.account.create({
    data: {
      userId: user.id,
      type: "oauth",
      provider,
      providerAccountId,
    },
  });

  return user;
};

/**
 *
 * @param {string} token
 * @returns {Promise<VerificationToken | null>}
 */
const getVerificationTokenByToken = async (token) => {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: { token },
    });

    return verificationToken;
  } catch (error) {
    console.error("Error getting verification token by token", error);
    return null;
  }
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

  await db.$transaction([
    db.user.update({
      where: { email: verificationToken.email },
      data: { emailVerified: new Date() },
    }),
    db.verificationToken.delete({
      where: { id: verificationToken.id },
    }),
  ]);

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
 * @param {string} token
 * @returns {Promise<PasswordResetToken | null>}
 */
const getPasswordResetTokenByToken = async (token) => {
  try {
    return await db.passwordResetToken.findFirst({ where: { token } });
  } catch (error) {
    console.error("Error getting password reset token by token", error);
    return null;
  }
};

/**
 * @param {string} email
 * @returns {Promise<PasswordResetToken | null>}
 */
const getPasswordResetTokenByEmail = async (email) => {
  try {
    return db.passwordResetToken.findFirst({ where: { email } });
  } catch {
    return null;
  }
};

/**
 * @param {string} email
 * @returns {Promise<PasswordResetToken | null>}
 */
const generatePasswordResetToken = async (email) => {
  const token = randomUUID();
  const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await db.passwordResetToken.delete({
      where: { id: existingToken.id },
    });
  }

  const passwordResetToken = await db.passwordResetToken.create({
    data: { email, token, expires },
  });

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

  try {
    await db.$transaction([
      db.user.update({
        where: { id: userId },
        data: { password: passwordHash },
      }),
      db.passwordResetToken.delete({
        where: { id: tokenId },
      }),
    ]);
  } catch (error) {
    console.error("Error updating user password", error);

    throw new Error("Failed to update user password");
  }
};

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  getTwoFactorTokenByEmail,
  deleteTwoFactorToken,
  generateTwoFactorToken,
  findOrCreateOAuthUser,
  verifyEmail,
  resendVerificationEmail,
  getPasswordResetTokenByToken,
  generatePasswordResetToken,
  updateUserPasswordByToken,
};
