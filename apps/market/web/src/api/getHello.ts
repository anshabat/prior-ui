import { config } from "@workspace/config";

const { API_BASE_URL } = config.market;

export type HelloResponse = {
  message: string;
};

export async function getHello(): Promise<HelloResponse> {
  const response = await fetch(`${API_BASE_URL}/`);

  if (!response.ok) {
    throw new Error(`market-api GET / failed: ${response.status}`);
  }

  return response.json();
}
