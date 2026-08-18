/**
 * @typedef {import('../../types').AuthSession} AuthSession
 */

import express from "express";
import cors from "cors";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import { config } from "@workspace/config";
import { auth } from "./config.mjs";
import { toAuthSession } from "./session.mjs";

const { APP_BASE_URL } = config.auth;

export const betterAuthRouter = express.Router();

betterAuthRouter.use(cors({ origin: APP_BASE_URL, credentials: true }));
betterAuthRouter.all("/api/auth/*", toNodeHandler(auth));

betterAuthRouter.get(
  "/api/session",
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response<AuthSession | null>} res
   */
  async (req, res) => {
    try {
      const ba = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });
      const session = toAuthSession(ba);
      return res.status(200).json(session);
    } catch {
      return res.status(200).json(null);
    }
  },
);
