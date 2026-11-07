import { Link as RouterLink } from "react-router-dom";
import { Heading, Link, Text } from "@workspace/ui";
import { SignIn } from "../components/SignIn/SignIn.tsx";
import { useFlashQueryParam } from "../hooks/useFlashQueryParam.ts";
import { getSuccessMessage } from "../utils";
import { ROUTES } from "../constants";

export function SignInPage() {
  const flashSuccess = useFlashQueryParam("success");
  const successMessage = getSuccessMessage(flashSuccess);

  return (
    <div>
      <title>Sign in</title>
      <hgroup
        style={{
          display: "grid",
          gap: "var(--spacing-8)",
          margin: "0 0 var(--spacing-48)",
        }}
      >
        <Heading as="h1">Welcome</Heading>
        <Text tone="weak">Log in to your account</Text>
      </hgroup>
      {successMessage && (
        <div style={{ marginBottom: 30, color: "green" }}>
          {successMessage}
        </div>
      )}
      <SignIn />
      <p style={{ display: "flex", gap: 16, marginTop: 24 }}>
        <Link asChild size="tiny">
          <RouterLink to={ROUTES.SIGN_UP}>Create account</RouterLink>
        </Link>
        <Link asChild size="tiny">
          <RouterLink to={ROUTES.RESET_PASSWORD}>Forgot password?</RouterLink>
        </Link>
      </p>
    </div>
  );
}
