const express = require("express");
const { config } = require("@workspace/config");

const { API_PORT, API_BASE_URL } = config.auth;
const passportRouter = require("./passport/router");
const publicRouter = require("./publicRouter");

const app = express();
app.use(express.json());

app.use(passportRouter);
app.use("/public", publicRouter);

app.listen(API_PORT, () => {
  console.log(`Auth server listening on ${API_BASE_URL}`);
});
