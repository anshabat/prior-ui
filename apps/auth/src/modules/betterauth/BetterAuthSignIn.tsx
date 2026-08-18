import { useState } from "react";
import { logout, signIn } from "./api";
import { SignInForm } from "../../components/SignInForm";
import { useLoginMutation, useSignOutMutation } from "../../hooks/useAuthApi";

interface BetterAuthSignInProps {
  refreshSession: () => Promise<unknown>;
}

export function BetterAuthSignIn({ refreshSession }: BetterAuthSignInProps) {
  const [error, setError] = useState<string | null>(null);

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
      providers={[]}
      onOAuthSignIn={() => {}}
    />
  );
}
