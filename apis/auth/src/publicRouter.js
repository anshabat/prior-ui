/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response<AuthSession>} Response
 */

const express = require("express");
const cors = require("cors");
const { config } = require("@workspace/config");

const { AUTH_STRATEGY, CLIENT_APPS_URLS, API_BASE_URL } = config.auth;

const router = express.Router();

router.use(cors({ origin: CLIENT_APPS_URLS, credentials: true }));

router.get(
  "/api/session",
  /**
   * @param {Request} req
   * @param {Response} res
   */
  async (req, res) => {
    const target =
      AUTH_STRATEGY === "nextauth" ? "/api/auth/session" : "/api/session";

    const response = await fetch(`${API_BASE_URL}${target}`, {
      headers: {
        ...(req.headers.cookie && { cookie: req.headers.cookie }),
      },
    });

    /** @type {AuthSession} */
    const data = await response.json();

    return res.status(response.status).json(data);
  },
);

module.exports = router;
