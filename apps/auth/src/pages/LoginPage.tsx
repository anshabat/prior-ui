import { SignIn } from "../components/SignIn/SignIn.tsx";
import { SignUp } from "../components/SignUp/SignUp.tsx";
import { ResetPassword } from "../components/ResetPassword/ResetPassword.tsx";
import { Layout } from "../components/ui/Layout.tsx";
import { useRedirectToOpener } from "../hooks/useRedirectToOpener.ts";
import { useSessionQuery } from "../hooks/useAuthApi.ts";

export function LoginPage() {
  const { session, refreshSession } = useSessionQuery();
  useRedirectToOpener(session);

  return (
    <div>
      <h2>{session?.user.name} - {session?.user.provider}</h2>
      <Layout
        SignInForm={<SignIn refreshSession={refreshSession} />}
        RegisterForm={<SignUp />}
        ResetPasswordForm={<ResetPassword />}
      />
    </div>
  );
}
