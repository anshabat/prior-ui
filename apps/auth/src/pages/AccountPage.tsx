import { useOutletContext } from "react-router-dom";
import { Alert, Stack } from "@workspace/ui";
import type { AuthenticatedOutletContext } from "../components/guards/RequireAuth.tsx";
import { LogoutButton } from "../components/ui/LogoutButton.tsx";
import { Page } from "../components/ui/Page.tsx";
import { useSignOutMutation } from "../hooks/useAuthApi.ts";

export function AccountPage() {
  const { session } = useOutletContext<AuthenticatedOutletContext>();
  const { mutate: signOut, isPending, error } = useSignOutMutation();
  const { name, email, provider } = session.user;

  return (
    <Page
      title={name ?? email}
      subtitle={provider && `Signed in with ${provider}`}
      documentTitle="Account"
    >
      <Stack gap="12">
        {error && (
          <Alert tone="error" size="small" role="alert">
            {error.message}
          </Alert>
        )}
        <Stack align="start">
          <LogoutButton
            isLoggedIn
            onLogout={() => signOut()}
            isLoading={isPending}
          />
        </Stack>
      </Stack>
    </Page>
  );
}
