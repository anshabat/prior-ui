import { Link } from "react-router-dom";
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
      {successMessage && (
        <div style={{ marginBottom: 30, color: "green" }}>
          {successMessage}
        </div>
      )}
      <SignIn />
      <p style={{ display: "flex", gap: 16, marginTop: 24 }}>
        <Link to={ROUTES.SIGN_UP}>Create account</Link>
        <Link to={ROUTES.RESET_PASSWORD}>Forgot password?</Link>
      </p>
    </div>
  );
}
