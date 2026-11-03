import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "../../constants";
import { useSessionQuery } from "../../hooks/useAuthApi.ts";
import { useRedirectToOpener } from "../../hooks/useRedirectToOpener.ts";

/**
 * Renders nested routes only for signed-out users.
 * Signed-in users are sent back to the opener app (popup flow)
 * or to the account page.
 */
export function RequireGuest() {
  const { session, isLoading } = useSessionQuery();
  useRedirectToOpener(session);

  if (isLoading) {
    return <p role="status">Loading session...</p>;
  }

  if (session) {
    return <Navigate to={ROUTES.ACCOUNT} replace />;
  }

  return <Outlet />;
}
