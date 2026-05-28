import { useEffect } from "react";
import { config } from "@workspace/config";

const { APP_BASE_URL } = config.auth;

export function useAuthHandlers(redirectUrl: string) {
  const loginHref = `${APP_BASE_URL}?redirect=${redirectUrl}`;
  const logoutHref = `${APP_BASE_URL}/logout?redirect=${redirectUrl}`;

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data === "auth_success") {
        window.location.reload();
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return {
    loginHref,
    logoutHref,
    openLoginPopup: () => {
      window.open(
        loginHref,
        "auth_popup",
        "width=600,height=600,left=200,top=200",
      );
    },
    openLogoutPopup: () => {
      window.open(
        logoutHref,
        "auth_popup",
        "width=300,height=300,left=200,top=200",
      );
    },
  };
}
