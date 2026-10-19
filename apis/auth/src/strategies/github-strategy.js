/**
 * @typedef {import('../../types').User} User
 */

const { Strategy: GitHubStrategy } = require("passport-github2");
const { config } = require("@workspace/config");
const { verifyOauthUser } = require("../services/verifyOauthUser");

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
   * @param {(err: unknown, user?: User | false, info?: { message: string, status: number }) => void} done
   */
  async (_accessToken, _refreshToken, profile, done) => {
    try {
      const user = await verifyOauthUser({
        email: profile.emails?.[0]?.value,
        provider: "github",
        providerAccountId: profile.id,
        name: profile.displayName || profile.username || "",
        image: profile.photos?.[0]?.value ?? null,
      });
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  },
);

module.exports = { githubStrategy };
