import type { AuthSession } from "@workspace/api-auth";
import { config } from "@workspace/config";

const { API_BASE_URL } = config.auth;

export async function getSession(): Promise<AuthSession | null> {
  const response = await fetch(`${API_BASE_URL}/api/session`, {
    credentials: "include",
  });
  const data = await response.json();

  if (!response.ok) {
    return null;
  }

  return data;
}
