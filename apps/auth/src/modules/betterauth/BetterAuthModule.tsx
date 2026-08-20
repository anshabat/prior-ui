import { Layout } from "../../components/Layout";
import { BetterAuthRegister } from "./BetterAuthRegister";
import { BetterAuthResetPassword } from "./BetterAuthResetPassword";
import { BetterAuthSignIn } from "./BetterAuthSignIn";
import { getSession } from "./api";
import { useRedirectToOpener } from "../../hooks/useRedirectToOpener";
import { useSessionQuery } from "../../hooks/useAuthApi";

export function BetterAuthModule() {
  const { session, refreshSession } = useSessionQuery(() => getSession());
  useRedirectToOpener(session);

  return (
    <div>
      <h2>{session?.user.name}</h2>
      <Layout
        SignInForm={<BetterAuthSignIn refreshSession={refreshSession} />}
        RegisterForm={<BetterAuthRegister />}
        ResetPasswordForm={<BetterAuthResetPassword />}
      />
    </div>
  );
}
