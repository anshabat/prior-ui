const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const { findOrCreateOAuthUser } = require("../lib/utils");
const { config } = require("@workspace/config");

const { API_BASE_URL } = config.auth;

const GOOGLE_CLIENT_ID = process.env.AUTH_GOOGLE_ID;
const GOOGLE_CLIENT_SECRET = process.env.AUTH_GOOGLE_SECRET;
const GOOGLE_CALLBACK_URL = `${API_BASE_URL}/api/auth/callback/google`;

const googleStrategy = new GoogleStrategy(
  {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL,
    scope: ["profile", "email"],
  },
  async (_accessToken, _refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) {
        return done(new Error("No email found in Google profile"), false);
      }
      const user = await findOrCreateOAuthUser({
        provider: "google",
        providerAccountId: profile.id,
        name: profile.displayName,
        email: email,
        image: profile.photos?.[0]?.value ?? null,
      });
      if (!user) {
        return done(new Error("No user found"), false);
      }
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  },
);

module.exports = { googleStrategy };
