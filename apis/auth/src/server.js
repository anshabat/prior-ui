const express = require("express");
const { config } = require("@workspace/config");
const cookieParser = require("cookie-parser");

const { API_PORT, API_BASE_URL } = config.auth;
const privateRouter = require("./routes/private");
const publicRouter = require("./routes/public");
const { globalErrorHandlerMiddleware } = require("./lib/error");

const app = express();
app.use(express.json());
app.use(/** @type {import("express").RequestHandler} */ (cookieParser()));

app.use("/public", publicRouter);
app.use(privateRouter);
app.use(globalErrorHandlerMiddleware);

app.listen(API_PORT, () => {
  console.log(`Auth server listening on ${API_BASE_URL}`);
});
