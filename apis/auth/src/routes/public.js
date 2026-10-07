/**
 * @typedef {import('../../types').AuthSession} AuthSession
 */

const express = require("express");
const cors = require("cors");
const { config } = require("@workspace/config");
const { getSession } = require("../controllers/getSession");

const { CLIENT_APPS_URLS, APP_BASE_URL } = config.auth;

const router = express.Router();

router.use(
  cors({ origin: [...CLIENT_APPS_URLS, APP_BASE_URL], credentials: true }),
);

router.get("/api/session", getSession);

module.exports = router;
