import { Link } from "react-router-dom";
import { Heading, Text } from "@workspace/ui";
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
        <Link to={ROUTES.SIGN_IN}>Sign in</Link>
        <Link to={ROUTES.RESET_PASSWORD}>Forgot password?</Link>
      </p>
    </div>
  );
}
