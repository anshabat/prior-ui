import { SignIn } from "../components/SignIn/SignIn.tsx";
import { SignUp } from "../components/SignUp/SignUp.tsx";
import { ResetPassword } from "../components/ResetPassword/ResetPassword.tsx";
import { useRedirectToOpener } from "../hooks/useRedirectToOpener.ts";
import { useSessionQuery } from "../hooks/useAuthApi.ts";
import { useFlashQueryParam } from "../hooks/useFlashQueryParam.ts";
import { getSuccessMessage } from "../utils";

export function LoginPage() {
  const { session, refreshSession } = useSessionQuery();
  useRedirectToOpener(session);

  const flashSuccess = useFlashQueryParam("success");
  const successMessage = getSuccessMessage(flashSuccess);

  return (
    <div>
      <h2>{session?.user.name} - {session?.user.provider}</h2>
      {successMessage && (
        <div style={{ marginBottom: 30, color: "green" }}>
          {successMessage}
        </div>
      )}
      <SignIn refreshSession={refreshSession} />

      <div
        style={{
          display: "flex",
          gap: 60,
          marginTop: 60,
          minWidth: 600,
          width: "100%",
        }}
      >
        <div>
          <h2>Register</h2>
          <SignUp />
        </div>

        <div>
          <h2>Reset Password</h2>
          <ResetPassword />
        </div>
      </div>
    </div>
  );
}
