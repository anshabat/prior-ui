import type { AuthSession } from "@workspace/api-auth";
import { config } from "@workspace/config";
import { useEffect, useState } from "react";

const { API_BASE_URL } = config.auth;

export type SessionState =
  | { status: "loading"; session: null }
  | { status: "unauthenticated"; session: null }
  | { status: "authenticated"; session: AuthSession };

const UNAUTHENTICATED: SessionState = {
  status: "unauthenticated",
  session: null,
};

export function useSession(): SessionState {
  const [state, setState] = useState<SessionState>({
    status: "loading",
    session: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    const loadSession = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/public/api/session`, {
          credentials: "include",
          signal: controller.signal,
        });
        if (!response.ok) {
          return setState(UNAUTHENTICATED);
        }
        const session: AuthSession = await response.json();
        setState({ status: "authenticated", session });
      } catch {
        if (!controller.signal.aborted) {
          setState(UNAUTHENTICATED);
        }
      }
    };

    loadSession();

    return () => controller.abort();
  }, []);

  return state;
}
