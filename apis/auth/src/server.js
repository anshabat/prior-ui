const express = require("express");
const { config } = require("@workspace/config");

const { AUTH_STRATEGY, API_PORT, API_BASE_URL } = config.auth;
const privateRouter = require("./privateRouter");
const nextAuthRouter = require("./nextauth/router");
const passportRouter = require("./passport/router");
const publicRouter = require("./publicRouter");

const app = express();
app.use(express.json());

const strategyMap = {
  nextauth: nextAuthRouter,
  passport: passportRouter,
};
const authRouter = strategyMap[AUTH_STRATEGY];

app.use(authRouter);
app.use(privateRouter);
app.use("/public", publicRouter);

app.listen(API_PORT, () => {
  console.log(`Auth server listening on ${API_BASE_URL}`);
});
