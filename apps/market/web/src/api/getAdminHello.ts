import { config } from "@workspace/config";
import type { HelloResponse } from "./getHello";

const { API_BASE_URL } = config.market;

export async function getAdminHello(
  options: Pick<RequestInit, "headers"> = {},
): Promise<HelloResponse> {
  const response = await fetch(`${API_BASE_URL}/admin-hello`, {
    ...options,
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`market-api GET /admin-hello failed: ${response.status}`);
  }

  return response.json();
}
