import { Navigate, Outlet } from "react-router-dom";
import type { AuthSession } from "@workspace/api-auth";
import { ROUTES } from "../../constants";
import { useSessionQuery } from "../../hooks/useAuthApi.ts";

export interface AuthenticatedOutletContext {
  session: AuthSession;
}

export function RequireAuth() {
  const { session, isLoading } = useSessionQuery();

  if (isLoading) {
    return <p role="status">Loading session...</p>;
  }

  if (!session) {
    return <Navigate to={ROUTES.SIGN_IN} replace />;
  }

  const context: AuthenticatedOutletContext = { session };

  return (
    <Outlet context={context} />
  );
}
