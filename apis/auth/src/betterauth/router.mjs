import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { config } from "@workspace/config";
import { auth } from "./config.mjs";

const { APP_BASE_URL } = config.auth;

export const betterAuthRouter = express.Router();

betterAuthRouter.use(cors({ origin: APP_BASE_URL, credentials: true }));
betterAuthRouter.all("/api/auth/*", toNodeHandler(auth));
