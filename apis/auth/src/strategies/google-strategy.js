/**
 * @typedef {import('../../types').User} User
 */

const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const { config } = require("@workspace/config");
const { verifyOauthUser } = require("../services/verifyOauthUser");

const { API_BASE_URL } = config.auth;

const GOOGLE_CLIENT_ID = process.env.AUTH_GOOGLE_ID;
const GOOGLE_CLIENT_SECRET = process.env.AUTH_GOOGLE_SECRET;
const GOOGLE_CALLBACK_URL = `${API_BASE_URL}/api/signin/google/callback`;

const googleStrategy = new GoogleStrategy(
  {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL,
    scope: ["profile", "email"],
  },
  /**
   * @param {string} _accessToken
   * @param {string} _refreshToken
   * @param {import('passport-google-oauth20').Profile} profile
   * @param {import('passport-google-oauth20').VerifyCallback} done
   */
  async (_accessToken, _refreshToken, profile, done) => {
    try {
      const user = await verifyOauthUser({
        email: profile.emails?.[0]?.value,
        provider: "google",
        providerAccountId: profile.id,
        name: profile.displayName || "",
        image: profile.photos?.[0]?.value ?? null,
      });
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  },
);

module.exports = { googleStrategy };
