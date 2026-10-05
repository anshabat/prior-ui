const jwt = require("jsonwebtoken");
/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('../../types').AuthSession} AuthSession
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

/**
 * Replace or remove the error search param on an absolute return URL.
 * @param {string} returnUrl
 * @param {string} [error]
 * @returns {string}
 */
const buildOauthRedirectUrl = (returnUrl, error) => {
  const url = new URL(returnUrl);

  if (error) {
    url.searchParams.set("error", error);
  } else {
    url.searchParams.delete("error");
  }

  return url.href;
};

/**
 * Passport authenticate callback for an OAuth provider.
 * Sets the auth cookie and redirects to the stored return URL.
 * @typedef {(err: Error | null, user: User | false) => Promise<void>} PassportAuthHandler
 * @param {string} provider
 * @returns {(req: Request, res: Response) => PassportAuthHandler}
 */
const createOAuthCallbackHandler =
  (provider) => (req, res) => async (err, user) => {
    const serverRoot = `${req.protocol}://${req.get("host")}`;
    const returnUrl = req.cookies.oauth_return_url || serverRoot;

    res.clearCookie("oauth_return_url");

    if (err || !user) {
      console.error(`OAuth ${provider} callback failed:`, err ?? "Unauthorized");
      return res.redirect(buildOauthRedirectUrl(returnUrl, "OAuthSignInError"));
    }

    const token = createOauthJWT(user, provider);
    res.cookie("authToken", token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });
    res.redirect(buildOauthRedirectUrl(returnUrl));
  };

module.exports = {
  createOauthJWT,
  createCredentialsJWT,
  extractSessionFromJWT,
  createOAuthCallbackHandler,
};
