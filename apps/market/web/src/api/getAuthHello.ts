import { config } from "@workspace/config";
import type { HelloResponse } from "./getHello";

const { API_BASE_URL } = config.market;

export async function getAuthHello(
  options: Pick<RequestInit, "headers"> = {},
): Promise<HelloResponse> {
  const response = await fetch(`${API_BASE_URL}/auth-hello`, {
    ...options,
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`market-api GET /auth-hello failed: ${response.status}`);
  }

  return response.json();
}
