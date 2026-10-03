const express = require("express");
const { config } = require("@workspace/config");
const privateRouter = require("./privateRouter");
const publicRouter = require("./publicRouter");

const { AUTH_STRATEGY, API_PORT, API_BASE_URL } = config.auth;

const strategyMap = {
  nextauth: () => require("./nextauth/router"),
  passport: () => require("./passport/router"),
  betterauth: async () => {
    const { betterAuthRouter } = await import("./betterauth/router.mjs");
    return betterAuthRouter;
  },
};

async function main() {
  const app = express();
  app.use(await strategyMap[AUTH_STRATEGY]());
  app.use(privateRouter);
  app.use("/public", publicRouter);
  app.listen(API_PORT, () => {
    console.log(`Auth server listening on ${API_BASE_URL}`);
  });
}

main();
