import { useState } from "react";
import { logout, signIn, signInWithOAuth } from "./api";
import { SignInForm } from "../../components/SignInForm";
import { useLoginMutation, useSignOutMutation } from "../../hooks/useAuthApi";
import { getServerErrorMessage } from "../../utils/errors";

interface BetterAuthSignInProps {
  refreshSession: () => Promise<unknown>;
}

export function BetterAuthSignIn({ refreshSession }: BetterAuthSignInProps) {
  const [error, setError] = useState<string | null>(() =>
    getServerErrorMessage(),
  );

  const { mutate: signWithCredentials } = useLoginMutation(
    ({ email, password }) => signIn({ email, password }),
    {
      onError: (error) => {
        setError(error.message);
      },
    },
  );

  const { mutate: signOut } = useSignOutMutation(logout, {
    onSuccess: () => {
      setError(null);
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleOAuthSignIn = async (providerId: string) => {
    if (providerId === "google" || providerId === "github") {
      const result = await signInWithOAuth(providerId);
      if (result.error) {
        setError(result.error.statusText);
      }
    }
  }

  return (
    <SignInForm
      title="Better Auth Login"
      error={error}
      isTwoFactorStep={false}
      onSignIn={(email, password) => {
        setError(null);
        signWithCredentials({ email, password });
      }}
      onVerifyTwoFactor={() => {}}
      onCancelTwoFactor={() => {}}
      onGetSession={() => {
        setError(null);
        void refreshSession();
      }}
      onSignOut={() => signOut()}
      providers={[
        { id: "google", name: "Google" },
        { id: "github", name: "GitHub" },
      ]}
      onOAuthSignIn={handleOAuthSignIn}
    />
  );
}
