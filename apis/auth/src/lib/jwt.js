const jwt = require("jsonwebtoken");
/**
 * @typedef {import('../../types').User} User
 * @typedef {import('../../types').SessionUser} SessionUser
 */
/**
 * @param {User} user
 * @param {string} provider
 * @returns {string}
 */
const buildToken = (user, provider) => {
  /** @type {SessionUser} */
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    role: user.role,
    provider,
  };
  // TODO: create service for jwt which receive SessionUser type, so we could remove @type above
  return jwt.sign(payload, process.env.AUTH_SECRET, { expiresIn: "1d" });
};

/**
 * @param {User} user
 * @param {string} provider
 * @returns {string}
 */
const createOauthJWT = (user, provider) => buildToken(user, provider);

/**
 * @param {User} user
 * @returns {string}
 */
const createCredentialsJWT = (user) => buildToken(user, "credentials");

module.exports = {
  createOauthJWT,
  createCredentialsJWT,
};
