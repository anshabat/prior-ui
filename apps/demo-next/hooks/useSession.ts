import type { AuthSession } from "@workspace/api-auth";
import { useEffect, useState } from "react";
import { config } from "@workspace/config";

const { API_BASE_URL } = config.auth;

export const useSession = (): AuthSession | null => {
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/public/api/session`, {
          credentials: "include",
        });
        if (!response.ok) {
          return setSession(null);
        }
        const data = await response.json();
        setSession(data);
      } catch {
        setSession(null);
      }
    };

    fetchSession();
  }, []);

  return session;
};
