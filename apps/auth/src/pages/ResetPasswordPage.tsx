import { Link } from "react-router-dom";
import { ResetPassword } from "../components/ResetPassword/ResetPassword.tsx";
import { ROUTES } from "../constants";

export function ResetPasswordPage() {
  return (
    <div>
      <h2>Reset Password</h2>
      <ResetPassword />
      <p style={{ display: "flex", gap: 16, marginTop: 24 }}>
        <Link to={ROUTES.SIGN_IN}>Back to sign in</Link>
        <Link to={ROUTES.SIGN_UP}>Create account</Link>
      </p>
    </div>
  );
}
