const { generatePasswordHash } = require("../lib/password");
const { getUserByEmail, createUser } = require("../repository/userRepository");
const { issueVerificationToken } = require("./issueVerificationToken");

/**
 * @param {string} email
 * @param {string} password
 * @returns {Promise<void>}
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
  } else {
    const passwordHash = await generatePasswordHash(password);
    const user = await createUser({
      email,
      password: passwordHash,
      name: "Session user",
    });
    if (!user) {
      throw new Error("Failed to create user");
    }
  }

  await issueVerificationToken(email);
};

module.exports = { registerUser };
