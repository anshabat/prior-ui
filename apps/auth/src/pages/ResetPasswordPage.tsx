import { Link } from "react-router-dom";
import { Heading } from "@workspace/ui";
import { ResetPassword } from "../components/ResetPassword/ResetPassword.tsx";
import { ROUTES } from "../constants";

export function ResetPasswordPage() {
  return (
    <div>
      <title>Reset password</title>
      <div style={{ marginBottom: "var(--spacing-48)" }}>
        <Heading as="h1">Reset password</Heading>
      </div>
      <ResetPassword />
      <p style={{ display: "flex", gap: 16, marginTop: 24 }}>
        <Link to={ROUTES.SIGN_IN}>Back to sign in</Link>
        <Link to={ROUTES.SIGN_UP}>Create account</Link>
      </p>
    </div>
  );
}
