import { Layout } from "../../components/Layout";
import * as api from "./api";
import { useRedirectToOpener } from "../../hooks/useRedirectToOpener";
import { useSessionQuery } from "../../hooks/useAuthApi";
import { NextAuthSignIn } from "./NextAuthSignIn";
import { NextAuthRegister } from "./NextAuthRegister";
import { NextAuthResetPassword } from "./NextAuthResetPassword";

export function NextAuthModule() {
  const { session, refreshSession } = useSessionQuery(() => api.getSession());
  useRedirectToOpener(session);

  console.log(session, "session");

  return (
    <Layout
      SignInForm={
        <NextAuthSignIn session={session} onFetchSession={refreshSession} />
      }
      RegisterForm={<NextAuthRegister />}
      ResetPasswordForm={<NextAuthResetPassword />}
    />
  );
}
