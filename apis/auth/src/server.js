const express = require("express");
const { config } = require("@workspace/config");
const cookieParser = require("cookie-parser");

const { API_PORT, API_BASE_URL } = config.auth;
const passportRouter = require("./passport/router");
const publicRouter = require("./publicRouter");

const app = express();
app.use(express.json());
app.use(/** @type {import("express").RequestHandler} */ (cookieParser()));

app.use("/public", publicRouter);
app.use(passportRouter);

app.listen(API_PORT, () => {
  console.log(`Auth server listening on ${API_BASE_URL}`);
});
