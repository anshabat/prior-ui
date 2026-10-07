const { Strategy: LocalStrategy } = require("passport-local");
const { getUserByEmail, resendVerificationEmail } = require("../lib/utils");
const bcrypt = require("bcryptjs");

const localStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
    session: false,
  },
  async (email, password, done) => {
    try {
      const user = await getUserByEmail(email);

      if (!user) {
        return done(null, false, {
          message: "CredentialsSignin",
          status: 401,
        });
      }

      if (!user.password) {
        return done(null, false, {
          message: "AccountNotLinked",
          status: 403,
        });
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return done(null, false, {
          message: "CredentialsSignin",
          status: 401,
        });
      }

      if (!user.emailVerified) {
        await resendVerificationEmail(email);
        return done(null, false, { message: "EmailRequired", status: 403 });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  },
);

module.exports = { localStrategy };
