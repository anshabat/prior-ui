import { Link } from "react-router-dom";
import { SignIn } from "../components/SignIn/SignIn.tsx";
import { useRedirectToOpener } from "../hooks/useRedirectToOpener.ts";
import { useSessionQuery } from "../hooks/useAuthApi.ts";
import { useFlashQueryParam } from "../hooks/useFlashQueryParam.ts";
import { getSuccessMessage } from "../utils";
import { ROUTES } from "../constants";

export function SignInPage() {
  const { session, refreshSession } = useSessionQuery();
  useRedirectToOpener(session);

  const flashSuccess = useFlashQueryParam("success");
  const successMessage = getSuccessMessage(flashSuccess);

  return (
    <div>
      <title>Sign in</title>
      <h2>{session?.user.name} - {session?.user.provider}</h2>
      {successMessage && (
        <div style={{ marginBottom: 30, color: "green" }}>
          {successMessage}
        </div>
      )}
      <SignIn refreshSession={refreshSession} />
      <p style={{ display: "flex", gap: 16, marginTop: 24 }}>
        <Link to={ROUTES.SIGN_UP}>Create account</Link>
        <Link to={ROUTES.RESET_PASSWORD}>Forgot password?</Link>
      </p>
    </div>
  );
}
