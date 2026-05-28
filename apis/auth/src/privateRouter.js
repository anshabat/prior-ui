const express = require("express");
const cors = require("cors");
const { createUser } = require("./lib/utils.js");
const { config } = require("@workspace/config");

const router = express.Router();

router.use(cors({ origin: config.auth.APP_BASE_URL, credentials: true }));

router.post(
  "/api/register",
  /**
   * Registers a new user with the provided email and password.
   * @param {import('express').Request} req
   * @param {import('express').Response<RegisterResponse>} res
   */
  async (req, res) => {
    try {
      const { email, password } = req.body ?? {};
      await createUser(email, password);
      return res.json({ success: true, error: null });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(409).json({ success: false, error: error.message });
      }
      return res
        .status(500)
        .json({ success: false, error: "Internal server error" });
    }
  },
);

module.exports = router;
