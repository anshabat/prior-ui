import { SignInForm } from "../../components/SignInForm";
import type { AuthSession } from "@workspace/api-auth";
import { useState } from "react";
import { useLoginMutation, useSignOutMutation } from "../../hooks/useAuthApi";
import * as api from "./api";
import { useOauthProvidersQuery } from "../../hooks/useProvidersApi";

type NextAuthSignInProps = {
  session: AuthSession | null;
  onFetchSession: () => Promise<unknown>;
};

export function NextAuthSignIn({
  session,
  onFetchSession,
}: NextAuthSignInProps) {
  const [isTwoFactorStep, setIsTwoFactorStep] = useState(false);
  const { oauthProviders } = useOauthProvidersQuery(api.getProviders);

  const {
    mutate: signWithCredentials,
    error: signInError,
    reset: resetSignIn,
  } = useLoginMutation(
    ({ email, password, twoFactorCode }) =>
      api.signIn({ email, password, code: twoFactorCode }),
    {
      onSuccess: (data) => {
        setIsTwoFactorStep(data.twoFactor);
      },
    },
  );

  const {
    mutate: signOut,
    error: signOutError,
    reset: resetSignOut,
  } = useSignOutMutation(api.signOut, {
    onSuccess: () => {
      setIsTwoFactorStep(false);
    },
  });

  const error = signInError?.message || signOutError?.message || null;
  const resetErrors = () => {
    resetSignIn();
    resetSignOut();
  };

  const handleOAuthSignIn = (providerId: string) => {
    const provider = oauthProviders.find((p) => p.id === providerId);
    if (!provider) return;

    const form = document.createElement("form");
    form.method = "POST";
    form.action = provider.signinUrl;

    const cb = document.createElement("input");
    cb.type = "hidden";
    cb.name = "callbackUrl";
    cb.value = `${window.location.origin}${window.location.pathname}`;

    form.appendChild(cb);

    document.body.appendChild(form);
    form.submit();
    form.remove();
  };

  const handleCancelTwoFactor = () => {
    setIsTwoFactorStep(false);
  };

  const handleFetchSession = async () => {
    resetErrors();
    await onFetchSession();
  };

  const handleSignIn = (email: string, password: string) => {
    resetErrors();
    signWithCredentials({ email, password });
  };

  const handleVerifyTwoFactor = (
    email: string,
    password: string,
    code: string,
  ) => {
    resetErrors();
    signWithCredentials({ email, password, twoFactorCode: code });
  };

  const handleSignOut = () => {
    resetErrors();
    signOut();
  };

  return (
    <SignInForm
      title={`NextAuth Login (${session?.user?.name ?? ""})`.trim()}
      error={error}
      isTwoFactorStep={isTwoFactorStep}
      onSignIn={handleSignIn}
      onVerifyTwoFactor={handleVerifyTwoFactor}
      onCancelTwoFactor={handleCancelTwoFactor}
      onGetSession={handleFetchSession}
      onSignOut={handleSignOut}
      providers={oauthProviders}
      onOAuthSignIn={handleOAuthSignIn}
    />
  );
}
