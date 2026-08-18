import { getSession } from "./api";
import { useSessionQuery } from "../../hooks/useAuthApi";

export function BetterAuthModule() {
  const { session, isLoading, error, refreshSession } = useSessionQuery(() =>
    getSession(),
  );

  return (
    <div>
      <h2>Better Auth</h2>
      <button
        type="button"
        onClick={() => refreshSession()}
        disabled={isLoading}
      >
        {isLoading ? "Loading session…" : "Get session"}
      </button>
      {error && <p>{error.message}</p>}
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
