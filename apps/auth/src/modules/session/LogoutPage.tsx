import { useState } from "react";
import { LogoutButton } from "../../components/LogoutButton";
import { getSession, logout } from "./api";
import { redirectToOpener } from "../../utils/redirectToOpener";
import { useSessionQuery } from "../../hooks/useAuthApi";

export default function LogoutPage() {
  const redirectUrl = new URLSearchParams(window.location.search).get(
    "redirect",
  );

  const {
    session,
    isLoading: isSessionLoading,
    refreshSession,
  } = useSessionQuery(() => getSession());

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const result = await logout();
      console.log("Logout result", result);
      await refreshSession();
      redirectToOpener(redirectUrl);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isSessionLoading) {
    return <div>Loading session...</div>;
  }

  return (
    <LogoutButton
      isLoggedIn={!!session}
      onLogout={handleLogout}
      isLoading={isLoggingOut}
    />
  );
}
