const { Strategy: LocalStrategy } = require("passport-local");
const { verifyLocalUser } = require("../services/verifyLocalUser");

const localStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
    session: false,
  },
  async (email, password, done) => {
    const { data: user, error } = await verifyLocalUser({ email, password });

    if (error) {
      return done(null, false, error);
    }

    return done(null, user || false);
  },
);

module.exports = { localStrategy };
