const jwt = require("jsonwebtoken");

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

/**
 * @param {number} timestamp
 * @returns {string}
 */
const jwtTimestampToISO = (timestamp) => {
  return new Date(timestamp * 1000).toISOString();
};

/**
 *
 * @param {string} token
 * @returns {AuthSession}
 */
const extractSessionFromJWT = (token) => {
  // TODO: create service for jwt which receive SessionUser type, so we could remove @type in utils.js
  // also include exp and iat in SessionUser type
  const user = /** @type {SessionUser & { exp: number; iat: number }} */ (
    jwt.verify(token, process.env.AUTH_SECRET)
  );
  const { exp, iat, ...rest } = user; // eslint-disable-line no-unused-vars
  return { user: rest, expires: jwtTimestampToISO(exp) };
};

module.exports = {
  createOauthJWT,
  createCredentialsJWT,
  extractSessionFromJWT,
};
