import { useState } from "react";
import { Text } from "@workspace/ui";
import { LogoutButton } from "../components/ui/LogoutButton.tsx";
import { logout } from "../api";
import { redirectToOpener } from "../utils";
import { useSessionQuery } from "../hooks/useAuthApi.ts";

export default function LogoutPage() {
  const redirectUrl = new URLSearchParams(window.location.search).get(
    "redirect",
  );

  const {
    session,
    isLoading: isSessionLoading,
    refreshSession,
  } = useSessionQuery();

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
    return <Text>Loading session...</Text>;
  }

  return (
    <LogoutButton
      isLoggedIn={!!session}
      onLogout={handleLogout}
      isLoading={isLoggingOut}
    />
  );
}
