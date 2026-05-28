import { AuthSession } from "@workspace/api-auth";
import { headers } from "next/headers";
import { config } from "@workspace/config";

const { API_BASE_URL } = config.auth;

export const getServerSession = async (): Promise<AuthSession | null> => {
  const serverHeaders = await headers();
  try {
    const response = await fetch(`${API_BASE_URL}/public/api/session`, {
      credentials: "include",
      // we need to send cookies from the cilent to api server from next server
      headers: serverHeaders,
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
};
