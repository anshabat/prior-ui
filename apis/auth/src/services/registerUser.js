/**
 * @typedef {import('../../types').User} User
 * @typedef {import('../../types').VerificationToken} VerificationToken
 */

const { generatePasswordHash } = require("../lib/password");
const { getUserByEmail, createUser } = require("../repository/userRepository");
const {
  generateVerificationToken,
} = require("./generateVerificationToken");

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

  return { user, verificationToken };
};

module.exports = { registerUser };
