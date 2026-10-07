/**
 * @typedef {import('../../types').User} User
 */

const { Strategy: GitHubStrategy } = require("passport-github2");
const { findOrCreateOAuthUser } = require("../lib/utils");
const { config } = require("@workspace/config");

const { API_BASE_URL } = config.auth;

const GITHUB_CLIENT_ID = process.env.AUTH_GITHUB_ID;
const GITHUB_CLIENT_SECRET = process.env.AUTH_GITHUB_SECRET;
const GITHUB_CALLBACK_URL = `${API_BASE_URL}/api/auth/callback/github`;

const githubStrategy = new GitHubStrategy(
  {
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: GITHUB_CALLBACK_URL,
    scope: ["user:email"],
  },
  /**
   * @param {string} _accessToken
   * @param {string} _refreshToken
   * @param {import('passport-github2').Profile} profile
   * @param {(err: unknown, user: User | false) => Promise<void>} done
   */
  async (_accessToken, _refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) {
        return done(new Error("No email found in GitHub profile"), false);
      }

      const user = await findOrCreateOAuthUser({
        provider: "github",
        providerAccountId: profile.id,
        name: profile.displayName || profile.username || "",
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

module.exports = { githubStrategy };
