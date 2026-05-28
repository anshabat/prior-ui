import { useEffect } from "react";
import type { AuthSession } from "@workspace/api-auth";
import { redirectToOpener } from "../utils/redirectToOpener";

export function useRedirectToOpener(session: AuthSession | null) {
  const searchParams = new URLSearchParams(window.location.search);
  const redirectUrl =
    searchParams.get("redirect") ?? sessionStorage.getItem("authRedirectUrl");

  useEffect(() => {
    if (!redirectUrl) return;
    if (session) {
      sessionStorage.removeItem("authRedirectUrl");
      redirectToOpener(redirectUrl);
    } else {
      sessionStorage.setItem("authRedirectUrl", redirectUrl);
    }
  }, [session, redirectUrl]);
}
