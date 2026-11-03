import { SignIn } from "../components/SignIn/SignIn.tsx";
import { useRedirectToOpener } from "../hooks/useRedirectToOpener.ts";
import { useSessionQuery } from "../hooks/useAuthApi.ts";
import { useFlashQueryParam } from "../hooks/useFlashQueryParam.ts";
import { getSuccessMessage } from "../utils";

export function SignInPage() {
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
    </div>
  );
}
