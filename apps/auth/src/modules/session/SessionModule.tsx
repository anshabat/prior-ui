import { getSession } from "./api";
import { PassportSignIn } from "./PassportSignIn";
import { PassportRegister } from "./PassportRegister";
import { PassportResetPassword } from "./PassportResetPassword";
import { Layout } from "../../components/Layout";
import { useRedirectToOpener } from "../../hooks/useRedirectToOpener";
import { useSessionQuery } from "../../hooks/useAuthApi";

export function SessionModule() {
  const { session, refreshSession } = useSessionQuery(() => getSession());
  useRedirectToOpener(session);

  console.log("SessionModule session", session);

  return (
    <div>
      <h2>{session?.user.name}</h2>
      <Layout
        SignInForm={<PassportSignIn refreshSession={refreshSession} />}
        RegisterForm={<PassportRegister />}
        ResetPasswordForm={<PassportResetPassword />}
      />
    </div>
  );
}
