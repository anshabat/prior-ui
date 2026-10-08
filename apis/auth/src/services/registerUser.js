/**
 * @typedef {import('../../types').User} User
 * @typedef {import('../../types').VerificationToken} VerificationToken
 */

const { sendVerificationEmail } = require("../lib/mail");
const { generatePasswordHash } = require("../lib/password");
const { generateVerificationToken } = require("../lib/utils");
const { getUserByEmail, createUser } = require("../repository/userRepository");

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

module.exports = { registerUser };
