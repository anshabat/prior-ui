import type { AuthSession } from "@workspace/api-auth";
import { config } from "@workspace/config";

const { API_BASE_URL } = config.auth;

export async function getSession(
  options: Pick<RequestInit, "headers"> = {},
): Promise<AuthSession | null> {
  const response = await fetch(`${API_BASE_URL}/public/api/session`, {
    ...options,
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(
      `auth-api GET /public/api/session failed: ${response.status}`,
    );
  }

  return response.json();
}
