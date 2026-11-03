import { Link } from "react-router-dom";
import { SignUp } from "../components/SignUp/SignUp.tsx";
import { ROUTES } from "../constants";

export function SignUpPage() {
  return (
    <div>
      <h2>Register</h2>
      <SignUp />
      <p style={{ display: "flex", gap: 16, marginTop: 24 }}>
        <Link to={ROUTES.SIGN_IN}>Sign in</Link>
        <Link to={ROUTES.RESET_PASSWORD}>Forgot password?</Link>
      </p>
    </div>
  );
}
