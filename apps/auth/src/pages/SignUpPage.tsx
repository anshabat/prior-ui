import { Link as RouterLink } from "react-router-dom";
import { Heading, Link, Text } from "@workspace/ui";
import { SignUp } from "../components/SignUp/SignUp.tsx";
import { ROUTES } from "../constants";

export function SignUpPage() {
  return (
    <div>
      <title>Create account</title>
      <hgroup
        style={{
          display: "grid",
          gap: "var(--spacing-8)",
          margin: "0 0 var(--spacing-48)",
        }}
      >
        <Heading as="h1">Sign up free</Heading>
        <Text tone="weak">No credit card required</Text>
      </hgroup>
      <SignUp />
      <p style={{ display: "flex", gap: 16, marginTop: 24 }}>
        <Link asChild size="tiny">
          <RouterLink to={ROUTES.SIGN_IN}>Sign in</RouterLink>
        </Link>
        <Link asChild size="tiny">
          <RouterLink to={ROUTES.RESET_PASSWORD}>Forgot password?</RouterLink>
        </Link>
      </p>
    </div>
  );
}
