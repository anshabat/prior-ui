import { createAuthClient } from "better-auth/react";
import { config } from "@workspace/config";

const { API_BASE_URL } = config.auth;

export const authClient = createAuthClient({
  baseURL: API_BASE_URL,
  fetchOptions: {
    credentials: "include",
  },
});
