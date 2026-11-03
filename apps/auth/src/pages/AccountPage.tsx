import { useOutletContext } from "react-router-dom";
import type { AuthenticatedOutletContext } from "../components/guards/RequireAuth.tsx";
import { LogoutButton } from "../components/ui/LogoutButton.tsx";
import { useSignOutMutation } from "../hooks/useAuthApi.ts";

export function AccountPage() {
  const { session } = useOutletContext<AuthenticatedOutletContext>();
  const { mutate: signOut, isPending, error } = useSignOutMutation();

  return (
    <div>
      <title>Account</title>
      <h2>{session.user.name} - {session.user.provider}</h2>
      {error && (
        <div style={{ color: "red", marginBottom: 12 }}>
          Error: {error.message}
        </div>
      )}
      <LogoutButton
        isLoggedIn
        onLogout={() => signOut()}
        isLoading={isPending}
      />
    </div>
  );
}
