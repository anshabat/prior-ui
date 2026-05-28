import { LogoutButton } from "../../components/LogoutButton";
import * as api from "./api";
import { redirectToOpener } from "../../utils/redirectToOpener";
import { useSessionQuery, useSignOutMutation } from "../../hooks/useAuthApi";

export default function LogoutPage() {
  const { session, isLoading: isSessionLoading } = useSessionQuery(() =>
    api.getSession(),
  );

  const { mutate: signOut, isPending: isLoggingOut } = useSignOutMutation(
    api.signOut,
    {
      onSuccess: () => {
        const redirectUrl = new URLSearchParams(window.location.search).get(
          "redirect",
        );
        redirectToOpener(redirectUrl);
      },
    },
  );

  if (isSessionLoading) {
    return <div>Loading session...</div>;
  }

  return (
    <div>
      <LogoutButton
        isLoggedIn={!!session}
        onLogout={signOut}
        isLoading={isLoggingOut}
      />
    </div>
  );
}
