const { Strategy: LocalStrategy } = require("passport-local");
const { verifyLocalUser } = require("../services/verifyLocalUser");

/** @type {import('passport-local').VerifyFunction} */
const verify = async (email, password, done) => {
  try {
    const user = await verifyLocalUser({ email, password });
    return done(null, user);
  } catch (error) {
    return done(error);
  }
};

const localStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
    session: false,
  },
  verify,
);

module.exports = { localStrategy };
