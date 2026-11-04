import { useOutletContext } from "react-router-dom";
import { Heading, Text } from "@workspace/ui";
import type { AuthenticatedOutletContext } from "../components/guards/RequireAuth.tsx";
import { LogoutButton } from "../components/ui/LogoutButton.tsx";
import { useSignOutMutation } from "../hooks/useAuthApi.ts";

export function AccountPage() {
  const { session } = useOutletContext<AuthenticatedOutletContext>();
  const { mutate: signOut, isPending, error } = useSignOutMutation();

  return (
    <div>
      <title>Account</title>
      <hgroup
        style={{
          display: "grid",
          gap: "var(--spacing-8)",
          margin: "0 0 var(--spacing-48)",
        }}
      >
        <Heading as="h1">{session.user.name}</Heading>
        <Text tone="weak">Signed in with {session.user.provider}</Text>
      </hgroup>
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
