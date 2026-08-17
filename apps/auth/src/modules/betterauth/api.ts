import { config } from "@workspace/config";

const { API_BASE_URL } = config.auth;

export async function pingOk(): Promise<unknown> {
  const response = await fetch(`${API_BASE_URL}/api/auth/ok`, {
    credentials: "include",
  });
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(`GET /api/auth/ok failed: ${response.status}`);
  }

  return body;
}
